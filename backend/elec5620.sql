-- Active: 1729350170888@@localhost@5432@postgres
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS HR;
DROP TABLE IF EXISTS Manager;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS financial_records;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS psychological_assessments;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS clock_in_records;

-- CREATE TABLE users
-- DATE is the day when the user starts first day of work
CREATE TABLE users
(
	user_id		VARCHAR(10) PRIMARY KEY,
	password	VARCHAR(30) NOT NULL,
	firstName	VARCHAR(30) NOT NULL,
	lastName	VARCHAR(30) NOT NULL,
	age			INTEGER NOT NULL CHECK (age > 21),
	salary		DECIMAL(9,2) NOT NULL CHECK (salary > 0),
	role		VARCHAR(20) NOT NULL CHECK (role IN ('HR', 'Employee', 'Manager')),
    date        DATE NOT NULL
);
--------------------------
-- CREATE TABLE Employee
--------------------------
CREATE TABLE employee
(
	employee_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0),
	number_of_projects  INTEGER NOT NULL CHECK (number_of_projects >= 0)
);
--------------------------
-- CREATE TABLE HR
--------------------------
CREATE TABLE hr
(
	hr_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0)
);
--------------------------
-- CREATE TABLE Manager
--------------------------
CREATE TABLE manager
(
	manager_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0),
	number_of_projects  INTEGER NOT NULL CHECK (number_of_projects >= 0)
);
--------------------------
-- CREATE TABLE team
--一个团队里有一个manager和多个员工；一个manager可以有多个team
--------------------------
CREATE TABLE team
(
	team_id SERIAL PRIMARY KEY,
	manager_id VARCHAR(10) REFERENCES manager(manager_id) 
);
--------------------------
--CREATE TABLE projects
--ROI: Return on Investment; using roi to present team efficiency.
--一个project都有负责团队，一个团队可以有多个projects
--------------------------
CREATE TABLE projects
(
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(225),
    description TEXT,
    start_date DATE,
    deadline DATE,
    revenue DECIMAL(15,2),
    cost DECIMAL(15,2),
    roi NUMERIC,
    team_id INT REFERENCES team(team_id) 
);
-----------------------------------------
-- 触发器：在项目插入或更新时自动计算 ROI
------------------------------------------
CREATE OR REPLACE FUNCTION update_roi() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cost != 0 THEN
        NEW.roi = ((NEW.revenue - NEW.cost) / NEW.cost) * 100;
    ELSE
        NEW.roi = NULL; 
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_roi
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_roi();
------------------------------------------------------------------
-- 中间表：employee_project
--一个员工可以参与多个项目，但每个员工在一个项目中只能有一个记录
CREATE TABLE employee_project
(
    employee_id VARCHAR(10) REFERENCES employee(employee_id),
    project_id INT REFERENCES projects(project_id),
    PRIMARY KEY (employee_id, project_id) 
);
--------------------------
-- CREATE TABLE financial_records
-- 每个项目可以有多个财务记录
-- 每个财务记录只能对应一个项目，且由员工录入
--------------------------
CREATE TABLE financial_records
(
    item_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE, 
    employee_id VARCHAR(10) REFERENCES employee(employee_id), 
    description TEXT NOT NULL, 
    category VARCHAR(7) NOT NULL CHECK (category IN ('Income', 'Expense')), 
    amount DECIMAL(10,2) NOT NULL, 
    time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
);

--------------------------
--CREATE TABLE psychological_assessments
--------------------------
CREATE TABLE psychological_assessments
(
	psy_id SERIAL,
	employee_id VARCHAR(10) REFERENCES employee(employee_id),
    assessment TEXT,
    timestamp TIMESTAMP,
    PRIMARY KEY (psy_id, employee_id, timestamp)
);
--------------------------
-- CREATE TABLE feedback
-- feedback由员工提出，HR负责查看并回应
--------------------------
CREATE TABLE feedback
(
    feedback_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) REFERENCES employee(employee_id),
    hr_id VARCHAR(10) REFERENCES hr(hr_id), 
    feedback_content TEXT NOT NULL, 
    response TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    status VARCHAR(20) DEFAULT 'Waiting' CHECK (status IN ('Solved', 'Waiting', 'OnProgress')), 
    response_time TIMESTAMP 
);

------------------------------------ChatGPT（检查；修改触发器；限制用法）
-- Create clock_in_records with automatic duration calculation and start/end time checks
CREATE TABLE clock_in_records
(
    clock_in_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) REFERENCES employee(employee_id),
    project_id INT,
    date DATE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration DECIMAL(5,2),
    status VARCHAR(20) CHECK (status IN ('Abnormal', 'Normal')),
    CONSTRAINT chk_start_time CHECK (EXTRACT(HOUR FROM start_time) BETWEEN 7 AND 11), -- 限制开始时间
    CONSTRAINT chk_end_time CHECK (EXTRACT(HOUR FROM end_time) BETWEEN 15 AND 19)     -- 限制结束时间
);

