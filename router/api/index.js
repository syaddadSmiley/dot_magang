const router = require('express').Router();

router.use('/', require('./authRouter'));
router.use('/items', require('./itemsRouter'));

module.exports = router;
