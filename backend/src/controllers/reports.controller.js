const { catchAsync, sendSuccess } = require('../utils');
const { query } = require('../utils/db');

// GET /api/reports/committee-summary
// ข้อ 5.1.10 และ 5.1.11: สรุปผลรายกรรมการ + ติดตามสถานะการประเมินของกรรมการแต่ละคน
exports.committeeSummary = catchAsync(async (req, res) => {
  const [rows] = await query(
    `SELECT c.id AS committee_id, c.name, c.committee_role,
            COUNT(ca.id) AS assigned_count,
            SUM(CASE WHEN s.is_active = 1 THEN 1 ELSE 0 END) AS signed_count
     FROM users c
     LEFT JOIN committee_assignments ca ON ca.committee_id = c.id
     LEFT JOIN signatures s ON s.assignment_id = ca.id AND s.is_active = 1
     WHERE c.role = 'committee'
     GROUP BY c.id, c.name, c.committee_role
     ORDER BY c.name`
  );
  sendSuccess(res, rows);
});

// GET /api/reports/evaluatees-status
// ข้อ 5.1.12: ติดตามสถานะการประเมินของผู้รับการประเมิน
exports.evaluateesStatus = catchAsync(async (req, res) => {
  const [rows] = await query(
    `SELECT e.id, e.name, e.department,
            COUNT(i.id) AS total_indicators,
            SUM(CASE WHEN sa.status = 'done' THEN 1 ELSE 0 END) AS done_indicators
     FROM users e
     JOIN self_assessments sa ON sa.evaluatee_id = e.id
     JOIN indicators i ON i.id = sa.indicator_id
     WHERE e.role = 'evaluatee'
     GROUP BY e.id, e.name, e.department
     ORDER BY e.name`
  );
  sendSuccess(res, rows);
});

// GET /api/reports/evaluatee/:id
// ข้อ 5.1.13: แสดงรายงานผลการประเมินรายบุคคล (รวมคะแนนตนเอง + คะแนนกรรมการทุกคน)
exports.evaluateeReport = catchAsync(async (req, res) => {
  const evaluateeId = req.params.id;

  const [profile] = await query(
    'SELECT id, name, position, department, school_name FROM users WHERE id = ?',
    [evaluateeId]
  );

  const [indicators] = await query(
    `SELECT i.id, i.name, i.weight, i.format, t.name AS topic_name,
            sa.self_score, sa.status
     FROM indicators i
     JOIN evaluation_topics t ON t.id = i.topic_id
     LEFT JOIN self_assessments sa ON sa.indicator_id = i.id AND sa.evaluatee_id = ?
     ORDER BY t.id, i.id`,
    [evaluateeId]
  );

  const [committeeScores] = await query(
    `SELECT u.name AS committee_name, i.name AS indicator_name, cs.score, cs.comment,
            s.is_active AS is_signed
     FROM committee_assignments ca
     JOIN users u ON u.id = ca.committee_id
     JOIN committee_scores cs ON cs.assignment_id = ca.id
     JOIN indicators i ON i.id = cs.indicator_id
     LEFT JOIN signatures s ON s.assignment_id = ca.id AND s.is_active = 1
     WHERE ca.evaluatee_id = ?
     ORDER BY u.name, i.id`,
    [evaluateeId]
  );

  sendSuccess(res, { profile: profile[0] || null, self_assessments: indicators, committee_scores: committeeScores });
});

