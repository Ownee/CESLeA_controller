let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let objBuilder = require("../../../data/objBuilder");
let Promise = require("bluebird");


let validation = {
    speech: (req, res, next) => {
        req.body.createdAt = parseInt(req.body.createdAt);

        const {obj, objId, place, createdAt} = req.body;


        if (!typeCheck('String', obj)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "obj is required"));
            return;
        }
        if (!typeCheck('String', objId)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "objId is required"));
            return;
        }
        if (!typeCheck('String', place)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "place is required"));
            return;
        }
        if (!typeCheck('Number', createdAt)) {
            next(customError.make(400, customError.CODES.VALIDATION_FAILED, "createdAt is required"));
            return;
        }
        next();
    }

};


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


//객체 정보가 들어오는 함수
//객체 정보(객체,객체ID,장소,생성일)
//객체 정보가 들어오면 내용을 저장한다.
//화면에 출력(선택)
router.post('/', validation.speech, (req, res, next) => {
    const {obj, objId, place, createdAt} = req.body;

    objBuilder.build(objId, obj, place, createdAt)
        .then(result => {
            //객체 저장
        })
        .then(() => {
            rxmq.channel('alarms').subject('add').next(req.body);
            res.json(req.body);

        })
        .catch((err) => {
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });


});


module.exports = router;
