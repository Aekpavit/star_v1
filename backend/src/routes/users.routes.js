const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.post('/', ctrl.createUser);
router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUser);
router.put('/:id', ctrl.updateUser);

module.exports = router;
