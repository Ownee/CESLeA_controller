let axios = require("axios")
const querystring = require('querystring');


let speak = (sentence) => {
    return axios.post("http://155.230.104.115:5000/tts",
        querystring.stringify({text: sentence}))
        .then((result) => {
            return result.data
        })
};

let turnLight = () => {
    return axios.get("http://")
        .then((result) => {
            return result.data
        })
};

module.exports = {
    speak,
    turnLight
}