let Promise = require("bluebird");
let Ceslea = require("./Ceslea");
let chatbot = require("../model/chatbot")
let rxmq = require('rxmq').default;
let api = require("../api/index")
const {CHANNEL,ACTIONS,SUBJECT,CHATBOT} = require("./C")
let mysql = require('mysql');


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
            default:
                break;
        }

        resolve("");
    });


};


const initialize = (server) => {
    ceslea = Ceslea.createCeslea(dispatch);

    let io = require("socket.io")(server);

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'abr',
        database : 'demodb'
    });

    connection.connect();

    //connection.query("DELETE FROM ceslea_tbl_face");

    rxmq.channel(CHANNEL.INPUT).observe(SUBJECT.DATA)
        .subscribe(
            (data) => {
                switch (data.action) {
                    case ACTIONS.INPUT_OBJECT:
                        ceslea.updateObject(data.data);
                        break;
                    case ACTIONS.INPUT_ACTION:
                        ceslea.updateAction(data.data);
                        break;
                    case ACTIONS.INPUT_INTENT:
                        ceslea.updateIntent(data.data);
                        break;
                    case ACTIONS.INPUT_BELL_SIGNAL:
                        ceslea.updateBell(data.data);
                        break;
                    case ACTIONS.INPUT_FACE:
                        let name = data.data;
                        if (name != ceslea.personName && ceslea.chatbot === CHATBOT.IDLE) {
                            connection.query("SELECT EXISTS(SELECT 1 FROM ceslea_tbl_v2 WHERE person_name = '" + name + "')", function (err, result, fields) {
                                if (err) throw err;
                                console.log(Object.values(result[0])[0])
                                if (Object.values(result[0])[0] == 1) {
                                    connection.query("SELECT * FROM ceslea_tbl_v2 WHERE person_name = '" + name +  + "' ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                                        if (err) throw err;
                                        console.log(result[0].person_name);
                                        ceslea.personId = parseInt(result[0].person_id);
                                        ceslea.personName = name;
                                        ceslea.line_num = parseInt(result[0].intro_index)
                                        ceslea.youAgain("youagain")
                                    });
                                } else {
                                    if (ceslea.updateFace(name)) {
                                        let sql = "INSERT INTO ceslea_tbl_v2 (person_id, person_name, summarization, intro_index) VALUES (?, ?, ?, ?)";
                                        let sqlparams = [ceslea.personId, ceslea.personName.replace(/'/g, "\\'"), "User " + ceslea.personName.replace(/'/g, "\\'"), ceslea.line_num];
                                        connection.query(sql, sqlparams, function (err, result) {
                                            if (err) throw err;
                                            console.log("User " + ceslea.personName + " is inserted as a new person");
                                        });
                                    }
                                }
                            });
                        }
                        break;
                    case ACTIONS.INPUT_SENTENCE:
                        if (ceslea.personId > 0) {
                            data.data.speakerId = ceslea.personId.toString();
                            data.data.speaker = ceslea.personName;
                            let sql = "INSERT INTO ceslea_tbl_v2 (person_id, summarization, intro_index) VALUES (?, ?, ?)";
                            let sqlparams = [ceslea.personId, data.data.content.replace(/'/g, "\\'"), ceslea.line_num];
                            connection.query(sql, sqlparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB user input record inserted");
                            });
                        }
                        io.emit("status", data);
                        connection.query("SELECT * FROM ceslea_tbl_face WHERE person_id=" + ceslea.personId.toString() + " ORDER BY submission_date DESC LIMIT 1", function (err, result, fields) {
                            if (err) throw err;
                            this.line_num = parseInt(result[0].intro_index)
                        });
                        ceslea.updateSentence(data.data.content);
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
                        if (ceslea.personId > 0) {
                            let sql = "INSERT INTO ceslea_tbl_v2 (person_id, summarization, intro_index) VALUES (?, ?, ?)";
                            let sqlparams = [ceslea.personId, data.data.replace(/'/g, "\\'"), ceslea.line_num];
                            connection.query(sql, sqlparams, function (err, result) {
                                if (err) throw err;
                                console.log("Person " + ceslea.personId.toString() + " DB chatbot input record inserted");
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
                        data.data = data.data.substring(0, 245);
                        io.emit("action", data);
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
                            connection.query("SELECT * FROM ceslea_tbl_v2 WHERE person_id = " + ceslea.personId.toString(), function (err, result, fields) {
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


module.exports = {
    initialize,
    dispatch
};