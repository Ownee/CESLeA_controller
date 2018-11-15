let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Promise = require("bluebird");
let {dispatch} = require("../../../controller/CesleaController")
let {ACTIONS} = require("../../../controller/C")


router.get('/faces', function (req, res, next) {
    console.log("Get Faces");
});


router.get('/:name', (req, res, next) => {
    const {name} = req.params;
    console.log("name : " + name);

    dispatch(ACTIONS.INPUT_FACE, name)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