-- Trigger function to calculate duration and set status based on hours worked
CREATE OR REPLACE FUNCTION calculate_duration_and_status()
RETURNS TRIGGER AS $$
DECLARE
    work_duration DECIMAL(5,2);
BEGIN
    -- Ensure start_time and end_time are set
    IF NEW.start_time IS NULL OR NEW.end_time IS NULL THEN
        RAISE EXCEPTION 'Start time or end time cannot be NULL';
    END IF;

    -- Calculate duration (in hours)
    work_duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600;

    -- Update the duration field
    NEW.duration := work_duration;

    -- Check if the duration is 8 hours and update status accordingly
    IF work_duration = 8 THEN
        NEW.status = 'Normal';
    ELSE
        NEW.status = 'Abnormal';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate duration and update status
CREATE TRIGGER trg_calculate_duration
BEFORE INSERT OR UPDATE ON clock_in_records
FOR EACH ROW
EXECUTE FUNCTION calculate_duration_and_status();


--数据插入由GPT生成
-------------------------
-- INSERT INTO users
-------------------------
-- 创建用户数据，包括HR、员工和经理
INSERT INTO users 
VALUES 
('ajones','098','Anna','Jones',25,41000,'HR','2024-10-13'),
('ganderson','987','Glen','Anderson',30,49500.80,'Employee','2024-10-13'),
('jwalker','876','James','Walker',22,38890.50,'Manager','2024-10-13');

--------------------------
-- INSERT INTO Employee
--------------------------
-- 创建员工数据
INSERT INTO employee 
VALUES ('ganderson', 40.1, 1);

--------------------------
-- INSERT INTO Manager
--------------------------
-- 创建经理数据
INSERT INTO manager 
VALUES ('jwalker', 40.1, 1);

--------------------------
-- INSERT INTO HR
--------------------------
-- 创建HR数据
INSERT INTO hr 
VALUES ('ajones', 56);

--------------------------
-- INSERT INTO team
--------------------------
-- 创建团队数据，由'jwalker'作为经理管理的团队
INSERT INTO team (manager_id) 
VALUES ('jwalker'); 
-- 假设生成的 team_id 为 1

--------------------------
-- INSERT INTO projects
--------------------------
-- 插入项目数据，team_id 为 1
INSERT INTO projects (project_name, description, start_date, deadline, revenue, cost, team_id)
VALUES 
('Project A', 'Description of Project A', '2024-10-13', '2024-12-31', 150000, 100000, 1),
('Project B', 'Description of Project B', '2024-10-13', '2024-11-30', 200000, 120000, 1);

--------------------------
-- INSERT INTO employee_project
--------------------------
-- 插入员工参与项目的数据
-- 假设 'ganderson' 参与 'Project A' 和 'Project B'
INSERT INTO employee_project (employee_id, project_id)
VALUES 
('ganderson', 1), 
('ganderson', 2);

--------------------------
-- INSERT INTO financial_records
--------------------------
-- 插入财务记录，每个项目可以有多条财务记录，由员工录入
-- 假设 'ganderson' 录入了两条记录：一条收入，一条支出
INSERT INTO financial_records (project_id, employee_id, description, category, amount)
VALUES 
(1, 'ganderson', 'Income from client A', 'Income', 50000),
(1, 'ganderson', 'Expense on marketing', 'Expense', 20000),
(2, 'ganderson', 'Income from client B', 'Income', 100000),
(2, 'ganderson', 'Expense on development', 'Expense', 50000);

--------------------------
-- INSERT INTO psychological_assessments
--------------------------
-- 插入心理评估数据
-- 假设 'ganderson' 有一次心理评估
INSERT INTO psychological_assessments (employee_id, assessment, timestamp)
VALUES 
('ganderson', 'Assessment for work-life balance', '2024-10-14 09:00:00');

--------------------------
-- INSERT INTO feedback
--------------------------
-- 插入反馈数据，由员工提出反馈，由HR回应
-- 假设 'ganderson' 提出了两条反馈
INSERT INTO feedback (employee_id, hr_id, feedback_content, status, response_time)
VALUES 
('ganderson', 'ajones', 'Need more work-life balance.', 'OnProgress', NULL),
('ganderson', 'ajones', 'Request for project resources.', 'Solved', '2024-10-15 14:00:00');

--------------------------
-- INSERT INTO clock_in_records
--------------------------
-- 插入打卡记录，计算工时并更新状态
-- 假设 'ganderson' 参与了 'Project A' 和 'Project B' 的打卡记录
INSERT INTO clock_in_records (employee_id, project_id, date, start_time, end_time)
VALUES 
('ganderson', 1, '2024-10-13', '2024-10-13 08:00:00', '2024-10-13 16:00:00'), -- 正常工作8小时
('ganderson', 2, '2024-10-14', '2024-10-14 09:00:00', '2024-10-14 17:00:00'); -- 正常工作8小时

