let axios = require("axios")
const querystring = require('querystring');


let speak = (sentence) => {
    return axios.post("http://155.230.104.115:5000/tts",
        querystring.stringify({text: sentence}))
        .then((result) => {
            return result.data
        })
};

let turnOnLight = () => {
    return axios.get("http://155.230.104.19:6436/on")
        .then((result) => {
            return result.data
        })
};
let turnOffLight = () => {
    return axios.get("http://155.230.104.19:6436/off")
        .then((result) => {
            return result.data
        })
};

module.exports = {
    speak,
    turnOffLight,
    turnOnLight
}