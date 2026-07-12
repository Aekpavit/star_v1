const router = require('express').Router();
const ctrl = require('../controllers/indicators.controller');
const { authenticate, authorize } = require('../middleware/auth');

const admin = authorize('admin');
router.use(authenticate);

router.route('/')
  .get(ctrl.listIndicators)
  .post(admin, ctrl.createIndicator);

router.route('/:id')
  .get(ctrl.getIndicator)
  .put(admin, ctrl.updateIndicator)
  .delete(admin, ctrl.deleteIndicator);

module.exports = router;
