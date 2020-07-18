let bus = require("../bus");
let chatbot = require("../model/chatbot");
let Promise = require("bluebird");
let request = require('request');
let opn = require('opn');
let robot = require("robotjs");

let {ACTIONS, SITUATION, OBJECTS, PLACES, USER_ACTION, USER_INTENT, CHATBOT, CHAT_MODULE_STATE} = require("./C");
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
        this.summary_on = false;
        this.text_on = false;

        this.faceInput = 'None';
        this.personName = 'None';
        this.theName = 'Mr.Who';

        this.personId = 0;
        this.lastPersonId = 0;
        this.line_num = 0;
        this.self_check = false;

        this.intro_check = 0;
        this.action_check = 0;
        this.face_new_check = 0;

        this.whatAction = "";
        this.abstraction_check = 0;
        this.finish_check = 0;
        this.info_check = false;

        this.face_restart = false;

        this.textStack = " ";

        this.chatmode = 'max'

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
                        //this.dispatch(ACTIONS.DISPLAY_SITUATION, situation);
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

    updateSentence(msg,chatMode) {

        let _msg = (msg || "").toLowerCase();
        let {dispatch} = this;
        this.updateTimer();

        if(chatMode==='semi' && this.chatmode === 'max' ){
            dispatch(ACTIONS.CHANGE_MODE_SEMI, msg)
        }else if(chatMode==="max" && this.chatmode === 'semi' ){
            dispatch(ACTIONS.CHANGE_MODE_MAX, msg)
        }

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
            if (_msg === "끝내기") {
                chatbot.clear()
                    .then(() => {
                        if (this.summary_on) {
                            let responseMsg = "그러면 저희 대화를 요약해보겠습니다."
                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SHOW_SUMMARIZATION, msg)
                        } else {
                            let responseMsg = "그럼 안녕."
                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                            dispatch(ACTIONS.CLEANSING_DB, "BOOM")
                        }
                        //responseMsg = "Bye. Have a nice day!"
                        //dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        //dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                        this.updateSituation(SITUATION.CESLEA_ENTER_LISTENING);
                        this.chatbot = CHATBOT.IDLE;

                        this.question_on = false;
                        this.summary_on = false;

                        this.faceInput = 'None';
                        this.personName = 'None';
                        this.theName = 'Mr.Who';

                        this.personId = 0;
                        this.lastPersonId = 0;
                        this.line_num = 0;
                        this.self_check = false;
                        this.info_check = false;

                        this.intro_check = 0;
                        this.action_check = 0;
                        this.face_new_check = 0;

                        this.whatAction = "";
                        this.abstraction_check = 0;
                        this.finish_check = 0;

                        this.face_restart = false;
                    }).catch((err) => {
                })
            } else {
                console.log("Gesture: " + this.question_on)
                if (this.finish_check == 1 && (_msg.includes('아니') || _msg.includes('싫어') || _msg.includes("아뇨") || _msg.includes('않') || _msg.includes("그만"))) {
                    this.finish_check = 0;
                    let responseMsg = "OK! Please concentrate on me.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else if (this.finish_check == 1 && (_msg.includes('응') || _msg.includes('그래') || _msg.includes('예') || _msg.includes('네') || _msg.includes('좋') || _msg.includes('당연'))) {
                    this.finish_check = 0;
                    chatbot.clear()
                        .then(() => {
                            if (this.summary_on) {
                                let responseMsg = "그러면 저희 대화를 요약해보겠습니다."
                                dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                                dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                                dispatch(ACTIONS.SHOW_SUMMARIZATION, msg)
                            } else {
                                let responseMsg = "OK, bye."
                                dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                                dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                                dispatch(ACTIONS.CLEANSING_DB, "BOOM")
                            }
                            //responseMsg = "Bye. Have a nice day!"
                            //dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            //dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                            this.updateSituation(SITUATION.CESLEA_ENTER_LISTENING);
                            this.chatbot = CHATBOT.IDLE;

                            this.question_on = false;
                            this.summary_on = false;

                            this.faceInput = 'None';
                            this.personName = 'None';
                            this.theName = 'Mr.Who';

                            this.personId = 0;
                            this.lastPersonId = 0;
                            this.line_num = 0;
                            this.self_check = false;
                            this.info_check = false;

                            this.intro_check = 0;
                            this.action_check = 0;
                            this.face_new_check = 0;

                            this.whatAction == "";
                            this.abstraction_check = 0;
                            this.finish_check = 0;

                            this.face_restart = false;
                        }).catch((err) => {
                    })
                } else if (this.abstraction_check == 1 && (_msg.includes('아니') || _msg.includes('싫어') || _msg.includes("아뇨") || _msg.includes('않') || _msg.includes("그만"))) {
                    this.abstraction_check = 0;
                    let responseMsg = "OK! We can have another conversation.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else if (this.abstraction_check == 1 && (_msg.includes('응') || _msg.includes('그래') || _msg.includes('예') || _msg.includes('네') || _msg.includes('좋') || _msg.includes('당연'))) {
                    this.abstraction_check = 0;
                    dispatch(ACTIONS.SHOW_SUMMARIZATION, msg)
                    let responseMsg = "This is the summary of our last conversation. Let's continue to another conversation.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else if (this.intro_check == 1) {
                    let responseMsg = "지난번에 제 소개를 덜 했는데 더 들으실래요?";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    this.intro_check = 3;
                } else if (this.intro_check == 2) {
                    let responseMsg = "지난번에 제 소개는 끝냈습니다만, 다시 들으실래요?";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    this.intro_check = 3;
                    // chatbot.sendwithQ(msg, this.line_num, this.question_on)
                    //     .then((result) => {
                    //         let responseMsg = result.sentence;
                    //         console.log(result.sess)
                    //         this.line_num = parseInt(result.sess.line_num);
                    //         dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    //         dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    //     })
                    //     .catch((err) => {
                    //         console.log(err)
                    //     })
                } else if (this.intro_check == 3 && (_msg.includes('아니') || _msg.includes('싫어') || _msg.includes("아뇨") || _msg.includes('않') || _msg.includes("그만"))) {
                    this.intro_check = 0;
                    dispatch(ACTIONS.CHANGE_MODE_CHITCHAT, msg)
                    let responseMsg = "네 그러면 다른 주제로 이야기하죠.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else if (this.action_check == 1 && (_msg.includes('응') || _msg.includes('그래') || _msg.includes('예') || _msg.includes('네') || _msg.includes('좋') || _msg.includes('당연'))) {
                    this.action_check = 0;
                    let responseMsg = "OK! I will show you some video.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    opn("https://www.youtube.com/results?search_query=" + this.whatAction);
                    // chatbot.sendwithQ(msg, this.line_num, this.question_on)
                    //     .then((result) => {
                    //         let responseMsg = result.sentence;
                    //         console.log(result.sess)
                    //         this.line_num = parseInt(result.sess.line_num);
                    //         dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    //         dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    //     })
                    //     .catch((err) => {
                    //         console.log(err)
                    //     })
                } else if (this.action_check == 1 && (_msg.includes('아니') || _msg.includes('싫어') || _msg.includes("아뇨") || _msg.includes('않') || _msg.includes("그만"))) {
                    this.action_check = 0;
                    let responseMsg = "OK, Never mind.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else if (this.info_check === true && !_msg.includes("다음") && !_msg.includes("video")) {
                    let responseMsg = "대화를 계속하시려면 '다음'이라고 말해주세요.";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                // } else if (this.state[STATE_KEYS.ACTION] === 'stretching') {
                //     let responseMsg = "피곤하시면 잠깐 휴식을 취하시는게 어떤가요.";
                //     dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                //     dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                } else {
                    if (this.intro_check == 3 && (_msg.includes('응') || _msg.includes('그래') || _msg.includes('예') || _msg.includes('네') || _msg.includes('좋') || _msg.includes('당연'))) {
                        this.intro_check = 0;
                        // dispatch(ACTIONS.CHANGE_MODE_INTRO, msg)
                        dispatch(ACTIONS.CHANGE_MODE_CHITCHAT, msg)
                        let responseMsg = "죄송해요 지금은 자기 소개를 못합니다. 다른 주제로 이야기하죠.";
                        dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    }
                    if (this.info_check === true && _msg.includes("다음")) {
                        robot.keyTap("9", "control");
                        robot.keyTap("w", "control");
                        this.info_check = false;
                    }
                    // let responseMsg = msg;
                    // dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    // dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    chatbot.sendwithQ(msg, this.line_num, this.question_on)
                        .then((result) => {
                            let responseMsg = result.sentence;
                            console.log(result.sess)
                            this.info_check = JSON.parse(result.sess.event_flag);
                            this.line_num = parseInt(result.sess.line_num);
                            if (this.line_num >= 0) {
                                this.summary_on = true;
                            }
                            if (parseInt(result.sess.state) == CHAT_MODULE_STATE.SELFINTRO) {
                                this.self_check = true;
                            } else {
                                this.self_check = false;
                            }
                            if (responseMsg.includes("continue to another conversation.")) {
                                responseMsg = responseMsg + " 그러면 저희 대화를 요약해보겠습니다."
                            }
                            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                            if (responseMsg.includes("다른 주제로 이야기하죠")) {
                                dispatch(ACTIONS.SHOW_SUMMARIZATION, msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    if (this.question_on) {
                        this.question_on = false;
                    }
                }

                // } else {
                //     chatbot.send(msg)
                //         .then((result) => {
                //             let responseMsg = result.sentence;
                //             console.log(result.sess)
                //             dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                //             dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                //             if (responseMsg.includes("Thank you for using it")) {
                //                 dispatch(ACTIONS.SHOW_SUMMARIZATION, responseMsg)
                //             }
                //         })
                //         .catch((err) => {
                //             console.log(err)
                //         })
                // }
            }
        } else if (this.chatbot === CHATBOT.FACE) {
            if (msg.includes("끝내기")) {
                chatbot.clear()
                    .then(() => {
                        this.updateSituation(SITUATION.CESLEA_ENTER_LISTENING);
                        this.chatbot = CHATBOT.IDLE;

                        this.question_on = false;
                        this.summary_on = false;

                        this.faceInput = 'None';
                        this.personName = 'None';
                        this.theName = 'Mr.Who';

                        this.personId = 0;
                        this.lastPersonId = 0;
                        this.line_num = 0;
                        this.self_check = false;
                        this.info_check = false;

                        this.intro_check = 0;
                        this.action_check = 0;
                        this.face_new_check = 0;

                        this.whatAction = "";
                        this.abstraction_check = 0;
                        this.finish_check = 0;

                        this.face_restart = false;
                    }).catch((err) => {
                })
            } else if (this.personName === 'Unknown') {
                if (this.face_new_check === 0) {
                    this.theName = _msg.split(' ').pop();
                    console.log(this.theName)
                    let responseMsg = "성함이 " + this.theName + ", 맞나요?";
                    dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                    dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    this.face_new_check = 1;
                } else if (this.face_new_check === 1) {
                    if (_msg.includes('응') || _msg.includes('그래') || _msg.includes('예') || _msg.includes('네') || _msg.includes('좋') || _msg.includes('당연')) {
                        var req = request.get("http://192.168.0.3:3004/regist?name=" + this.theName, function (err, res, body) {
                            if (err) {
                                console.log('Face name send Error!');
                            }
                            else {
                                console.log('Face name send Success!');
                                console.log(body);
                                dispatch(ACTIONS.INPUT_FACE, body)
                            }
                        });
                    } else {
                        let responseMsg = "죄송하지만 성함을 다시 한 번 말씀해주시겠어요?"
                        dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
                    }
                    this.face_new_check = 0;
                } else {

                }
                // var req = request.get("http://192.168.0.3:3004/process_enroll", function (err, res, body) {
                //     if (err) {
                //         console.log('Face enroll Error!');
                //     }
                //     else {
                //         console.log('Face enroll Success!');
                //         console.log(body);
                //         dispatch(ACTIONS.INPUT_FACE, body)
                //     }
                // });
            }
        } else {
            chatbot.isCeslea(msg)
                .then((result) => {
                    if (result) {
                        this.chatbot =  CHATBOT.FACE; //CHATBOT.FACE;
                        this.updateSituation(SITUATION.THEY_CALL_CESLEA);
                        // let responseMsg = "Did you call me?";
                        // dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
                        // dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)

                        // this.personName = "Juhee"
                        // dispatch(ACTIONS.INPUT_FACE, this.personName)
                        // VERY IMPORTANT FACE USAGE (UP OR DOWN)
                        var req = request.get("http://192.168.0.22:3004/sendagain", function (err, res, body) {
                            if (err) {
                                console.log('Face sendagain Error!');
                            }
                            else {
                                console.log('Face sendagain Success!');
                                console.log(body);
                                dispatch(ACTIONS.INPUT_FACE, body)
                            }
                        });

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
        if (action.action != USER_ACTION.Q_ON && action.action != USER_ACTION.Q_OFF) {
            this.dispatch(ACTIONS.DISPLAY_ACTION, action.action);
        }

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
        let {dispatch} = this;
        this.dispatch(ACTIONS.DISPLAY_INTENT, intent.intent);

        this.state = Object.assign({}, this.state, {
            [STATE_KEYS.INTENT]: intent.intent
        });

        this.getSituation(this.state)
            .subscribe(situation => {
                this.updateSituation(situation)
            }, err => {

            });

        // if (this.action_check == 0 && this.chatbot === CHATBOT.ACTIVE && intent.intent != 'None' && intent.intent != 'Nothing') {
        //     this.action_check = 1;
        //     this.whatAction = intent.intent;
        //     let responseMsg = "You look interested in " + this.whatAction + ". Do you want to see a related video?";
        //     dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
        //     dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
        // }

        setTimeout(function(point) {
            point.dispatch(ACTIONS.DISPLAY_INTENT, "None");
        }, 6000, this);
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

            if (obj.personId === 0) { //1
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

            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.STRETCHING) {


            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.READING) {
                //책읽기
                //Hue
                console.log('들어오긴했다')
                var huereq = request.get("http://192.168.0.43:5001/light/on", function (err, resp, body) {
                    if (err) {
                        console.log('Hue Error!');
                    } else {
                        console.log('Hue On!');
                    }
                });

                observer.next(SITUATION.READING_BOOK)

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
            } else if ((newState[STATE_KEYS.ACTION] === USER_ACTION.Swiping_Right || newState[STATE_KEYS.ACTION] === USER_ACTION.Swiping_Left) && this.info_check === true) {
                robot.keyTap("9", "control");
                robot.keyTap("w", "control");
                this.info_check = false;
            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.Stop && this.info_check === true) {
                robot.keyTap("9", "control");
                robot.keyTap("space");
            } else if (newState[STATE_KEYS.ACTION] === USER_ACTION.Keep_Going && this.info_check === true) {
                robot.keyTap("9", "control");
                robot.keyTap("space");
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

        if (msg.length > 0) {

            var req = request.post("https://chat.neoali.com:8072/translate",{form:{String:msg, ori:'kr', tar:'en'}}, function (err, resp, body) {
                if (err) {
                    console.log('Post Error!');
                }
                else {
                    console.log('Post Success!');
                    console.log(body);
                    let enmsg = body; //JSON.parse(body);
                    var req2 = request.post("https://chat.neoali.com:8072/summary_short",{form:{String:enmsg}}, function (err, resp, body) {
                        if (err) {
                            console.log('Post Error!');
                        }
                        else {
                            console.log('Post Success!');
                            console.log(body);
                            let abstra = body; //JSON.parse(body);
                            var req3 = request.post("https://chat.neoali.com:8072/translate",{form:{String:abstra, ori:'en', tar:'kr'}}, function (err, resp, body) {
                                if (err) {
                                    console.log('Post Error!');
                                }
                                else {
                                    console.log('Post Success!');
                                    console.log(body);
                                    let myObj = JSON.parse(body);
                                    console.log(myObj);
                                    let myObj2 = myObj[0][0]
                                    console.log(myObj2);
                                    dispatch(ACTIONS.DISPLAY_SENTENCE, myObj2) //.replace(/yes/g,"").replace(/no/g,"").replace(/\\/g,""))
                                    // dispatch(ACTIONS.SPEAK_SENTENCE, myObj.content)
                                }
                            });
                        }
                    });
                }
            });



            // var form = req.form();

            // form.append('file', msg, {
            //     filename: 'myfile.txt',
            //     contentType: 'text/plain'
            // });
        // } else if (msg.length > 0) {
        //     dispatch(ACTIONS.DISPLAY_SENTENCE, msg.replace(/yes/g,"").replace(/no/g,"").replace(/\\/g,""))
        } else {
            let nothingMsg = "우리 아무말도 안했었군요."
            dispatch(ACTIONS.DISPLAY_SENTENCE, nothingMsg)
        }
    }

    updateFace(data) {
        let {dispatch} = this;
        if (data == 'Unknown' || data.includes('Recog')) {
            this.personId = 0;
            this.personName = 'Unknown';
            let responseMsg = "처음뵙겠습니다! 성함이 어떻게 되시죠?"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            return false;
        } else if (data == 'None') {
            this.personId = 0;
            this.personName = 'None';
            // let responseMsg = "Please stand in front of the camera and call my name CESLeA."
            // dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            // dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            return false;
        } else {
            this.chatbot = CHATBOT.ACTIVE;
            this.lastPersonId += 1;
            this.personId = this.lastPersonId;
            this.personName = data;

            this.question_on = false;
            this.summary_on = false;

            this.line_num = 0;
            this.self_check = false;
            this.info_check = false;

            this.intro_check = 0;
            this.action_check = 0;
            this.face_new_check = 0;

            this.whatAction = "";
            this.abstraction_check = 0;
            this.finish_check = 0;

            let responseMsg = "만나서 반갑습니다 " + this.personName + " 님!"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            // dispatch(ACTIONS.INPUT_SENTENCE,"Hello")
            return true;
        }
    }

    updateFaceCheckOnly(data) {
        let {dispatch} = this;
        if (data == 'Unknown' || data.includes('Recog')) {
            this.personId = 0;
            this.personName = 'Unknown';
            return false;
        } else if (data == 'None') {
            this.personId = 0;
            this.personName = 'None';
            return false;
        } else {

            return true;
        }
    }

    youAgain(msg) {
        this.chatbot = CHATBOT.ACTIVE;
        let {dispatch} = this;
        if (this.line_num >= 5) {
            let responseMsg = "다시보니 반갑네요 " + this.personName + "님! 지난 대화를 요약할까요?"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            this.abstraction_check = 1;
        } else {
            let responseMsg = "다시보니 반갑네요 " + this.personName + "님!"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
        }
    }

    willYouFinish() {
        if (this.personName != this.faceInput) {
            let responseMsg = "Will you finish?"
            dispatch(ACTIONS.DISPLAY_SENTENCE, responseMsg)
            dispatch(ACTIONS.SPEAK_SENTENCE, responseMsg)
            this.finish_check = 1;
        }
    }

}


let createCeslea = (dispatch) => {
    return new Ceslea(dispatch);
}

module.exports = {
    createCeslea
}
