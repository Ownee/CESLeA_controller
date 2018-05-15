let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let multer = require("multer");
let upload = multer({dest:'uploads/'});
let Promise = require("bluebird");

let face = require("../../../model/face");
let speaker = require("../../../model/speaker");
let lights = require("../../../model/lights");


//방문자가 벨을 눌렀을 때 호출되는 함수
//이미지파일을 첨부해야한다.
//이미지파일을 얼굴인식 모듈로 전달해서 방문자 기본정보를 가져오고
//구글캘린더 연동시 보다 상세한 정보를 캘린더로 부터 가져온다
//방문자 저장
//음성으로 방문자가 있다고 알림
//전등을 켬으로써 알림
//화면 출력(선택)
router.post('/visit',upload.single('visitor'),(req,res,next)=>{

    if(!req.file){
        next(customError.make(400,customError.CODES.VALIDATION_FAILED,"visitor is required"));
        return;
    }

    face.recognize(req.file.path)
        .then((result)=>{
            //방문자 알리기 -> 말하기
            return speaker.speak("sentence")
        })
        .then(()=>{
            //방문자 알리기 -> 전등
            return lights.turnOn()
        })
        .then(()=>{
            rxmq.channel('alarms').subject('add').next(req.body);
            res.json({action:"visit"});
        }).catch(()=>{
            next(customError.make(500,customError.CODES.SERVER_ERROR,"error"));
    })

});



module.exports = router;
