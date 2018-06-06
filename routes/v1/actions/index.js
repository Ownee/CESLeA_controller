let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Promise = require("bluebird");
let Controller = require("../../../controller/CesleaManager")


//http:localhost:3001/api/v1/actions/action/{action name}
//http:localhost:3001/api/v1/actions/intent/{intent name}

router.get('/action/:place/:action', (req, res, next) => {
    const {action, place} = req.params;

    let mAction = {
        action: action,
        place: place
    };

    Controller.recognizeAction(mAction)
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
    Controller.recognizeIntent(mIntent)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
