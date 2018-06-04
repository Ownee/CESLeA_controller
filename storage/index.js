
let bus = require('../bus')


class storage{

    constructor(){
        this.messages = [];
        this.visitors = [];
    }

    pushMessage(message){
        this.messages.push(message)
    }
    pushVisitor(person){
        this.visitors.push(person)
    }
}

let s = new storage();




let addMessage = (message)=>{
    return new Promise((resolve => {
        s.pushMessage(message)
        bus.publish(bus.ACTIONS.SAVE_DATA,message);
        resolve(message)
    }))
};


let addVisitor = (person)=>{
    return new Promise((resolve => {
        s.pushVisitor(person);
        bus.publish(bus.ACTIONS.SAVE_DATA,person);
        resolve(person)
    }))
};

module.exports = {
    addMessage,
    addVisitor,
    s
};