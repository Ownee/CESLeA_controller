

class IntentBuilder {
    constructor(name,createdAt){
        this.createdAt = createdAt;
        this.name = name;
    }

    toString(){
        console.log(this);
    }
}


let build = (name,createdAt)=>{
    return new IntentBuilder(name,createdAt)
};

module.exports = {
    build,
    IntentData: IntentBuilder
};