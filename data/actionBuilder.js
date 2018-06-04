

class ActionData {
    constructor(name,createdAt){
        this.createdAt = createdAt;
        this.name = name;
    }

    toString(){
        console.log(this);
    }
}


let build = (name,createdAt)=>{
    return new ActionData(name,createdAt)
};

module.exports = {
    build,
    ActionData
};