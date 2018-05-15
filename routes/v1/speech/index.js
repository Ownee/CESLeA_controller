let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let Promise = require("bluebird");
let messageBuilder = require("../../../data/messageBuilder");
let dialog = require("../../../model/dialog");

let validation = {
    speech: (req, res, next) => {
        req.body.createdAt = parseInt(req.body.createdAt);

        const {createdAt, speaker, speakerId, content} = req.body;

        if (!typeCheck('Number', createdAt)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "createdAt is required"));
            return;
        }
        if (!typeCheck('String', speaker)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "speaker is required"));
            return;
        }
        if (!typeCheck('String', speakerId)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "speakerId is required"));
            return;
        }
        if (!typeCheck('String', content)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "content is required"));
            return;
        }
        next();
    }

};

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});


//음성 결과가 들어 오는 함수
//음성결과( 화자, 화자ID, 내용, 생성시간)
//음성결과 들어오면 내용을 저장하고 대화를 분석한 뒤
//응답을 해야하면 문장을 생성하고 아니면 대기한다.
//화면에 출력(선택)
router.post('/', validation.speech, (req, res, next) => {
    const {createdAt, speaker, speakerId, content} = req.body;

    messageBuilder.build(speakerId, speaker, content, createdAt)
        .then(message => {
            return dialog.recognize(message)
        })
        .then((result)=>{
           //결과에 따라 응답 문장 생성 또는 대기
        })
        .then(()=>{
            rxmq.channel('alarms').subject('add').next(req.body);
            res.json(req.body);
        })
        .catch((err) => {
        next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
    });


});


module.exports = router;
