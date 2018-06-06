let bus = require("../bus");
let chatbot = require("../model/chatbot");
let Promise = require("bluebird");

const STATE = {
    CHATBOT: {
        ACTIVE: "ACTIVE",
        IDLE: "IDLE",
        EXTRA_FINDING: "EXTRA_FINDING",
    },
    INPUT: {
        GUEST: "GUEST",
        GUEST_OBJ: "GUEST_OBJ",
        GUEST_LOCATION: "GUEST_LOCATION",
        OWNER: "OWNER",
        OWNER_OBJ: "OWNER_OBJ",

        OBJ: "OBJ",
        ACTION: "ACTION",
        INTENT: "INTENT",
    },
};

const ACTION = {
    TURN_LIGHT: "TURN_LIGHT",
    ASK_TRAVEL: "ASK_TRAVEL",
    ASK_OBJECT: "ASK_OBJECT",
    GREETING: "GREETING",
    DISPLAY: "DISPLAY",
    SPEAK: "SPEAK",
};


let _getPlaceNameFromNumber = (placeNum) => {

    let _placeNum = parseInt(placeNum);

    switch (_placeNum) {
        case 1:
            return "Rest room";
        case 2:
            return "Living room";
        case 3:
            return "Kitchen";
        default:
            return "Room";
    }
};

class Ceslea {
    constructor(listener) {

        this.listener = listener;
        this.lastUpdateId = null;
        this.lastTimerId = null;
        this.chatbot = STATE.CHATBOT.IDLE;
        this.state = {
            GUEST: "",
            GUEST_OBJ: "",

            OWNER: "",
            OWNER_OBJ: "",

            GUEST_LOCATION: "",

            OBJ: "",

            ACTION: "",

            INTENT: "",
        };
        this.objects = []
        setInterval(this.checkState.bind(this),1000);
    }

    activeChatbot() {
        this.chatbot = STATE.CHATBOT.ACTIVE
    }

    activeExtraFinding() {
        this.chatbot = STATE.CHATBOT.EXTRA_FINDING
    }

    inactiveChatbot() {
        this.chatbot = STATE.CHATBOT.IDLE
    }

    updateTimer() {
        if (this.lastTimerId) {
            clearTimeout(this.lastTimerId);
        }
        this.lastTimerId = setTimeout(()=>{
            this.lastTimerId = null;
            this.inactiveChatbot();
        }, 60000)
    };


    recognizeSentence(msg) {
        this.updateTimer();
        return new Promise((resolve, reject) => {

            if (this.chatbot === Ceslea.STATE.CHATBOT.EXTRA_FINDING) {
                let temp = this.objects.find((item) => {
                    return msg.includes(item.obj)
                });

                let responseMsg = null;
                if (temp) {
                    responseMsg = temp.obj + " is in  " + _getPlaceNameFromNumber(temp.place)
                } else {
                    responseMsg = "There is no the object"
                }

                this.inactiveChatbot();

                if (responseMsg) {
                    this.listener(ACTION.DISPLAY,responseMsg);
                    this.listener(ACTION.SPEAK,responseMsg);
                    resolve({})
                } else {
                    reject(new Error())
                }

            } else if (this.chatbot === Ceslea.STATE.CHATBOT.ACTIVE) {
                if (msg.includes("finish")) {
                    chatbot.clear()
                        .then(() => {
                            this.inactiveChatbot();
                            resolve()
                        }).catch((err) => {
                        reject(err)
                    })
                } else {

                    chatbot.send(msg)
                        .then((result) => {
                            let responseMsg = result.sentence;
                            this.listener(ACTION.DISPLAY,responseMsg);
                            this.listener(ACTION.SPEAK,responseMsg);
                            resolve({})
                        })
                        .catch((err) => {
                            console.log(err)
                            reject(err)
                        })

                }
            } else {
                chatbot.isCeslea(msg)
                    .then((result) => {
                        if (result) {
                            this.activeChatbot();
                            let responseMsg = "Did you call me?";
                            this.listener(ACTION.DISPLAY,responseMsg);
                            this.listener(ACTION.SPEAK,responseMsg);
                            resolve({})
                        } else {
                            chatbot.isTravel(msg)
                                .then((result) => {
                                    if (result) {
                                        this.activeChatbot();
                                        chatbot.send(msg)
                                            .then((result) => {
                                                let responseMsg = result.sentence;
                                                this.listener(ACTION.DISPLAY,responseMsg);
                                                this.listener(ACTION.SPEAK,responseMsg);
                                                resolve({})
                                            })
                                            .catch((err) => {
                                                reject(err)
                                            })

                                    } else {
                                        resolve({})
                                    }
                                }).catch((err) => {
                                reject(err)
                            })
                        }
                    });

            }


        })

    }

    checkState() {
        console.log("===================================")
        console.log(this)
        console.log("===================================")
    }

    updateAction(action) {
        let prevAction = this.state[STATE.INPUT.ACTION]

    }

    updateIntent(intent) {
        let prevIntent = this.state[STATE.INPUT.INTENT]
    }

    updatePerson(person) {

    }

    updateObject(obj) {

    }

}

let createCeslea = () => {
    return new Ceslea();
}

module.exports = {
    createCeslea,
    STATE,
    ACTION
}