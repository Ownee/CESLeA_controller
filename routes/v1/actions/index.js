let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;
let Promise = require("bluebird");

let objects = require("../../../model/objects");


router.get('/', function (req, res, next) {
    res.json({
        actions:[
            "finding"
        ]
    })
});


//물건을 찾는 행위가 들어왔을 때
//저장된 객체 정보를 다 불러와서 말한다.
//화면에 출력(선택)
router.post('/finding', (req, res, next) => {
    const {} = req.body;
    objects.getAll()
        .then((result)=>{
            //대화 중인지 아닌지 확인하기 (선택)

            //물건 위치 말하기
            //화면에 출력
        })
        .then((result) => {
            res.json({});
        })
        .catch((err) => {
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        })


});


module.exports = router;
