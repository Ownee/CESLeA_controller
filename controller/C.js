
const ACTIONS = {
    INPUT_BELL_SIGNAL: "INPUT_BELL_SIGNAL",
    INPUT_SENTENCE: "INPUT_SENTENCE",
    INPUT_OBJECT: "INPUT_OBJECT",
    INPUT_INTENT: "INPUT_INTENT",
    INPUT_ACTION: "INPUT_ACTION",

    DISPLAY_SENTENCE: "DISPLAY_SENTENCE",
    DISPLAY_OBJECT: "DISPLAY_OBJECT",
    DISPLAY_ACTION: "DISPLAY_ACTION",
    DISPLAY_INTENT: "DISPLAY_INTENT",
    DISPLAY_SITUATION: "DISPLAY_SITUATION",

    SPEAK_SENTENCE: "SPEAK_SENTENCE",
    TURN_ON_LIGHT: "TURN_ON_LIGHT",
    TURN_OFF_LIGHT: "TURN_OFF_LIGHT",

    RESTART_SPEECH_RECOGNITION: "RESTART_SPEECH_RECOGNITION",
    SHOW_SUMMARIZATION: "SHOW_SUMMARIZATION",
    INPUT_FACE: "INPUT_FACE",
};

const USER_INTENT = {
    SEARCHING_FOR_SOMETHING: "Searching for something",
    CLEANING_ROOM: "Cleaning",
    READING_A_BOOK: "Reading"
};

const USER_ACTION = {
    WALK: "Walk",
    CLEANING: "Cleaning",
    SIT: "Sit",
    Q_ON: "{\"question_on\": true}",
    Q_OFF: "{\"question_on\": false}",
};


const CHANNEL = {
    INPUT: "INPUT",
    OUTPUT: "OUTPUT",
};
const SUBJECT = {
    DATA: "DATA"
};

const SITUATION = {
    IDLE:{
        key:"IDLE",
        content:"",
        priority:0
    },
    BUZZER_RINGING:{
        key:"BUZZER_RINGING",
        content:"The buzzer is ringing.",
        priority:0
    },
    TURN_LIGHT_TO_KNOW:{
        key:"TURN_LIGHT_TO_KNOW",
        content:"Turn on the lights to let the house owner knows the someone has visited.",
        priority:0
    },
    WALK_TO_DOOR:{
        key:"WALK_TO_DOOR",
        content:"The owner walks toward the door.",
        priority:0
    },
    CLEANING:{
        key:"CLEANING",
        content:"The owner is cleaning.",
        priority:0
    },
    READING_BOOK:{
        key:"READING_BOOK",
        content:"Reading a book.",
        priority:0
    },
    SITTING_ON_SOFA:{
        key:"SITTING_ON_SOFA",
        content:"The owner and the friend are sitting on a sofa.",
        priority:0
    },
    WATCHING_TV:{
        key:"WATCHING_TV",
        content:"The owner and the friend are watching the TV.",
        priority:0
    },
    OWNER_WALK_TO_TOILET:{
        key:"OWNER_WALK_TO_TOILET",
        content:"The Owner walks toward the toilet.",
        priority:0
    },
    GUEST_WALK_TO_TOILET:{
        key:"GUEST_WALK_TO_TOILET",
        content:"The friend walks toward the toilet.",
        priority:0
    },
    SEARCHING_FOR_SOMETHING:{
        key:"SEARCHING_FOR_SOMETHING",
        content:"The owner is looking for the something.",
        priority:0
    },
    TURN_OFF_LIGHT:{
        key:"TURN_OFF_LIGHT",
        content:"Turn off the light.",
        priority:0
    },
    THEY_ARE_TALKING_ABOUT_TRAVEL:{
        key:"THEY_ARE_TALKING_ABOUT_TRAVEL",
        content:"They are talking about travel.",
        priority:0
    },
    THEY_CALL_CESLEA:{
        key:"THEY_CALL_CESLEA",
        content:"They call CESLeA.",
        priority:0
    },
    CESLEA_ENTER_LISTENING:{
        key:"CESLEA_ENTER_LISTENING",
        content:"CESLeA is listening",
        priority:0
    },
    THEY_ARE_TALKING_EACH_OTHERS:{
        key:"THEY_ARE_TALKING_EACH_OTHERS",
        content:"They are talking to each other",
        priority:0
    },
    QUESTION_ON:{
        key:"QUESTION_ON",
        content:"Someone raised hand for question",
        priority:0
    },
    QUESTION_OFF:{
        key:"QUESTION_OFF",
        content:"No more question",
        priority:0
    },
};


const OBJECTS = {
    PERSON: 0,
    BACKPACK: 24,
    BOTTLE: 39,
    CUP: 41,
    CHAIR: 56,
    SOFA: 57,
    POTTED_PLANT: 58,
    TV_MONITOR: 62,
    LAPTOP: 63,
    MOUSE: 64,
    KEYBOARD: 66,
    REMOTE: 67,
    BOOK: 73,
    CLOCK: 74,
    VASE: 75,
};

const PLACES = {
    REST_ROOM:1,
    LIVING_ROOM:2,
    KITCHEN:3,
    ROOM:4,
};

const CHATBOT = {
    ACTIVE: "ACTIVE",
    IDLE: "IDLE",
    EXTRA_FINDING: "EXTRA_FINDING",
}

module.exports= {
    ACTIONS,
    CHANNEL,
    SUBJECT,
    SITUATION,
    OBJECTS,
    PLACES,
    USER_INTENT,
    USER_ACTION,
    CHATBOT
}
