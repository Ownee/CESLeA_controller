let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let objBuilder = require("../../../data/objBuilder");
let objects = require("../../../model/objects");
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


router.get('/:objId/:obj/:place', function (req, res, next) {
    let mObj = objBuilder.build(req.params.objId, req.params.obj, req.params.place, Date.now())
    objects.update(mObj)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err)
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


//객체 정보가 들어오는 함수
//객체 정보(객체,객체ID,장소,생성일)
//객체 정보가 들어오면 내용을 저장한다.
//화면에 출력(선택)
router.post('/', validation.speech, (req, res, next) => {
    const {obj, objId, place, createdAt} = req.body;
    console.log(req.body)

    let mObj = objBuilder.build(objId, obj, place, createdAt)
    objects.update(mObj)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err)
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
