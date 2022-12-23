const router = require('express').Router();
const WorkspaceController = require('../../controllers/WorkspaceController');
const auth = require('../../utils/auth');

router.get('/', WorkspaceController.getAllWorkingspaces);

module.exports = router;