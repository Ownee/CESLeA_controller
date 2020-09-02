let Promise = require("bluebird");
let Ceslea = require("./Ceslea");
let chatbot = require("../model/chatbot")
let rxmq = require('rxmq').default;
let api = require("../api/index")
const {CHANNEL,ACTIONS,SUBJECT,CHATBOT,CHAT_MODULE_STATE} = require("./C")
let mysql = require('mysql');
let opn = require('opn');
let request = require('request');

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
//나중에는 여기 있는 잡다한 코드를 Ceslea.js 안에 집어넣을 방법을 찾아야 한다.
let ceslea = null;

let _dispatch = (channel, action, data) => {
    rxmq.channel(channel).subject(SUBJECT.DATA).next({
        action: action,
        data: data
    });
};

let dispatch = (action, data) => {
    console.log("action : " + action);
    return new Promise((resolve, reject) => {
        switch (action) {
            case ACTIONS.INPUT_SENTENCE:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.INPUT_BELL_SIGNAL:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.INPUT_INTENT:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.INPUT_ACTION:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.INPUT_OBJECT:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.INPUT_FACE:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.CHANGE_MODE_INTRO:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.CHANGE_MODE_CHITCHAT:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.CHANGE_MODE_MAX:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.CHANGE_MODE_SEMI:
                _dispatch(CHANNEL.INPUT, action, data);
                break;
            case ACTIONS.DISPLAY_ACTION:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.DISPLAY_INTENT:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.DISPLAY_OBJECT:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.DISPLAY_SENTENCE:
                _dispatch(CHANNEL.OUTPUT, action,  {
                    person:"CESLeA",
                    content:data
                });
                break;
            case ACTIONS.DISPLAY_SITUATION:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.SPEAK_SENTENCE:
                _dispatch(CHANNEL.OUTPUT, action,data);
                break;
            case ACTIONS.TURN_OFF_LIGHT:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.TURN_ON_LIGHT:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.RESTART_SPEECH_RECOGNITION:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.SHOW_SUMMARIZATION:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            case ACTIONS.CLEANSING_DB:
                _dispatch(CHANNEL.OUTPUT, action, data);
                break;
            default:
                break;
        }

        resolve("");
    });


};


