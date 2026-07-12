const router = require('express').Router();
const ctrl = require('../controllers/indicators.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ctrl.listIndicators);
router.get('/:id', ctrl.getIndicator);

router.post('/', authorize('admin'), ctrl.createIndicator);
router.put('/:id', authorize('admin'), ctrl.updateIndicator);
router.delete('/:id', authorize('admin'), ctrl.deleteIndicator);

module.exports = router;
