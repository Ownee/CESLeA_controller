let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Promise = require("bluebird");
let {dispatch} = require("../../../controller/CesleaController")
let {ACTIONS} = require("../../../controller/C")


router.get('/action', function (req, res, next) {
    console.log("Get Action");
});


router.get('/action/:place/:action', (req, res, next) => {
    const {action, place} = req.params;
    console.log("place : " + place);
    console.log("action : " + action);

    let mAction = {
        action: action,
        place: place
    };

    dispatch(ACTIONS.INPUT_ACTION, mAction)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});

router.get('/intent/:place/:intent', (req, res, next) => {
    const {intent, place} = req.params;

    let mIntent = {
        intent: intent,
        place: place
    };

    dispatch(ACTIONS.INPUT_INTENT,mIntent)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