const initialize = (server) => {
    ceslea = Ceslea.createCeslea(dispatch);

    let io = require("socket.io")(server);

//    let connection = mysql.createConnection({
//        host     : 'localhost',
//        user     : 'root',
//        password : 'pass',
//        database : 'demodb'
//    });

//    connection.connect();

    var db_config = {
        host     : 'localhost',
        user     : 'root',
        password : 'pass',
        database : 'demodb'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

    //opn('http://192.168.0.15:3004');

    //connection.query("DELETE FROM ceslea_tbl_face");
    connection.query("SELECT EXISTS(SELECT 1 FROM ceslea_tbl_v3 WHERE person_id = 1)", function (err, result, fields) {
        if (err) throw err;
        console.log(Object.values(result[0])[0])
        if (Object.values(result[0])[0] == 1) {
            connection.query("SELECT * FROM ceslea_tbl_v3 ORDER BY person_id DESC LIMIT 1", function (err, result, fields) {
                console.log("Last person ID: " + result[0].person_id)
                if (err) throw err;
                ceslea.lastPersonId = parseInt(result[0].person_id)
            });
        }
    });


    rxmq.channel(CHANNEL.INPUT).observe(SUBJECT.DATA)
        .subscribe(
            (data) => {
                switch (data.action) {
                    case ACTIONS.INPUT_OBJECT:
                        ceslea.updateObject(data.data);
                        console.log(ceslea.state[STATE_KEYS.OWNER_OBJ])
                        let sqlobj = "INSERT INTO ceslea_tbl_all (person_name, conversation, object, action, localization, intention, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                        let sqlobjparams = [ceslea.personName, null, ceslea.state[STATE_KEYS.OWNER_OBJ], ceslea.state[STATE_KEYS.ACTION], ceslea.state[STATE_KEYS.OWNER_OBJ_PLACE], ceslea.state[STATE_KEYS.INTENT], new Date()];
                        connection.query(sqlobj, sqlobjparams, function (err, result) {
                            if (err) throw err;
                            console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                        });
                        break;
                    case ACTIONS.INPUT_ACTION:
                        ceslea.updateAction(data.data);
                        let sqlact = "INSERT INTO ceslea_tbl_all (person_name, conversation, object, action, localization, intention, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                        let sqlactparams = [ceslea.personName, null, ceslea.state[STATE_KEYS.OWNER_OBJ], ceslea.state[STATE_KEYS.ACTION], ceslea.state[STATE_KEYS.OWNER_OBJ_PLACE], ceslea.state[STATE_KEYS.INTENT], new Date()];
                        connection.query(sqlact, sqlactparams, function (err, result) {
                            if (err) throw err;
                            console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                        });
                        break;
                    case ACTIONS.INPUT_INTENT:
                        ceslea.updateIntent(data.data);
                        let sqlint = "INSERT INTO ceslea_tbl_all (person_name, conversation, object, action, localization, intention, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                        let sqlintparams = [ceslea.personName, null, ceslea.state[STATE_KEYS.OWNER_OBJ], ceslea.state[STATE_KEYS.ACTION], ceslea.state[STATE_KEYS.OWNER_OBJ_PLACE], ceslea.state[STATE_KEYS.INTENT], new Date()];
                        connection.query(sqlint, sqlintparams, function (err, result) {
                            if (err) throw err;
                            console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                        });
                        break;
                    case ACTIONS.INPUT_BELL_SIGNAL:
                        ceslea.updateBell(data.data);
                        break;
                    case ACTIONS.INPUT_FACE:
                        let name = data.data;
                        console.log(name);
                        // var req3 = request.post("https://chat.neoali.com:8072/translate",{form:{String:name, ori:'kr', tar:'en'}}, function (err, resp, body) {
                        //     if (err) {
                        //         console.log('Post Error!');
                        //     }
                        //     else {
                        //         console.log('Post Success!');
                        //         console.log(body);
                        //         let myObj = JSON.parse(body);
                        //         console.log(myObj);
                        //         let myObj2 = myObj[0][0]
                        //         console.log(myObj2);
                        //         name = myObj2;
                        //         // dispatch(ACTIONS.SPEAK_SENTENCE, myObj.content)
                        //     }
                        // });
                        ceslea.faceInput = name;
                        if (ceslea.chatbot === CHATBOT.FACE) {
                            connection.query("SELECT EXISTS(SELECT 1 FROM ceslea_tbl_v3 WHERE person_name = '" + ceslea.faceInput + "')", function (err, result, fields) {
                                if (err) throw err;
                                console.log(Object.values(result[0])[0])
                                if (Object.values(result[0])[0] == 1) {
                                    connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_name = '" + ceslea.faceInput + "'", function (err, result, fields) {
                                        if (err) throw err;
                                        console.log(result[0].person_name);
                                        ceslea.personId = parseInt(result[0].person_id);
                                        ceslea.personName = ceslea.faceInput;
                                        connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_id=" + ceslea.personId.toString() + " ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                                            if (err) throw err;
                                            console.log(result[0].intro_index)
                                            ceslea.line_num = parseInt(result[0].intro_index)
                                            console.log(ceslea.line_num)
                                            // resurrect this code to use intro
                                            // if (ceslea.line_num >= 25) {
                                            //     ceslea.intro_check = 2;
                                            // } else {
                                            //     ceslea.intro_check = 1;
                                            // }
                                        });
                                        //chatbot.chatbotMode(CHAT_MODULE_STATE.SELFINTRO)
                                        ceslea.youAgain("youagain");
                                    });
                                } else {
                                    if (ceslea.updateFace(ceslea.faceInput)) {
                                        let sql = "INSERT INTO ceslea_tbl_v3 (person_id, person_name, summarization, intro_index) VALUES (?, ?, ?, ?)";
                                        let sqlparams = [ceslea.personId, ceslea.personName.replace(/'/g, "\\'"), "User " + ceslea.personName.replace(/'/g, "\\'"), ceslea.line_num];
                                        connection.query(sql, sqlparams, function (err, result) {
                                            if (err) throw err;
                                            console.log("User " + ceslea.personName + " is inserted as a new person");
                                        });
                                    }
                                }
                            });
                        }
                        // else if (ceslea.chatbot === CHATBOT.ACTIVE && ceslea.faceInput != ceslea.personName) {
                        //     //ceslea.willYouFinish()
                        //     ceslea.face_restart = true;
                        // }
                        break;
                    case ACTIONS.INPUT_SENTENCE:

                        if (ceslea.personId > 0) {

                            data.data.speakerId = ceslea.personId.toString();
                            data.data.person = ceslea.personName;
                            console.log(data)
                            let sql = "INSERT INTO ceslea_tbl_v3 (person_id, summarization, intro_index, intro_flag, submission_date) VALUES (?, ?, ?, ?, ?)";
                            let sqlparams = [ceslea.personId, data.data.content.replace(/'/g, "\\'"), ceslea.line_num, ceslea.self_check, new Date()];
                            connection.query(sql, sqlparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                            });
                            // connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_id=" + ceslea.personId.toString() + " ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                            //     if (err) throw err;
                            //     ceslea.line_num = parseInt(result[0].intro_index)
                            // });

                            let sqluse = "INSERT INTO ceslea_tbl_all (person_name, conversation, object, action, localization, intention, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            let sqluseparams = [ceslea.personName, data.data.content.replace(/'/g, "\\'"), ceslea.state[STATE_KEYS.OWNER_OBJ], ceslea.state[STATE_KEYS.ACTION], ceslea.state[STATE_KEYS.OWNER_OBJ_PLACE], ceslea.state[STATE_KEYS.INTENT], new Date()];
                            connection.query(sqluse, sqluseparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                            });

                        } else if (ceslea.personName == 'None') {
                            ceslea.textStack = ceslea.textStack + "카메라 앞에서 세실리아를 부르세요.";
                            ceslea.text_on = true;
                            console.log("text update: " + ceslea.textStack)
                        }

                        console.log(data)

                        // if (ceslea.face_restart) {
                        //     ceslea.chatbot = CHATBOT.FACE;
                        //     ceslea.face_restart = false;
                        //     connection.query("SELECT EXISTS(SELECT 1 FROM ceslea_tbl_v3 WHERE person_name = '" + ceslea.faceInput + "')", function (err, result, fields) {
                        //         if (err) throw err;
                        //         console.log(Object.values(result[0])[0])
                        //         if (Object.values(result[0])[0] == 1) {
                        //             connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_name = '" + ceslea.faceInput + "'", function (err, result, fields) {
                        //                 if (err) throw err;
                        //                 console.log(result[0].person_name);
                        //                 ceslea.personId = parseInt(result[0].person_id);
                        //                 ceslea.personName = ceslea.faceInput;
                        //                 connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_id=" + ceslea.personId.toString() + " ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                        //                     if (err) throw err;
                        //                     console.log(result[0].intro_index)
                        //                     ceslea.line_num = parseInt(result[0].intro_index)
                        //                     console.log(ceslea.line_num)
                        //                     if (ceslea.line_num >= 25) {
                        //                         ceslea.intro_check = 2;
                        //                     } else {
                        //                         ceslea.intro_check = 1;
                        //                     }
                        //                 });
                        //                 //chatbot.chatbotMode(CHAT_MODULE_STATE.SELFINTRO)
                        //                 ceslea.youAgain("youagain");
                        //             });
                        //         } else {
                        //             if (ceslea.updateFace(ceslea.faceInput)) {
                        //                 let sql = "INSERT INTO ceslea_tbl_v3 (person_id, person_name, summarization, intro_index) VALUES (?, ?, ?, ?)";
                        //                 let sqlparams = [ceslea.personId, ceslea.personName.replace(/'/g, "\\'"), "User " + ceslea.personName.replace(/'/g, "\\'"), ceslea.line_num];
                        //                 connection.query(sql, sqlparams, function (err, result) {
                        //                     if (err) throw err;
                        //                     console.log("User " + ceslea.personName + " is inserted as a new person");
                        //                 });
                        //             }
                        //         }
                        //     });
                        // } else {
                            io.emit("status", data);
                            ceslea.updateSentence(data.data.content,ceslea.chatMode);
                        // }
                        break;
                    case ACTIONS.CHANGE_MODE_INTRO:
                        chatbot.chatbotMode(CHAT_MODULE_STATE.SELFINTRO)
                        break;
                    case ACTIONS.CHANGE_MODE_CHITCHAT:
                        chatbot.chatbotMode(CHAT_MODULE_STATE.CHITCHAT)
                        break;
                    case ACTIONS.CHANGE_MODE_MAX:
                        chatbot.chatbotMode(CHAT_MODULE_STATE.MAX)
                        break;
                    case ACTIONS.CHANGE_MODE_SEMI:
                        chatbot.chatbotMode(CHAT_MODULE_STATE.SEMI)
                        break;
                    default :
                        break;
                }
            },
            (error) => {
                console.log("subscribe-error", error);
            }
        );


    rxmq.channel(CHANNEL.OUTPUT).observe(SUBJECT.DATA)
        .subscribe(
            (data) => {
                console.log(data)
                switch (data.action) {
                    case ACTIONS.SPEAK_SENTENCE:
                        if (!data.data) {
                            data.data = "Something going wrong"
                        }

                        ceslea.textStack = ceslea.textStack + data.data;
                        ceslea.text_on = true;
                        console.log("text update: " + ceslea.textStack)

                        // chatbot.sendvoice(data.data)
                        //     .then((result) => {
                        //         res.json(req.body);
                        //         console.log(result)
                        //     })
                        //     .catch((err) => {
                        //         console.log(err);
                        //     });

                        if (ceslea.personId > 0) {
                            let sql = "INSERT INTO ceslea_tbl_v3 (person_id, summarization, intro_index, intro_flag, submission_date) VALUES (?, ?, ?, ?, ?)";
                            let sqlparams = [ceslea.personId, data.data.replace(/'/g, "\\'"), ceslea.line_num, ceslea.self_check, new Date()];
                            connection.query(sql, sqlparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB chatbot input record inserted");
                            });

                            let sqlcha = "INSERT INTO ceslea_tbl_all (person_name, conversation, object, action, localization, intention, submission_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            let sqlchaparams = [ceslea.personName, data.data.replace(/'/g, "\\'"), ceslea.state[STATE_KEYS.OWNER_OBJ], ceslea.state[STATE_KEYS.ACTION], ceslea.state[STATE_KEYS.OWNER_OBJ_PLACE], ceslea.state[STATE_KEYS.INTENT], new Date()];
                            connection.query(sqlcha, sqlchaparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                            });
                        }
                        // if (data.data.length > 240) {
                        //     var arr = data.data.split("\n");
                        //     for(var i=0;i<arr.length;i++) {
                        //         var tempdata = {};
                        //         tempdata.action = data.action;
                        //         tempdata.data = arr[i];
                        //         io.emit("action", tempdata);
                        //     }
                        // } else {

                        // data.data = data.data.substring(0, 245);
                        // io.emit("action", data);

                        // }
                        break;
                    case ACTIONS.RESTART_SPEECH_RECOGNITION:
                        io.emit("action", data);
                        break;
                    case ACTIONS.TURN_ON_LIGHT:
                        console.log("turn on")
                        api.turnOnLight()
                            .then(() => {
                            })
                            .catch((err) => {
                                console.log(err)
                            });
                        break;
                    case ACTIONS.TURN_OFF_LIGHT:
                        console.log("turn off")
                        api.turnOffLight()
                            .then(() => {
                            })
                            .catch((err) => {
                                console.log(err)
                            });
                        break;
                    case ACTIONS.SHOW_SUMMARIZATION:
                        if (ceslea.personId > 0) {
                            let msg = "";
                            //connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_id = " + ceslea.personId.toString() + " AND intro_flag = 1", function (err, result, fields) {
                            connection.query("SELECT * FROM ceslea_tbl_v3 WHERE person_id = " + ceslea.personId.toString(), function (err, result, fields) {
                                if (err) throw err;
                                console.log(result);
                                for(var i=0;i<result.length;i++) {
                                    msg = msg + result[i].summarization + " ";
                                }
                                console.log(msg);
                                ceslea.showSummarization(msg);
                            });
                            // connection.query("DELETE FROM ceslea_tbl_face WHERE person_id=" + ceslea.personId.toString() + " ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                            //     if (err) throw err;
                            // });
                        }
                        //console.log(msg);
                        //data.action = ACTIONS.SPEAK_SENTENCE;
                        //data.data = msg;
                        //io.emit("action", data);
                        //ceslea.showSummarization(msg);
                        break;
                    case ACTIONS.CLEANSING_DB:
                        // connection.query("DELETE FROM ceslea_tbl_v3 WHERE person_id = " + ceslea.personId.toString(), function (err, result) {
                        //     if (err) throw err;
                        // });
                        break;
                    default :
                        io.emit("status", data);
                        break;
                }

            },
            (error) => {
                console.log("subscribe-error", error);
            }
        );


    io.on("connection", (client) => {
        console.log("connection")
        client.on("event", (data) => {

        });
        client.on("disconnect", () => {

        });
    })
};

let outputText = () => {
    let theText = ceslea.textStack;
    console.log("actual text send: " + theText)
    ceslea.textStack = " ";
    ceslea.text_on = false;
    return theText
}

let textOnCheck = () => {
    return new Promise((resolve, reject) => {
        resolve(ceslea.text_on)
    });
}


module.exports = {
    initialize,
    dispatch,
    outputText,
    textOnCheck
};
