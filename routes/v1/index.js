let express = require('express');
let router = express.Router();
let objects = require("./objects/index");
let speech = require("./speech/index");
let visit = require("./visit/index");
let actions = require("./actions/index");
let Promise = require("bluebird");
let customError = require("../../util/CustomError");


router.use('/objects', objects);

router.use('/speech', speech);

router.use('/visit', visit);

router.use('/actions', actions);

/*

router.use('/test',(req,res,next)=>{
    Promise.try(()=>{
        console.log("start")
    }).then(()=> {
        console.log("here");
        return res.json({action: "test"})
    }).catch((err)=>{
        next(customError.make(404,customError.CODES.NOT_FOUND));
    });
});
*/


module.exports = router;
