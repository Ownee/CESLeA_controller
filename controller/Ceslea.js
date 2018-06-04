
const CHATBOT_STATE = {
    ACTIVE:"ACTIVE",
    IDLE:"IDLE"
}

const STATE = {
    GUEST:"GUEST",
    GUEST_OBJ:"GUEST_OBJ",
    GUEST_LOCATION:"GUEST_LOCATION",
    OWNER:"OWNER",
    OWNER_OBJ:"OWNER_OBJ",

    OBJ:"OBJ",
    ACTION:"ACTION",
    INTENT:"INTENT",
}

class Ceslea {
    constructor() {
        this.chatbot = CHATBOT_STATE.IDLE;
        this.states = {

            GUEST:"",
            GUEST_OBJ:"",
            GUEST_LOCATION:"",

            OWNER:"",
            OWNER_OBJ:"",

            OBJ:"",
            ACTION:"",
            INTENT:"",

        }
    }

    activeChatbot(){
        this.chatbot = CHATBOT_STATE.ACTIVE
    }

    inactiveChatbot(){
        this.chatbot = CHATBOT_STATE.IDLE
    }

    updateState(state,data){
        this.states[state] = data
    }

}

let createCeslea = ()=>{
    return new Ceslea();
}

module.exports = {
    createCeslea,
    CHATBOT_STATE,
    STATE

}