let bus = require('../bus')
let Promise = require("bluebird")

let turnOn = (lightId,createdAt)=>{
    return new Promise((resolve,reject)=>{
        bus.publish(bus.ACTIONS.TURN_ON_LIGHT, {lightId:lightId, createdAt: createdAt});
        resolve()
    })
};

let turnOff = (lightId,createdAt)=>{
    return new Promise((resolve,reject)=>{
        bus.publish(bus.ACTIONS.TURN_OFF_LIGHT, {lightId:lightId, createdAt: createdAt});
        resolve()
    })
};


let turnOnAll = (createdAt)=>{
    return new Promise((resolve,reject)=>{
        bus.publish(bus.ACTIONS.TURN_ON_ALL_LIGHT, {createdAt: createdAt});
        resolve()
    })
};

let turnOffAll = (createdAt)=>{
    return new Promise((resolve,reject)=>{
        bus.publish(bus.ACTIONS.TURN_OFF_ALL_LIGHT, {createdAt: createdAt});

        resolve()
    })
};

module.exports ={
    turnOff,
    turnOn,
    turnOffAll,
    turnOnAll
}