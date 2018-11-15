let express = require('express');
let router = express.Router();
let Promise = require("bluebird");
let customError = require("../../../util/CustomError");
let {dispatch} = require("../../../controller/CesleaController")
let {ACTIONS} = require("../../../controller/C")

/*
router.post('/', (req, res, next) => {
    const {createdAt, speaker, speakerId, } = req.body;

    let content = req.body.content;

    let _content = content.toLowerCase();
    if(_content==="social media" || _content==="cecilia"){
        content="CESLeA"
    }

    const mMsg = {
        speaker:speaker,
        speakerId:speakerId,
        content:content,
        createdAt:createdAt
    };

    dispatch(ACTIONS.INPUT_SENTENCE,mMsg)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });

});*/

router.post('/browser', (req, res, next) => {

    const {createdAt, speaker, speakerId, } = req.body;

    let content = req.body.content;

    let _content = content.toLowerCase();
    if(_content==="social media" || _content==="cecilia"){
        content="CESLeA"
    }

    const mMsg = {
        speaker:speaker,
        speakerId:speakerId,
        content:content,
        createdAt:createdAt
    };

    dispatch(ACTIONS.INPUT_SENTENCE,mMsg)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });

});

module.exports = router;
