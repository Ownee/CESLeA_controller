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
        case Ceslea.ACTION.TURN_ON_LIGHT:
            _turnOnLight();
            break;
        case Ceslea.ACTION.TURN_OFF_LIGHT:
            _turnOffLight();
            break;
        case Ceslea.ACTION.DISPLAY_SITUATION:
            _displaySituation(data);
            break;
        case Ceslea.ACTION.DISPLAY:
            _displayMessage(data);
            break;
        case Ceslea.ACTION.SPEAK:
            _speakMessage(data);
            break;
        case Ceslea.ACTION.UPDATE_ACTION:
            _displayAction(data);
            break;
        case Ceslea.ACTION.UPDATE_INTENT:
            _displayIntent(data);
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

let _displaySituation = (content) => {
    bus.publish(bus.ACTIONS.UPDATE_SITUATION, {
        content: content
    })
};


let _displayMessage = (content) => {
    bus.publish(bus.ACTIONS.DISPLAY, {
        person: "CESLeA",
        content: content
    })
};


let _displayAction = (content) => {
    bus.publish(bus.ACTIONS.UPDATE_ACTION, {
        action: content
    })
};


let _displayIntent = (content) => {
    bus.publish(bus.ACTIONS.UPDATE_INTENT, {
        intent: content
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

let _turnOnLight = () => {
    bus.publish(bus.ACTIONS.TURN_ON_LIGHT)
};
let _turnOffLight = () => {
    bus.publish(bus.ACTIONS.TURN_OFF_LIGHT)
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
        ceslea.updateBell();
        resolve("");
    })
};



/*
    ===================================================
    챗봇
    ===================================================
 */



let recognizeSentence = (message) => {
    let msg = message.content.toLowerCase();
    if(msg==="social media" || msg==="cecilia"){
        message.content="CESLeA"
    }
    _displayMessageFromOthers(message.speaker, message.content);

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