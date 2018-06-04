let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let multer = require("multer");
let upload = multer({dest: 'uploads/'});
let Promise = require("bluebird");

let face = require("../../../model/face");
let speaker = require("../../../model/speaker");
let lights = require("../../../model/lights");
let storage = require("../../../storage/index");
let visitorBuilder = require("../../../data/personBuilder");

let bus = require("../../../bus");


//방문자가 벨을 눌렀을 때 호출되는 함수
//이미지파일을 첨부해야한다.
//이미지파일을 얼굴인식 모듈로 전달해서 방문자 기본정보를 가져오고
//구글캘린더 연동시 보다 상세한 정보를 캘린더로 부터 가져온다
//방문자 저장
//음성으로 방문자가 있다고 알림
//전등을 켬으로써 알림
//화면 출력(선택)
router.get('/person', (req, res, next) => {

    let visitor = visitorBuilder.build("Friend",Date.now());

    bus.publish(bus.ACTIONS.VISIT_SOMEONE, visitor);

    storage.addVisitor(visitor)
        .then((result) => {
            return speaker.speak("visit someone")
        })
        .then(() => {
            res.json({});
        }).catch((err) => {
        console.log(err)
        next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
    })

});

router.get('/bell', (req, res, next) => {
    const current = Date.now();
    bus.publish(bus.ACTIONS.PRESS_BELL, {createdAt: current});

    return lights.turnOn(1, current)
        .then(() => {
            return res.json({});
        })
        .catch((e) => {
            return next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
        })

});

router.post('/person', (req, res, next) => {
    const {name} = req.body;
    let visitor = visitorBuilder.build(name, Date.now());

    bus.publish(bus.ACTIONS.VISIT_SOMEONE, visitor);

    storage.addVisitor(visitor)
        .then((result) => {
            return speaker.speak("visit someone")
        })
        .then(() => {
            res.json({});
        }).catch((err) => {
        console.log(err)
        next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
    })

});

router.post('/bell', (req, res, next) => {
    const current = Date.now();
    bus.publish(bus.ACTIONS.PRESS_BELL, {createdAt: current});

    return lights.turnOn(1, current)
        .then(() => {
            return res.json({});
        })
        .catch((e) => {
            return next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
        })
});


module.exports = router;
