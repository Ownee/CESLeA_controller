let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs = require('fs');
let customError = require("./util/CustomError");
let cors = require('cors')
let indexRouter = require('./routes/v1/index');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'uploads')));

app.use(cors());

app.use('/api/v1', indexRouter);

/*


app.use('/uploads/:fileId', (req, res, next) => {
    const filePath = __dirname+'/uploads/' + req.params.fileId;

    console.log(filePath)

    fs.exists(filePath, (exists) => {
        if (exists) {
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + req.params.fileId
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            next(customError.make(404,customError.CODES.NOT_FOUND,"not found"));
        }
    });
});
*/

app.use('/state', (req, res, next) => {
    res.json({
        project: "CESLeA",
        api_version: "v1",
        author: "loveloper"
    })
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(customError.make(404,customError.CODES.NOT_FOUND,"not found"));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    res.status(err.status).json({
        code: err.code,
        message: err.message
    });
});

module.exports = app;
