const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const auth = require('../../utils/auth');

router.post('/login', AuthController.login);

module.exports = router;
