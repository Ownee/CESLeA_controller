let axios = require("axios")

let speak = (sentence) => {
    return axios.get("http://" + sentence)
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