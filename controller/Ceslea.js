let bus = require("../bus");
let chatbot = require("../model/chatbot");
let Promise = require("bluebird");
let request = require('request');


let {ACTIONS, SITUATION, OBJECTS, PLACES, USER_ACTION, USER_INTENT, CHATBOT} = require("./C");
let {Subject, Observable} = require("rxjs");
let {merge} = require("rxjs/operators");
require("rxjs/Rx");


const STATE_KEYS = {
    BELL: "BELL",
    SITUATION: "SITUATION",
    OWNER: "OWNER",
    OWNER_OBJ: "OWNER_OBJ",
    OWNER_OBJ_PLACE: "OWNER_OBJ_PLACE",
    GUEST: "GUEST",
    GUEST_OBJ: "GUEST_OBJ",
    GUEST_OBJ_PLACE: "GUEST_OBJ_PLACE",
    ACTION: "ACTION",
    INTENT: "INTENT",
    RESPONSE_SENTENCE: "RESPONSE_SENTENCE"
};


class Ceslea {
    constructor(dispatch) {

        this.dispatch = dispatch;
        this.state = {
            [STATE_KEYS.BELL]: false,
            [STATE_KEYS.SITUATION]: SITUATION.IDLE
        };
        this.objects = [];
        this.subject = new Subject();
        this.chatbot = CHATBOT.IDLE;

        this.question_on = false;

        this.personName = 'Unknown';
        this.personId = 0;
        this.lastPersonId = 0;

        this.lastTimerId = null;

        this.preventTimerId = null;

        this.subject.subscribe(situation => {
            switch (situation.key) {
                case SITUATION.THEY_CALL_CESLEA.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    break;
                case SITUATION.THEY_ARE_TALKING_ABOUT_TRAVEL.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    this.preventState(5000);
                    break;
                case SITUATION.WATCHING_TV.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.TURN_OFF_LIGHT.key:
                    this.dispatch(ACTIONS.TURN_OFF_LIGHT);
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.CLEANING.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.WALK_TO_DOOR.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.GUEST_WALK_TO_TOILET.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.OWNER_WALK_TO_TOILET.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.SITTING_ON_SOFA.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.READING_BOOK.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }

                    break;
                case SITUATION.SEARCHING_FOR_SOMETHING.key:
                    if (!this.preventTimerId) {
                        let newMsg = "Are you looking fore something?";
                        this.chatbot = CHATBOT.EXTRA_FINDING;
                        this.dispatch(ACTIONS.SPEAK_SENTENCE, newMsg);
                        this.dispatch(ACTIONS.DISPLAY_SENTENCE, newMsg);
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    this.preventState(10000);
                    break;
                case SITUATION.TURN_LIGHT_TO_KNOW.key:
                    this.dispatch(ACTIONS.TURN_ON_LIGHT);
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    break;
                case SITUATION.BUZZER_RINGING.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    break;
                case SITUATION.CESLEA_ENTER_LISTENING.key:
                    if (!this.preventTimerId) {
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    break;
                case SITUATION.QUESTION_ON.key:
                    if (!this.preventTimerId) {
                        console.log("gesture received")
                        this.question_on = true;
                        this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
                    }
                    break;
            }


        }, err => {
            console.log("err")
        })
    }


    updateTimer() {
        if (this.lastTimerId) {
            clearTimeout(this.lastTimerId);
        }
        this.lastTimerId = setTimeout(() => {
            this.lastTimerId = null;
            this.chatbot = CHATBOT.IDLE;
        }, 60000)
    };

    updateSentence(msg) {
        let _msg = (msg || "").toLowerCase();
        let {dispatch} = this;
        this.updateTimer();

        if (this.chatbot === CHATBOT.EXTRA_FINDING) {
            let temp = this.objects.find((item) => {
                let name = (item.obj || "xxx").toLowerCase();
                return _msg.includes(name)
            });

            let responseMsg = null;
            if (_msg==="no") {
                responseMsg = "okay"
            } else if (temp) {
                responseMsg = temp.obj + " is in  " + temp.placeName
            } else {
                responseMsg = "There is no the object"
            }

            this.chatbot = CHATBOT.IDLE;

            if (responseMsg) {
                dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            }

        } else if (this.chatbot === CHATBOT.ACTIVE) {
            if (msg.includes("finish")) {
                chatbot.clear()
                    .then(() => {
                        let responseMsg = "I will summarize our conversation. We talked about"
                        dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                        dispatch(ACTIONS.SHOW_SUMMARIZATION, msg)
                        //responseMsg = "Bye. Have a nice day!"
                        //dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        //dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                        this.personId = 0;
                        this.personName = 'Unknown';
                        this.question_on = false;
                        this.updateSituation(SITUATION.CESLEA_ENTER_LISTENING);
                        this.chatbot = CHATBOT.IDLE;
                    }).catch((err) => {
                })
            } else {
                console.log("Gesture: " + this.question_on)
                if (this.question_on) {
                    this.question_on = false;
                    chatbot.sendwithQ(msg)
                        .then((result) => {
                            let responseMsg = result.sentence;
                            console.log(result.sess)
                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    chatbot.send(msg)
                        .then((result) => {
                            let responseMsg = result.sentence;
                            console.log(result.sess)
                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                            if (responseMsg.includes("Thank you for using it")) {
                                dispatch(ACTIONS.SHOW_SUMMARIZATION, responseMsg)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        } else {
            chatbot.isCeslea(msg)
                .then((result) => {
                    if (result) {
                        this.chatbot = CHATBOT.ACTIVE;
                        this.updateSituation(SITUATION.THEY_CALL_CESLEA);
                        let responseMsg = "Did you call me?";
                        dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                        //dispatch(ACTIONS.INPUT_FACE, this.personName)
                    } else {
                        chatbot.isTravel(msg)
                            .then((result) => {
                                if (result) {
                                    this.chatbot = CHATBOT.ACTIVE;
                                    chatbot.send(msg)
                                        .then((result) => {
                                            let responseMsg = result.sentence;
                                            this.updateSituation(SITUATION.THEY_ARE_TALKING_ABOUT_TRAVEL);
                                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg);
                                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg);
                                        })
                                        .catch((err) => {
                                        })

                                } else {
                                }
                            }).catch((err) => {
                        })
                    }
                });

        }

    }


    updateAction(action) {
        this.dispatch(ACTIONS.DISPLAY_ACTION, action.action);

        this.state = Object.assign({}, this.state, {
            [STATE_KEYS.ACTION]: action.action
        });

        this.getSituation(this.state)
            .subscribe(situation => {
                this.updateSituation(situation)
            }, err => {
                console.log(err);
            });
    }

    updateIntent(intent) {
        this.dispatch(ACTIONS.DISPLAY_INTENT, intent.intent);

        this.state = Object.assign({}, this.state, {
            [STATE_KEYS.INTENT]: intent.intent
        });

        this.getSituation(this.state)
            .subscribe(situation => {
                this.updateSituation(situation)
            }, err => {

            });
    }


    updateObject(obj) {

        let isFound = false;
        if (obj.objState === 1) {
            //관심 객체
            this.objects = this.objects.map((item) => {
                if (item.personId === obj.personId) {
                    isFound = true;
                    return obj;
                } else {
                    return item;
                }
            });

            if (!isFound) {
                this.objects.push(obj)
            }

            if (obj.personId === 1) {
                //주인
                this.state = Object.assign({}, this.state, {
                    [STATE_KEYS.OWNER]: obj.personId,
                    [STATE_KEYS.OWNER_OBJ]: obj.obj,
                    [STATE_KEYS.OWNER_OBJ_PLACE]: obj.place
                })

            } else if (obj.personId === 2) {
                //손님
                this.state = Object.assign({}, this.state, {
                    [STATE_KEYS.GUEST]: obj.personId,
                    [STATE_KEYS.GUEST_OBJ]: obj.obj,
                    [STATE_KEYS.GUEST_OBJ_PLACE]: obj.place
                })
            }
        } else if (obj.objState === 2) {
            //옮겨진 객체
            this.objects = this.objects.map((item) => {
                if (item.objId === obj.objId) {
                    isFound = true;
                    return obj;
                } else {
                    return item;
                }
            });
            if (!isFound) {
                this.objects.push(obj)
            }
        }
        this.dispatch(ACTIONS.DISPLAY_OBJECT, this.objects);

        this.getSituation(this.state)
            .subscribe(situation => {
                this.updateSituation(situation)
            }, err => {

            });
    }


    updateSituation(situation) {
        this.subject.next(situation);
    }


    preventState(time) {
        if (this.preventTimerId) {
            clearTimeout(this.preventTimerId);
        }

        this.preventTimerId = setTimeout(() => {
            this.preventTimerId = null;
        }, time)
    };

    getSituation(newState) {
        return Observable.create((observer) => {
            if (newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.TV_MONITOR &&
                (newState[STATE_KEYS.OWNER_OBJ_PLACE] === PLACES.KITCHEN || newState[STATE_KEYS.OWNER_OBJ_PLACE] === PLACES.ROOM) &&
                newState[STATE_KEYS.ACTION] === USER_ACTION.WALK) {
                //주인이 문쪽으로 걸어감
                observer.next(SITUATION.WALK_TO_DOOR)

            } else if (newState[STATE_KEYS.INTENT] === USER_INTENT.CLEANING_ROOM) {
                //청소 중
                observer.next(SITUATION.CLEANING)

            } else if (newState[STATE_KEYS.INTENT] === USER_INTENT.READING_A_BOOK) {
                //책 읽음
                observer.next(SITUATION.READING_BOOK)

            } else if (newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.SOFA && newState[STATE_KEYS.ACTION] === USER_ACTION.SIT) {
                //집주인과 손님이 앉음
                observer.next(SITUATION.SITTING_ON_SOFA)

            } else if (newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.TV_MONITOR || newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.LAPTOP && newState[STATE_KEYS.OWNER_OBJ_PLACE] === PLACES.REST_ROOM) {
                //집주인과 손님이 TV를 봄
                observer.next(SITUATION.WATCHING_TV)

            } else if (newState[STATE_KEYS.GUEST_OBJ] === OBJECTS.TV_MONITOR && newState[STATE_KEYS.GUEST_OBJ_PLACE] === PLACES.REST_ROOM && newState[STATE_KEYS.ACTION] === USER_ACTION.WALK) {
                //손님이 화장실로 걸어감
                observer.next(SITUATION.GUEST_WALK_TO_TOILET)

            } else if (newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.TV_MONITOR && newState[STATE_KEYS.OWNER_OBJ_PLACE] === PLACES.REST_ROOM && newState[STATE_KEYS.ACTION] === USER_ACTION.WALK) {
                //집주인이 화장실로 걸어감
                observer.next(SITUATION.OWNER_WALK_TO_TOILET)

            }else if(newState[STATE_KEYS.OWNER_OBJ] === OBJECTS.PERSON && newState[STATE_KEYS.GUEST_OBJ] === OBJECTS.PERSON){
                observer.next(SITUATION.THEY_ARE_TALKING_EACH_OTHERS)

            } else if (newState[STATE_KEYS.INTENT] === USER_INTENT.SEARCHING_FOR_SOMETHING) {
                //무언가를 찾고 있음
                observer.next(SITUATION.SEARCHING_FOR_SOMETHING)
            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.Q_ON) {
                //question on
                observer.next(SITUATION.QUESTION_ON)
            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.Q_OFF) {
                //question on
                //this.question_on = false;
            }
        });
    }

    //state 비교 할 필요 없음
    updateBell(data) {
        this.updateSituation(SITUATION.BUZZER_RINGING)

        let mappedSubject = this.subject.map((situation) => {
            // 사람이 걸어감
            if (situation.key === SITUATION.WALK_TO_DOOR.key) {
                throw Error()
            } else {
                return situation;
            }
        });
        //불키는 Observable
        let turnOnObservable = Observable.of("turnOn").delay(4000)
            .map((item) => {

                this.updateSituation(SITUATION.TURN_LIGHT_TO_KNOW)
                return item;
            });

        let turnOffObservable = Observable.of("turnOff").delay(10000)
            .map((item) => {
                this.updateSituation(SITUATION.TURN_OFF_LIGHT);
                return item;
            });

        const all = Observable.merge(
            turnOffObservable,
            mappedSubject,
            turnOnObservable,
        );

        all.subscribe((data) => {
            console.log(data)
        }, (err) => {
            console.log(err)
        });
    }

    //summarization using Dennis' model
    showSummarization(msg) {
        let {dispatch} = this;
        //let plainText = eventHandler.makePlainText(messages);
        //console.log("plainText: " + plainText);

        // request post to dennis summarization model
        // method: POST
        // uri: http://155.230.104.190:8080/articles
        // data: ["file": <SOME FILE>](only txt)

        if (msg.length > 100) {
            var req = request.post("http://155.230.104.190:8080/articles", function (err, resp, body) {
                if (err) {
                    console.log('Post Error!');
                }
                else {
                    console.log('Post Success!');
                    let myObj = JSON.parse(body);
                    dispatch(ACTIONS.DISPLAY_SENTENCE, myObj.content)
                    // dispatch(ACTIONS.SPEAK_SENTENCE, myObj.content)
                }
            });

            var form = req.form();
            form.append('file', msg, {
                filename: 'myfile.txt',
                contentType: 'text/plain'
            });
        } else if (msg.length > 0) {
            dispatch(ACTIONS.DISPLAY_SENTENCE, msg)
        } else {
            let nothingMsg = "Oh, last time we didn't talk."
            dispatch(ACTIONS.DISPLAY_SENTENCE, nothingMsg)
        }
    }

    updateFace(data) {
        let {dispatch} = this;
        if (data == 'Unknown') {
            this.personId = 0;
            this.personName = 'Unknown';
            let responseMsg = "Nice to meet you! Can I know your name?"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            return false;
        } else if (data == 'None') {
            this.personId = 0;
            this.personName = 'Unknown';
            //let responseMsg = "Nice to meet you! Can I know your name?"
            //dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            //dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            return false;
        } else {
            this.lastPersonId += 1;
            this.personId = this.lastPersonId;
            this.personName = data;
            let responseMsg = "I am glad to meet you " + this.personName + "!"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            return true;
        }
    }

    youAgain(msg) {
        let {dispatch} = this;
        let responseMsg = "It is good to see you again " + this.personName + "! Let me remind you our last conversation. Last time our conversation was"
        dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
        dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
        dispatch(ACTIONS.SHOW_SUMMARIZATION, msg)
    }

}


let createCeslea = (dispatch) => {
    return new Ceslea(dispatch);
}

module.exports = {
    createCeslea
}
