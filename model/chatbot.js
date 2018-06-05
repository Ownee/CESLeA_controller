let axios = require('axios')


let englishChatAPI = (sentence) => {
    return axios.get("http://localhost:3010/api/v1/chatbot/english?sentence=" + sentence)
        .then((result) => {
            return result.data
        })
}

let englishCheckAPI = (sentence) => {
    return axios.get("http://localhost:3010/api/v1/chatbot/english/check?sentence=" + sentence)
        .then((result) => {
            return result.data
        })
}

let englishInitAPI = () => {
    return axios.get("http://localhost:3010/api/v1/chatbot/init/english")
        .then((result) => {
            return result.data
        })
}

let send = (sentence) => {
    return new Promise((resolve, reject) => {
        englishChatAPI(sentence).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err)
        })
    })
};

let clear = () => {
    return new Promise((resolve, reject) => {
        englishInitAPI().then(() => {
            resolve({})
        }).catch(err => {
            reject(err)
        })
    })
};


let isCeslea = (sentence)=>{
    return new Promise((resolve, reject) => {
        if (sentence.includes("ceslea")||sentence.includes("cecilia")) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

let isTravel = (sentence) => {
    return new Promise((resolve, reject) => {
        englishCheckAPI(sentence).then((result)=>{
            console.log(result)
            if(result.is_travel){
                resolve(true)
            }else{
                resolve(false)
            }
        })
    })
};






module.exports = {
    send,
    clear,
    isTravel,
    isCeslea
}