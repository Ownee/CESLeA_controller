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

let Controller = require("../../../controller/index")

//방문자가 벨을 눌렀을 때 호출되는 함수
//이미지파일을 첨부해야한다.
//이미지파일을 얼굴인식 모듈로 전달해서 방문자 기본정보를 가져오고
//구글캘린더 연동시 보다 상세한 정보를 캘린더로 부터 가져온다
//방문자 저장
//음성으로 방문자가 있다고 알림
//전등을 켬으로써 알림
//화면 출력(선택)

router.post('/person', (req, res, next) => {
    const {name} = req.body;

    let mPerson = {
        name: name,
        createdAt: Date.now()
    };
    Controller.recognizePerson(mPerson)
        .then(() => {
            res.json({});
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
        });
});

router.post('/bell', (req, res, next) => {
    const mBell = {
        createdAt: Date.now()
    };

    Controller.recognizeBell(mBell)
        .then(() => {
            res.json({});
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"));
        });

});


module.exports = router;
