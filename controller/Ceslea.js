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
        BELL:"BELL"
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

            BELL:""
        };
        this.objects = [];
        setInterval(this.checkState.bind(this),3000)
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
        let listener = this.listener;
        return new Promise((resolve, reject) => {

            if (this.chatbot === STATE.CHATBOT.EXTRA_FINDING) {
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
                    listener(ACTION.DISPLAY,responseMsg);
                    listener(ACTION.SPEAK,responseMsg);
                    resolve({})
                } else {
                    reject(new Error())
                }

            } else if (this.chatbot === STATE.CHATBOT.ACTIVE) {
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
                            listener(ACTION.DISPLAY,responseMsg);
                            listener(ACTION.SPEAK,responseMsg);
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
                            listener(ACTION.DISPLAY,responseMsg);
                            listener(ACTION.SPEAK,responseMsg);
                            resolve({})
                        } else {
                            chatbot.isTravel(msg)
                                .then((result) => {
                                    if (result) {
                                        this.activeChatbot();
                                        chatbot.send(msg)
                                            .then((result) => {
                                                let responseMsg = result.sentence;
                                                listener(ACTION.DISPLAY,responseMsg);
                                                listener(ACTION.SPEAK,responseMsg);
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
        console.log("===================================");
        console.log(this.state)

        //if bell true -> false

        this.state = Object.assign({},this.state,{
            [STATE.INPUT.BELL]:0
        })

    }

    updateAction(action) {
        this.state = Object.assign({},this.state,{
            [STATE.INPUT.INTENT]:action.action
        })

    }

    updateIntent(intent) {
        this.state = Object.assign({},this.state,{
            [STATE.INPUT.INTENT]:intent.intent
        })

    }

    updatePerson(person) {

    }

    updateObject(obj) {
        if(obj.objState===2){
            //옮겨진 물체
            this.state = Object.assign({},this.state,{
                [STATE.INPUT.OBJ]:obj.obj,
            })
        }else if(obj.objState===1){
            //관심객체
            if(obj.personId===0){
                //주인
                this.state = Object.assign({},this.state,{
                    [STATE.INPUT.OWNER]:obj.personId,
                    [STATE.INPUT.OWNER_OBJ]:obj.obj
                })
            }else if(obj.personId===1){
                //손님
                this.state = Object.assign({},this.state,{
                    [STATE.INPUT.GUEST]:obj.personId,
                    [STATE.INPUT.GUEST_OBJ]:obj.obj
                })
            }else{

            }
        }

    }

    updateBell(){
        this.state = Object.assign({},this.state,{
            [STATE.INPUT.BELL]:1
        })
    }

}

let createCeslea = (listener) => {
    return new Ceslea(listener);
}

module.exports = {
    createCeslea,
    STATE,
    ACTION
}