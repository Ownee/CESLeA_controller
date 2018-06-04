
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

var googleTTS = require('google-tts-api');

googleTTS('Hello World', 'en', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
        console.log(url); // https://translate.google.com/translate_tts?...
    })
    .catch(function (err) {
        console.error(err.stack);
    });
