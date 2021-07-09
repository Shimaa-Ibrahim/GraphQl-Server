const auth = require('../controllers/auth');

module.exports = {
    hello() {
        return "hello world";
    },
    register: auth.register,
    login: auth.login,

};
