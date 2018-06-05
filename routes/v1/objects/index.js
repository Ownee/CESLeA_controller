let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Controller = require("../../../controller/CesleaManager")


//객체 정보가 들어오는 함수
//객체 정보(객체,객체ID,장소,생성일)
//객체 정보가 들어오면 내용을 저장한다.
//화면에 출력(선택)
router.post('/', (req, res, next) => {
    const {obj, objId, kinectId, createdAt, objState, personId, place} = req.body;
    let mObj = {
        obj:obj,
        objId:objId,
        kinectId:kinectId,
        place:place,
        createdAt:createdAt,
        personId:personId,
        objState:objState
    };
    console.log(mObj);
    Controller.recognizeObject(mObj)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
