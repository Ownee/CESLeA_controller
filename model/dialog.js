
let messageBuilder = require('../data/messageBuilder');

let recognize = (message)=>{
    return new Promise((resolve,reject)=>{
        if(!message instanceof messageBuilder.message){
            reject(new Error("object is not instance of message"))
        }else{
            resolve(message)
        }
    })
};


exports = {
    recognize
};