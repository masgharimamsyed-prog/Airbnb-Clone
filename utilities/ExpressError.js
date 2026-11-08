class ExpressError extends Error {

    constructor(code, msg) {
        super();
        this.message = msg;
        this.code = code;
    }



}

module.exports=ExpressError;