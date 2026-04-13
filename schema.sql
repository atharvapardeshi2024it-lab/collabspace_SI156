-- ============================================================
-- CollabSpace Database Schema (MySQL)
-- Run this file in your MySQL client:
--   mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS collabspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE collabspace;

-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  department    ENUM(
    'Computer Science',
    'Information Technology',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration'
  ) NOT NULL,
  year          ENUM('1st Year','2nd Year','3rd Year','4th Year','Masters') NOT NULL,
  bio           TEXT,
  skills        VARCHAR(500),
  avatar_url    VARCHAR(255),
  points        INT     DEFAULT 0,
  level         TINYINT DEFAULT 1,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── PROJECTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT         NOT NULL,
  category    ENUM('Tech & IT','Science','Business','Design','Other') NOT NULL,
  tags        VARCHAR(300),
  icon        VARCHAR(10)  DEFAULT '💻',
  status      ENUM('Planning','In Progress','Review','Completed') DEFAULT 'Planning',
  owner_id    INT NOT NULL,
  max_members TINYINT DEFAULT 10,
  is_open     BOOLEAN DEFAULT TRUE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── PROJECT MEMBERS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id    INT NOT NULL,
  role       ENUM('owner','member') DEFAULT 'member',
  joined_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_member (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
);

-- ── STUDY GROUPS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_groups (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  course_code      VARCHAR(20),
  description      TEXT,
  tags             VARCHAR(300),
  icon             VARCHAR(10)  DEFAULT '📚',
  meeting_freq     ENUM('Weekly','Bi-weekly','As needed') DEFAULT 'Weekly',
  next_session     DATETIME,
  session_location VARCHAR(200),
  owner_id         INT NOT NULL,
  max_members      TINYINT DEFAULT 15,
  is_open          BOOLEAN DEFAULT TRUE,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── STUDY GROUP MEMBERS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_group_members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  group_id      INT NOT NULL,
  user_id       INT NOT NULL,
  role          ENUM('owner','member') DEFAULT 'member',
  joined_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_group_member (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)        ON DELETE CASCADE
);

-- ── RESOURCES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  type         ENUM('Notes','Video','Previous Paper','Assignment','Other') NOT NULL,
  course_code  VARCHAR(20),
  file_url     VARCHAR(500),
  external_url VARCHAR(500),
  description  TEXT,
  downloads    INT DEFAULT 0,
  uploader_id  INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── REFRESH TOKENS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT     NOT NULL,
  token      VARCHAR(500) NOT NULL,
  expires_at DATETIME    NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── INDEXES ────────────────────────────────────────────────
CREATE INDEX idx_projects_owner    ON projects(owner_id);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status   ON projects(status);
CREATE INDEX idx_groups_owner      ON study_groups(owner_id);
CREATE INDEX idx_resources_uploader ON resources(uploader_id);
CREATE INDEX idx_resources_course   ON resources(course_code);

-- ── SEED DATA (demo user) ──────────────────────────────────
-- Password is "password123" (bcrypt hashed)
INSERT IGNORE INTO users (first_name, last_name, email, password_hash, department, year, bio, skills, points, level)
VALUES (
  'John', 'Doe',
  'student@collab.edu',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Computer Science', '3rd Year',
  'Passionate about coding and collaboration!',
  'Python, JavaScript, SQL, React',
  1250, 4
);
