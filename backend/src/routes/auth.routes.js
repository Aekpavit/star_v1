const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

router.route('/register').post(ctrl.register);
router.route('/login').post(ctrl.login);
router.route('/me').get(authenticate, ctrl.me);

module.exports = router;
