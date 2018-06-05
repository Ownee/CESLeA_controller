let messageBuilder = require('../data/messageBuilder');
let bus = require('../bus')
let chatbot = require("./chatbot")
let speaker = require("./speaker")
let objects = require("./objects")
let Promise = require("bluebird")

const STATE = {
    IDLE: "IDLE",
    ACTIVE: "ACTIVE",
    FINDING: "FINDING",
};

let state = STATE.IDLE;

let lastTimerId = null;


let timeout = () => {
    lastTimerId = null;
    state = STATE.IDLE;
    bus.publish(bus.ACTIONS.DISABLE_CHATBOT, {})

};

let updateTimer = () => {
    if (lastTimerId) {
        clearTimeout(lastTimerId);
    }
    lastTimerId = setTimeout(timeout, 120000)
};


let _testGetPlaceName = (number) => {
    if (number == 1) {
        return "Rest room"
    } else if (number == 2) {
        return "Living room"
    } else if (number == 3) {
        return "Kitchen"
    } else {
        return "Room"
    }
}

let recognize = (message) => {
    return new Promise((resolve, reject) => {
        if (!message instanceof messageBuilder.message) {
            reject(new Error("object is not instance of message"))
        } else {
            // save sentence
            if (state === STATE.FINDING) {
                updateTimer();
                objects.getAll().then((result) => {
                    console.log(result)
                    let temp = result.find((item) => {
                        return message.content.includes(item.obj)
                    });
                    if (temp) {
                        let newMsg = messageBuilder.build(-1, "ceslea", temp.obj + "is in " + _testGetPlaceName(temp.place), Date.now())
                        bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);
                    } else {
                        let newMsg = messageBuilder.build(-1, "ceslea", "there is no the object", Date.now())
                        bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);
                    }
                    state = STATE.ACTIVE;
                    resolve({})
                }).catch((err) => {
                    console.log(err)
                    let newMsg = messageBuilder.build(-1, "ceslea", "i can't find the object", Date.now())
                    bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);
                    state = STATE.ACTIVE;
                    resolve({})
                })


            } else if (state === STATE.ACTIVE) {
                //chatbot으로 문장 전송
                console.log("safasdfasdfd")
                updateTimer();
                if (message.content && message.content.toLowerCase().includes("finish")) {
                    chatbot.clear()
                        .then(() => {
                            state = STATE.IDLE;
                            bus.publish(bus.ACTIONS.DISABLE_CHATBOT, {})
                            resolve()
                        }).catch((err) => {
                            console.log(err)
                        reject(err)
                    })
                } else {
                    chatbot.send(message.content)
                        .then((result) => {
                            console.log(result)
                            let newMsg = messageBuilder.build(-1, "ceslea", result.sentence, Date.now())
                            bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);
                            return speaker.speak(message.content)
                        }).then(() => {
                        resolve({})
                    }).catch((err) => {
                        console.log(err)
                        reject(err)
                    })
                }

            } else {
                chatbot.isCeslea(message.content)
                    .then((result) => {
                        if (result) {
                            state = STATE.ACTIVE;
                            bus.publish(bus.ACTIONS.ENABLE_CHATBOT, {});
                            let newMsg = messageBuilder.build(-1, "ceslea", "Did you call me?", Date.now())
                            bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);

                            updateTimer()
                            resolve({})

                        } else {
                            chatbot.isTravel(message.content)
                                .then((result) => {
                                    if (result) {
                                        bus.publish(bus.ACTIONS.ENABLE_CHATBOT, {});
                                        state = STATE.ACTIVE;
                                        chatbot.send(message.content)
                                            .then((result) => {
                                                let newMsg = messageBuilder.build(-1, "ceslea", result.sentence, Date.now())
                                                bus.publish(bus.ACTIONS.OUTPUT_SENTENCE, newMsg);
                                                return speaker.speak(message.content)
                                            }).then(() => {
                                            updateTimer()
                                            resolve({})
                                        }).catch((err) => {

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

        }
    })
};

let recognizeWithActiveState = (message) => {
    state = STATE.ACTIVE;
    return recognize(message);
};


let finding = 0;

let updateFindingState = () => {
    console.log("finding : " +finding);

    return new Promise((resolve,reject)=>{

        if(finding%10===0){
            state = STATE.FINDING;
            finding = finding+1;
            resolve({})
        }else{
            finding = finding+1;
            reject(new Error())
        }

    })

};


module.exports = {
    recognize,
    recognizeWithActiveState,
    updateFindingState
};