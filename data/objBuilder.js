class ObjData {
    constructor(objId, _obj, place, createdAt) {
        this.objId = objId;
        this.obj = _obj;
        this.place = place;
        this.createdAt = createdAt;

    }

    toString() {
        console.log(this);
    }
}

let build = (objId,_obj,place,createdAt) => {
    return new ObjData(objId,_obj,place,createdAt)
};

module.exports = {
    build,
    ObjData
};