

class PersonData {
    constructor(name,createdAt){
        this.createdAt = createdAt;
        this.name = name;
    }

    toString(){
        console.log(this);
    }
}


let build = (name,createdAt)=>{
    return new PersonData(name,createdAt)
};

module.exports = {
    build,
    PersonData
};