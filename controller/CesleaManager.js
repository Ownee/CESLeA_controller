let Promise = require("bluebird");
let Ceslea = require("./Ceslea");
let bus = require("../bus/index");
let chatbot = require("../model/chatbot")

/*
    ==============================================
    변수 들 
    ==============================================

 */

let listener = (action, data) => {
    switch (action) {
        case Ceslea.ACTION.ASK_OBJECT:
            _askObject();
            break;
        case Ceslea.ACTION.TURN_LIGHT:
            _turnLight();
            break;
        case Ceslea.ACTION.GREETING:

            break;
        case Ceslea.ACTION.DISPLAY:
            _displayMessage(data);
            break;
        case Ceslea.ACTION.SPEAK:
            _speakMessage(data);
            break;

        default:
            break;
    }
};

let ceslea = Ceslea.createCeslea(listener);



/*
    ==============================================
    내부 함수들
    ==============================================
 */
let _makeError = (message) => {
    return new Error(message)
};

let _displayMessage = (content) => {
    bus.publish(bus.ACTIONS.DISPLAY, {
        person: "CESLeA",
        content: content
    })
};

let _displayMessageFromOthers = (person, content) => {
    bus.publish(bus.ACTIONS.DISPLAY, {
        person: person,
        content: content
    })
};
let _askObject = ()=>{
    ceslea.activeExtraFinding();
    let responseMsg = "What are you looking for?";
    _speakMessage(responseMsg);
    _displayMessage(responseMsg);
};

let _speakMessage = (content) => {
    bus.publish(bus.ACTIONS.SPEAK, content)
};

let _turnLight = () => {
    bus.publish(bus.ACTIONS.TURN_LIGHT)
};


/*
    ==============================================
    외부 함수들
    ==============================================
 */


//사람 인식
let recognizePerson = (person) => {
    return new Promise((resolve, reject) => {
        ceslea.updatePerson(person);
        resolve("")
    })
};

let recognizeAction = (action) => {
    return new Promise((resolve, reject) => {
        ceslea.updateAction(action);
        resolve("")
    })

};

let recognizeIntent = (intent) => {
    return new Promise((resolve, reject) => {
        ceslea.updateIntent(intent);
        resolve("")

    })
};

let recognizeObject = (obj) => {
    return new Promise((resolve, reject) => {
        ceslea.updateObject(obj);
        resolve("")
    })
};

let recognizeBell = (bell) => {
    return new Promise((resolve, reject) => {
        resolve("")
    })
};


/*
    ===================================================
    챗봇
    ===================================================
 */



let recognizeSentence = (message) => {

    _displayMessageFromOthers(message.speaker, message.content);
    let msg = message.content.toLowerCase();
    return ceslea.recognizeSentence(msg)

};

let recognizeSentenceForceActive = (message) => {
    ceslea.activeChatbot();
    return recognizeSentence(message)

};


module.exports = {
    recognizeSentence,
    recognizePerson,
    recognizeAction,
    recognizeIntent,
    recognizeBell,
    recognizeObject,
    recognizeSentenceForceActive
}