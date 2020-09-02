let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs = require('fs');
let customError = require("./util/CustomError");
let cors = require('cors')
let indexRouter = require('./routes/v1/index');

let mysql = require('mysql');


let app = express();

/*
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pass',
    database : 'demodb'
});

connection.connect();
*/

app.post('/users', function(req, res) {
    let user = req.body;
    console.log("user : " + user)
    let sql = "INSERT INTO ceslea_tbl (person_id, summarization) VALUES ('1', 'He talks about weather')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
});

app.post('/select', function(req, res) {
    let aa = 1;
    connection.query("SELECT * FROM ceslea_tbl WHERE person_id = " + aa.toString(), function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].summarization);
    });
});

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
