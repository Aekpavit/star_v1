const router = require('express').Router();
const ctrl = require('../controllers/reports.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/committee-summary', ctrl.committeeSummary);
router.get('/evaluatees-status', ctrl.evaluateesStatus);
router.get('/evaluatee/:id', ctrl.evaluateeReport);

module.exports = router;
