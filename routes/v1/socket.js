
let rxmq = require('rxmq').default;


let initialize = (server)=>{
    let io = require("socket.io")(server);

    rxmq.channel('alarms').observe('add')
        .subscribe(
            (data) => {
                console.log("subscribe",data);
                io.emit("alarms",data);
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
    initialize
}