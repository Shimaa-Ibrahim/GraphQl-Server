const throwError = (message, code, data = null) => {
    const err = new Error(message);
    err.code = code;
    err.data = data;
    return err;
}

module.exports = throwError;