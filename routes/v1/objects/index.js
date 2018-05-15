let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let typeCheck = require("type-check").typeCheck;
let rxmq = require('rxmq').default;


let validation = {
    speech:(req,res,next)=>{
        req.body.createdAt = parseInt(req.body.createdAt);

        const {obj,objId,place,createdAt} = req.body;


        if(!typeCheck('String',obj)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"obj is required"));
            return;
        }
        if(!typeCheck('String',objId)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"objId is required"));
            return;
        }
        if(!typeCheck('String',place)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"place is required"));
            return;
        }
        if(!typeCheck('Number',createdAt)){
            next(customError.make(400,customError.CODES.VALIDATION_FAILED,"createdAt is required"));
            return;
        }
        next();
    }

};

let makeAlarm = ()=>{

};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//객체 들어옴
router.post('/', validation.speech, (req, res, next) => {
    const {obj,objId,place,createdAt} = req.body;
    rxmq.channel('alarms').subject('add').next(req.body);
    res.json(req.body);
});



module.exports = router;
