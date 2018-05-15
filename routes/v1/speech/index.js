let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;

let validation = {
    speech:(req,res,next)=>{
        req.body.createdAt = parseInt(req.body.createdAt);

        const {createdAt,speaker,speakerId,content} = req.body;

        if(!typeCheck('Number',createdAt)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"createdAt is required"));
            return;
        }
        if(!typeCheck('String',speaker)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"speaker is required"));
            return;
        }
        if(!typeCheck('String',speakerId)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"speakerId is required"));
            return;
        }
        if(!typeCheck('String',content)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"content is required"));
            return;
        }
        next();
    }

};

let makeAlarm = ()=>{

};

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

//음성
router.post('/', validation.speech, (req, res, next) => {
    const {createdAt,speaker,speakerId,content} = req.body;
    rxmq.channel('alarms').subject('add').next(req.body);
    res.json(req.body);
});


module.exports = router;
