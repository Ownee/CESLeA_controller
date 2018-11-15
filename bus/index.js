let rxmq = require('rxmq').default;
let api = require("../api/index")

let publish = (action, data) => {
    rxmq.channel('status').subject('data').next({
        action: action,
        data: data
    });
};

const ACTIONS = {
    SPEAK: "SPEAK",
    DISPLAY: "DISPLAY",
    TURN_ON_LIGHT: "TURN_ON_LIGHT",
    TURN_OFF_LIGHT: "TURN_OFF_LIGHT",
    UPDATE_OBJECT: "UPDATE_OBJECT",
    UPDATE_ACTION: "UPDATE_ACTION",
    UPDATE_INTENT: "UPDATE_INTENT",
    UPDATE_SITUATION: "UPDATE_SITUATION",
};

let initialize = (server) => {
    let io = require("socket.io")(server);

    rxmq.channel('status').observe('data')
        .subscribe(
            (data) => {
                if (data.action === ACTIONS.SPEAK) {
                    api.speak(data.data)
                        .then(() => {

                        })
                        .catch((err) => {

                        })

                } else if (data.action === ACTIONS.TURN_ON_LIGHT) {
                    api.turnOnLight()
                        .then(() => {

                        })
                        .catch((err) => {

                        })
                }else if (data.action === ACTIONS.TURN_OFF_LIGHT) {
                    api.turnOffLight()
                        .then(() => {

                        })
                        .catch((err) => {

                        })
                } else {
                    io.emit("status", data);
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
    publish,
    ACTIONS,
}