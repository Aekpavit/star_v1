const router = require('express').Router();
const ctrl = require('../controllers/selfAssessments.controller');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate, authorize('evaluatee'));

router.route('/me').get(ctrl.myAssessments);
router.route('/').post(ctrl.saveScore);
router.route('/:indicatorId/evidence').post(upload.single('file'), ctrl.uploadEvidence);
router.route('/progress').get(ctrl.progress);
router.route('/feedback').get(ctrl.feedback);
router.route('/:indicatorId/reevaluate').post(ctrl.requestReevaluation);
router.route('/export').get(ctrl.exportCsv);

module.exports = router;
