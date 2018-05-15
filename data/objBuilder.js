class obj {
    constructor(objId, obj, place, createdAt) {
        self.objId = objId;
        self.obj = obj;
        self.place = place;
        self.createdAt = createdAt;

    }

    toString() {
        console.log(self);
    }
}

let build = (objId,obj,place,createdAt) => {
    return new Promise(((resolve, reject) => {
        resolve(new obj(objId,obj,place,createdAt))
    }))
};

module.exports = {
    build,
    obj
};