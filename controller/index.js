let Promise = require("bluebird");
let bus = require("../bus");
let messageBuilder = require("../data/messageBuilder");
let personBuilder = require("../data/personBuilder");
let actionBuilder = require("../data/actionBuilder");
let intentBuilder = require("../data/intentBuilder");
let objBuilder = require("../data/objBuilder");
let Ceslea = require("./Ceslea")


/*
    ==============================================
    변수 들 
    ==============================================

 */

let ceslea = Ceslea.createCeslea();

/*
    ==============================================
    내부 함수들
    ==============================================
 */
let _makeError = (message) => {
    return new Error(message)
};


/*
    ==============================================
    외부 함수들
    ==============================================
 */



//사람 인식
let recognizePerson = (person)=>{
    return new Promise((resolve, reject) => {
        if (!person instanceof personBuilder.PersonData) {
            reject(new Error("object is not instance of PersonData"))
        } else {
            resolve("")
        }
    })
};

let recognizeAction = (action)=>{
    return new Promise((resolve, reject) => {
        if (!action instanceof actionBuilder.ActionData) {
            reject(new Error("object is not instance of ActionData"))
        } else {
            resolve("")
        }
    })

};

let recognizeIntent = (intent)=>{
    return new Promise((resolve, reject) => {
        if (!intent instanceof intentBuilder.IntentData) {
            reject(new Error("object is not instance of IntentData"))
        } else {
            resolve("")
        }
    })
};

let recognizeObject = (obj)=>{
    return new Promise((resolve, reject) => {
        if (!obj instanceof objBuilder.ObjData) {
            reject(new Error("object is not instance of ObjData"))
        } else {
            resolve("")
        }
    })
};

let recognizeBell = ()=>{
    return new Promise((resolve, reject) => {
        resolve("")

        
    })
};


/*
    ===================================================
    챗봇
    ===================================================
 */


let updateState = (action,data)=>{
    ceslea.updateState(action,data)
};



let lastTimerId = null;

let timeout = () => {
    lastTimerId = null;
    ceslea.inactiveChatbot();
};

let updateTimer = () => {
    if (lastTimerId) {
        clearTimeout(lastTimerId);
    }
    lastTimerId = setTimeout(timeout, 60000)
};


let recognizeSentence = (message) => {
    return new Promise((resolve, reject) => {
        if (!message instanceof messageBuilder.message) {
            reject(new Error("object is not instance of message"))
        } else {
            resolve("")
        }
    })


};

let recognizeSentenceForceActive = (message) => {
    ceslea.activeChatbot()
    return recognizeSentence(message)

};


module.exports = {
    updateState,
    recognizeSentence,
    recognizeSentenceForceActive
}