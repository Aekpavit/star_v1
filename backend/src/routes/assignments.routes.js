const router = require('express').Router();
const ctrl = require('../controllers/assignments.controller');
const { authenticate, authorize } = require('../middleware/auth');

const admin = authorize('admin');
router.use(authenticate, admin);

router.route('/')
  .post(ctrl.createAssignment)
  .get(ctrl.listAssignments);

router.delete('/:id', ctrl.deleteAssignment);

module.exports = router;
