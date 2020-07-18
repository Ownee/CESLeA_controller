let express = require('express');
let router = express.Router();
let Promise = require("bluebird");
let customError = require("../../../util/CustomError");
let {dispatch} = require("../../../controller/CesleaController")
let {outputText} = require("../../../controller/CesleaController")
let {textOnCheck} = require("../../../controller/CesleaController")
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

router.post('/browser',  (req, res, next) => {

    const {createdAt, speaker, speakerId, chatMode} = req.body;
    console.log('chatMode: ',chatMode);
    let content = req.body.content;

    let _content = content.toLowerCase();
    if(_content==="세실리아"){
        content="CESLeA"
    }
    if(_content==="ai deck"){
        content="AI DECK"
    }

    const mMsg = {
        speaker:speaker,
        speakerId:speakerId,
        content:content,
        createdAt:createdAt,
        chatMode:chatMode
    };

    console.log(textOnCheck())
    if (textOnCheck()) {
        console.log(outputText())
    }



    dispatch(ACTIONS.INPUT_SENTENCE,mMsg)
        // .then(() => {
        //     res.json(req.body);
        // })
        // .catch((err) => {
        //     console.log(err);
        //     next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        // });

    //for googleHome
    var i = 0;
    var timer = setInterval(function() {
        ++i;
        textOnCheck().then((resbool) => {
            if (resbool) {
                res.json(outputText());
                // console.log(res);
                clearInterval(timer);
            } else if(i > 70) {
                res.json("죄송합니다만 다시 한 번 말씀해주시겠어요?");
                // console.log(res);
                clearInterval(timer);
            }
        })
    }, 100);
    //googleHomeEnd

    // setTimeout(function() {
    //     res.json(outputText())
    // }, 1500)

});

module.exports = router;
