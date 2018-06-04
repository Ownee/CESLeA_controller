
let rxmq = require('rxmq').default;


let publish = (action,data)=>{
    rxmq.channel('status').subject('data').next({
        action:action,
        data:data
    });
};

const ACTIONS = {

};

let initialize = (server)=>{
    let io = require("socket.io")(server);

    rxmq.channel('status').observe('data')
        .subscribe(
            (data) => {
                io.emit("status",data);
            },
            (error) => {
                console.log("subscribe-error",error);
            }
        );



    io.on("connection",(client)=>{
        console.log("connection")
        client.on("event",(data)=>{

        });
        client.on("disconnect",()=>{

        });
    })
};

module.exports = {
    initialize,
    publish,
    ACTIONS,
    createSpeakAction
}