let express = require('express');
let router = express.Router();
let objects = require("./objects/index");
let speech = require("./speech/index");

router.use('/objects', objects)

router.use('/speech', speech)

module.exports = router;
