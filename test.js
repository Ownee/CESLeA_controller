let api = require("./api/index")

api.speak("Soccer and Baseball. Which one do you like? I usually prefer playing soccer than baseball Soccer and Baseball. Which one do you like? I usually prefer playing soccer than baseball Soccer and Baseball. Which one do you like? I usually prefer playing soccer than baseball")
    .then(()=>{

    })
    .catch((err)=>{
        console.log(err)
    })


let lastTimerId = null;

/*

let timeout = () => {
    lastTimerId = null;
    console.log("timeout")
};

let updateTimer = () => {
    if (lastTimerId) {
        clearTimeout(lastTimerId);
    }
    lastTimerId = setTimeout(timeout, 60000)
};


process.stdin.resume();
process.stdin.setEncoding('utf8');
let util = require('util');

process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));
    if (text === 'quit\n') {
        done();
    }
});

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
}*/
