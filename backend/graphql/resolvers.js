const auth = require('../controllers/auth');

module.exports = {
    register: auth.register,
    login: auth.login,
};
