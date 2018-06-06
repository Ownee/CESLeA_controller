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
    TURN_LIGHT: "TURN_LIGHT",
    UPDATE_OBJECT: "UPDATE_OBJECT",
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

                } else if (data.action === ACTIONS.TURN_LIGHT) {
                    api.turnLight()
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