const router = require('express').Router();
const ctrl = require('../controllers/committee.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('committee', 'admin'));

router.get('/my-assignments', ctrl.myAssignments);
router.get('/assignments/:id', ctrl.assignmentDetail);
router.post('/assignments/:id/scores', ctrl.saveScore);
router.get('/assignments/:id/result', ctrl.result);
router.post('/assignments/:id/sign', ctrl.sign);
router.delete('/assignments/:id/sign', ctrl.cancelSign);

module.exports = router;
