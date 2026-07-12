CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` ENUM ('admin', 'evaluatee', 'committee') NOT NULL,
  `committee_role` ENUM ('chair', 'member') COMMENT 'ใช้เฉพาะเมื่อ role = committee',
  `position` varchar(100) COMMENT 'ตำแหน่ง เช่น ครูผู้สอน',
  `department` varchar(100) COMMENT 'แผนกวิชา',
  `school_name` varchar(150),
  `phone` varchar(20),
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `evaluation_topics` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` ENUM ('open', 'closed') NOT NULL DEFAULT 'open',
  `created_by` integer,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `indicators` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `topic_id` integer NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `weight` decimal(5,2) NOT NULL,
  `format` ENUM ('scale', 'yesno') NOT NULL,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `indicator_levels` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `indicator_id` integer NOT NULL,
  `level_no` integer NOT NULL,
  `description` varchar(255) NOT NULL
);

CREATE TABLE `indicator_evidence_types` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `indicator_id` integer NOT NULL,
  `evidence_type` ENUM ('pdf', 'image', 'url') NOT NULL
);

CREATE TABLE `self_assessments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `evaluatee_id` integer NOT NULL,
  `indicator_id` integer NOT NULL,
  `self_score` decimal(3,1),
  `status` ENUM ('pending', 'done', 'reeval') NOT NULL DEFAULT 'pending',
  `submitted_at` datetime
);

CREATE TABLE `evidence_files` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `self_assessment_id` integer NOT NULL,
  `evidence_type` ENUM ('pdf', 'image', 'url') NOT NULL,
  `file_path` varchar(500),
  `uploaded_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `reevaluation_requests` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `self_assessment_id` integer NOT NULL,
  `requested_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `reason` text,
  `status` ENUM ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
);

CREATE TABLE `committee_assignments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `committee_id` integer NOT NULL,
  `evaluatee_id` integer NOT NULL,
  `assigned_by` integer,
  `assigned_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `committee_scores` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `assignment_id` integer NOT NULL,
  `indicator_id` integer NOT NULL,
  `score` decimal(3,1),
  `comment` text,
  `scored_at` datetime
);

CREATE TABLE `signatures` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `assignment_id` integer NOT NULL,
  `signed_by` integer NOT NULL,
  `signed_at` datetime,
  `is_active` boolean NOT NULL DEFAULT true,
  `cancelled_at` datetime
);

CREATE UNIQUE INDEX `indicator_levels_index_0` ON `indicator_levels` (`indicator_id`, `level_no`);

CREATE UNIQUE INDEX `indicator_evidence_types_index_1` ON `indicator_evidence_types` (`indicator_id`, `evidence_type`);

CREATE UNIQUE INDEX `self_assessments_index_2` ON `self_assessments` (`evaluatee_id`, `indicator_id`);

CREATE UNIQUE INDEX `committee_assignments_index_3` ON `committee_assignments` (`committee_id`, `evaluatee_id`);

CREATE UNIQUE INDEX `committee_scores_index_4` ON `committee_scores` (`assignment_id`, `indicator_id`);

ALTER TABLE `users` COMMENT = 'บัญชีผู้ใช้ทั้งหมดในระบบ แยกบทบาทด้วย role';

ALTER TABLE `evaluation_topics` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `indicators` ADD FOREIGN KEY (`topic_id`) REFERENCES `evaluation_topics` (`id`);

ALTER TABLE `indicator_levels` ADD FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`);

ALTER TABLE `indicator_evidence_types` ADD FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`);

ALTER TABLE `self_assessments` ADD FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`);

ALTER TABLE `self_assessments` ADD FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`);

ALTER TABLE `evidence_files` ADD FOREIGN KEY (`self_assessment_id`) REFERENCES `self_assessments` (`id`);

ALTER TABLE `reevaluation_requests` ADD FOREIGN KEY (`self_assessment_id`) REFERENCES `self_assessments` (`id`);

ALTER TABLE `committee_assignments` ADD FOREIGN KEY (`committee_id`) REFERENCES `users` (`id`);

ALTER TABLE `committee_assignments` ADD FOREIGN KEY (`evaluatee_id`) REFERENCES `users` (`id`);

ALTER TABLE `committee_assignments` ADD FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`);

ALTER TABLE `committee_scores` ADD FOREIGN KEY (`assignment_id`) REFERENCES `committee_assignments` (`id`);

ALTER TABLE `committee_scores` ADD FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`);

ALTER TABLE `signatures` ADD FOREIGN KEY (`assignment_id`) REFERENCES `committee_assignments` (`id`);

ALTER TABLE `signatures` ADD FOREIGN KEY (`signed_by`) REFERENCES `users` (`id`);
