

let make = (status,code,message)=>{
    let error = new Error();
    error.status = status;
    error.code = code;
    error.message = message;
    return error;
};

let CODES = {
    VALIDATION_FAILED:"VALIDATION_FAILED",

};

module.exports = {
    make,
    CODES
};