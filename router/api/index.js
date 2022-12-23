

const router = require('express').Router();

router.use('/users', require('./usersRouter'));

router.use('/email', require('./sendEmail'));

router.use('/', require('./authRouter'));

// router.use('/workspace', require('/.workspaceRouter'));

module.exports = router;
