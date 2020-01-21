let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Promise = require("bluebird");
let {dispatch} = require("../../../controller/CesleaController");
let {ACTIONS} = require("../../../controller/C");


router.post('/', (req, res, next) => {
    const mBell = {
        createdAt: Date.now()
    };
    dispatch(ACTIONS.INPUT_BELL_SIGNAL,mBell)
        .then(() => {
            res.json({});
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
        });

});

module.exports = router;
