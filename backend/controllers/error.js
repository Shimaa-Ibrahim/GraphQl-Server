const throwError = (message, code, data = null) => {
    const err = new Error(message);
    err.code = code;
    err.data = data;
    throw err;
}

module.exports = throwError;