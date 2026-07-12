const router = require('express').Router();
const ctrl = require('../controllers/topics.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ctrl.listTopics);
router.get('/:id', ctrl.getTopic);

router.post('/', authorize('admin'), ctrl.createTopic);
router.put('/:id', authorize('admin'), ctrl.updateTopic);
router.patch('/:id/status', authorize('admin'), ctrl.toggleStatus);
router.delete('/:id', authorize('admin'), ctrl.deleteTopic);

module.exports = router;
