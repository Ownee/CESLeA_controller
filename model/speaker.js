let bus = require('../bus')

let speak = (sentence) => {
    return new Promise((resolve, reject) => {
        bus.createSpeakAction(sentence)
        resolve()
    })
};

module.exports = {
    speak
};