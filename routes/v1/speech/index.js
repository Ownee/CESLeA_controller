let express = require('express');
let router = express.Router();
let Promise = require("bluebird");
let customError = require("../../../util/CustomError");
let Controller = require("../../../controller/CesleaManager")

//음성 결과가 들어 오는 함수
//음성결과( 화자, 화자ID, 내용, 생성시간)
//음성결과 들어오면 내용을 저장하고 대화를 분석한 뒤
//응답을 해야하면 문장을 생성하고 아니면 대기한다.
//화면에 출력(선택)
router.post('/', (req, res, next) => {
    const {createdAt, speaker, speakerId, content} = req.body;

    const mMsg = {
        speaker:speaker,
        speakerId:speakerId,
        content:content,
        createdAt:createdAt
    };

    Controller.recognizeSentence(mMsg)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });

});


module.exports = router;
