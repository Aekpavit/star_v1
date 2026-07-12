const router = require('express').Router();
const ctrl = require('../controllers/selfAssessments.controller');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate, authorize('evaluatee'));

router.get('/me', ctrl.myAssessments);
router.post('/', ctrl.saveScore);
router.post('/:indicatorId/evidence', upload.single('file'), ctrl.uploadEvidence);
router.get('/progress', ctrl.progress);
router.get('/feedback', ctrl.feedback);
router.post('/:indicatorId/reevaluate', ctrl.requestReevaluation);
router.get('/export', ctrl.exportCsv);

module.exports = router;
