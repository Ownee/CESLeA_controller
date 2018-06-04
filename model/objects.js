let bus = require('../bus')
let objBuilder = require("../data/objBuilder")


let list = []


let update = (obj) => {
    return new Promise((resolve, reject) => {
        if (!obj instanceof objBuilder.obj) {
            reject(new Error("object is not instance of obj"))
        } else {
            let isChanged = false
            list = list.map((item)=>{
                if(item.objId===obj.objId){
                    isChanged = true
                    return obj
                }else{
                    return item
                }
            });

            if(!isChanged){
                list.push(obj)
            }

            bus.publish(bus.ACTIONS.UPDATE_OBJECT,list)
            resolve({});
        }
    })
};

let get = (id) => {
    return new Promise((resolve, reject) => {
    })
};

let getAll = () => {
    return new Promise((resolve, reject) => {
        resolve(list)
    })
};

let clear = () => {
    return new Promise((resolve, reject) => {
        list = [];
        resolve({})
    })
};

module.exports = {
    update, get, getAll, clear
}
