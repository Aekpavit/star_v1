const router = require('express').Router();
const ctrl = require('../controllers/assignments.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.post('/', ctrl.createAssignment);
router.get('/', ctrl.listAssignments);
router.delete('/:id', ctrl.deleteAssignment);

module.exports = router;
