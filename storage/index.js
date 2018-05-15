

class storage{

    constructor(){
        self.messages = [];
        self.visitors = [];
    }

    pushMessage(message){
        self.messages.push(message)
    }
    pushVisitor(person){
        self.visitors.push(person)
    }
}

let s = storage();




let addMessage = (message)=>{
    return new Promise((resolve => {
        s.pushMessage(message)
        resolve(message)
    }))
};


let addVisitor = (person)=>{
    return new Promise((resolve => {
        s.pushVisitor(person)
        resolve(person)
    }))
};

module.exports = {
    addMessage,
    addVisitor
};