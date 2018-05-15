

let make = (status,code,message)=>{
    let error = new Error();
    error.status = status;
    error.code = code;
    error.message = message;
    return error;
};

let CODES = {
    VALIDATION_FAILED:"VALIDATION_FAILED",
    NOT_FOUND:"NOT_FOUND",
    SERVER_ERROR:"SERVER_ERROR",

};

module.exports = {
    make,
    CODES
};