const router = require('express').Router();
const ctrl = require('../controllers/reports.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.route('/committee-summary').get(ctrl.committeeSummary);
router.route('/evaluatees-status').get(ctrl.evaluateesStatus);
router.route('/evaluatee/:id').get(ctrl.evaluateeReport);

module.exports = router;
