const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/topics', require('./topics.routes'));
router.use('/indicators', require('./indicators.routes'));
router.use('/self-assessments', require('./selfAssessments.routes'));
router.use('/assignments', require('./assignments.routes'));
router.use('/committee', require('./committee.routes'));
router.use('/reports', require('./reports.routes'));

module.exports = router;
