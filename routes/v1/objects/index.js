let express = require('express');
let router = express.Router();
let customError = require("../../../util/CustomError");
let Promise = require("bluebird");
let {dispatch} = require("../../../controller/CesleaController")
let {ACTIONS} = require("../../../controller/C")

const OBJECT_MAP = {
    0: "Person",
    24: "Backpack",
    39: "Bottle",
    41: "Cup",
    56: "Chair",
    57: "Sofa",
    58: "Potted plant",
    62: "TV monitor",
    63: "Laptop",
    64: "Mouse",
    66: "Keyboard",
    67: "Remote",
    73: "Book",
    74: "Clock",
    75: "Vase",
};

const PLACE_MAP = {
    1:"Rest room",
    2:"Living room",
    3:"Kitchen",
    4:"Room",
};






router.post('/', (req, res, next) => {
    const {obj, objId, kinectId, createdAt, objState, personId, place} = req.body;


    let mObj = {
        obj: parseInt(obj) === 65 ? OBJECT_MAP[67] : OBJECT_MAP[parseInt(obj)]||"Object",
        objId: parseInt(objId) === 65 ? 67 : parseInt(objId),
        kinectId: parseInt(kinectId),
        place: parseInt(place),
        placeName: PLACE_MAP[parseInt(place)]||"OTHERS",
        createdAt: createdAt,
        personId: parseInt(personId),
        objState: parseInt(objState)
    };

    dispatch(ACTIONS.INPUT_OBJECT, mObj)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            console.log(err);
            next(customError.make(500, customError.CODES.SERVER_ERROR, "error"))
        });
});


module.exports = router;
