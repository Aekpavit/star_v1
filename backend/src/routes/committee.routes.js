const router = require('express').Router();
const ctrl = require('../controllers/committee.controller');
const { authenticate, authorize } = require('../middleware/auth');

const auth = [authenticate, authorize('committee', 'admin')];
router.use(auth);

router.route('/my-assignments').get(ctrl.myAssignments);
router.route('/assignments/:id').get(ctrl.assignmentDetail);
router.route('/assignments/:id/scores').post(ctrl.saveScore);
router.route('/assignments/:id/result').get(ctrl.result);
router.route('/assignments/:id/sign').post(ctrl.sign).delete(ctrl.cancelSign);

module.exports = router;
