
let Promise = require("bluebird");


let recognize = (imagePath)=>{
    return new Promise((resolve,reject)=>{
        resolve({
            personId:"id49218",
            personName:"Jack",
        })
    })
};


module.exports = {
    recognize
};


