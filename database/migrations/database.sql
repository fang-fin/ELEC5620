-- -- Active: 1729350170888@@localhost@5432@postgres
-- DROP TABLE IF EXISTS Employee;
-- DROP TABLE IF EXISTS HR;
-- DROP TABLE IF EXISTS Manager;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS projects;
-- DROP TABLE IF EXISTS financial_records;
-- DROP TABLE IF EXISTS team;
-- DROP TABLE IF EXISTS psychological_assessments;
-- DROP TABLE IF EXISTS feedback;
-- DROP TABLE IF EXISTS clock_in_records;

-- -- CREATE TABLE users
-- -- DATE is the day when the user starts first day of work
-- CREATE TABLE users
-- (
-- 	user_id		VARCHAR(10) PRIMARY KEY,
-- 	password	VARCHAR(30) NOT NULL,
-- 	firstName	VARCHAR(30) NOT NULL,
-- 	lastName	VARCHAR(30) NOT NULL,
-- 	age			INTEGER NOT NULL CHECK (age > 21),
-- 	salary		DECIMAL(9,2) NOT NULL CHECK (salary > 0),
-- 	role		VARCHAR(20) NOT NULL CHECK (role IN ('HR', 'Employee', 'Manager')),
--     date        DATE NOT NULL
-- );
-- --------------------------
-- -- CREATE TABLE Employee
-- --------------------------
-- CREATE TABLE employee
-- (
-- 	employee_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
-- 	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0),
-- 	number_of_projects  INTEGER NOT NULL CHECK (number_of_projects >= 0)
-- );
-- --------------------------
-- -- CREATE TABLE HR
-- --------------------------
-- CREATE TABLE hr
-- (
-- 	hr_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
-- 	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0)
-- );
-- --------------------------
-- -- CREATE TABLE Manager
-- --------------------------
-- CREATE TABLE manager
-- (
-- 	manager_id VARCHAR(10) PRIMARY KEY REFERENCES users(user_id),
-- 	total_work_duration DECIMAL(6,1) NOT NULL CHECK (total_work_duration >= 0),
-- 	number_of_projects  INTEGER NOT NULL CHECK (number_of_projects >= 0)
-- );
-- --------------------------
-- -- CREATE TABLE team
-- --------------------------
-- CREATE TABLE team
-- (
-- 	team_id SERIAL PRIMARY KEY,
-- 	manager_id VARCHAR(10) REFERENCES manager(manager_id) 
-- );
-- --------------------------
-- --CREATE TABLE projects
-- --ROI: Return on Investment; using roi to present team efficiency.
-- --------------------------
-- CREATE TABLE projects
-- (
--     project_id SERIAL PRIMARY KEY,
--     project_name VARCHAR(225),
--     description TEXT,
--     start_date DATE,
--     deadline DATE,
--     revenue DECIMAL(15,2),
--     cost DECIMAL(15,2),
--     roi NUMERIC,
--     team_id INT REFERENCES team(team_id) 
-- );

-- CREATE OR REPLACE FUNCTION update_roi() 
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF NEW.cost != 0 THEN
--         NEW.roi = ((NEW.revenue - NEW.cost) / NEW.cost) * 100;
--     ELSE
--         NEW.roi = NULL; 
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_update_roi
-- BEFORE INSERT OR UPDATE ON projects
-- FOR EACH ROW
-- EXECUTE FUNCTION update_roi();

-- CREATE TABLE employee_project
-- (
--     employee_id VARCHAR(10) REFERENCES employee(employee_id),
--     project_id INT REFERENCES projects(project_id),
--     PRIMARY KEY (employee_id, project_id) 
-- );
-- --------------------------
-- -- CREATE TABLE financial_records
-- --------------------------
-- CREATE TABLE financial_records
-- (
--     item_id SERIAL PRIMARY KEY,
--     project_id INT REFERENCES projects(project_id) ON DELETE CASCADE, 
--     employee_id VARCHAR(10) REFERENCES employee(employee_id), 
--     description TEXT NOT NULL, 
--     category VARCHAR(7) NOT NULL CHECK (category IN ('Income', 'Expense')), 
--     amount DECIMAL(10,2) NOT NULL, 
--     time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
-- );

-- --------------------------
-- --CREATE TABLE psychological_assessments
-- --------------------------
-- CREATE TABLE psychological_assessments
-- (
-- 	psy_id SERIAL,
-- 	employee_id VARCHAR(10) REFERENCES employee(employee_id),
--     assessment TEXT,
--     timestamp TIMESTAMP,
--     PRIMARY KEY (psy_id, employee_id, timestamp)
-- );
-- --------------------------
-- -- CREATE TABLE feedback
-- --------------------------
-- CREATE TABLE feedback
-- (
--     feedback_id SERIAL PRIMARY KEY,
--     employee_id VARCHAR(10) REFERENCES employee(employee_id),
--     hr_id VARCHAR(10) REFERENCES hr(hr_id), 
--     feedback_content TEXT NOT NULL, 
--     response TEXT,
--     timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
--     status VARCHAR(20) DEFAULT 'Waiting' CHECK (status IN ('Solved', 'Waiting', 'OnProgress')), 
--     response_time TIMESTAMP 
-- );


-- -- Create clock_in_records with automatic duration calculation and start/end time checks
-- CREATE TABLE clock_in_records
-- (
--     clock_in_id SERIAL PRIMARY KEY,
--     employee_id VARCHAR(10) REFERENCES employee(employee_id),
--     project_id INT,
--     date DATE,
--     start_time TIMESTAMP,
--     end_time TIMESTAMP,
--     duration DECIMAL(5,2),
--     status VARCHAR(20) CHECK (status IN ('Abnormal', 'Normal')),
--     CONSTRAINT chk_start_time CHECK (EXTRACT(HOUR FROM start_time) BETWEEN 7 AND 11), 
--     CONSTRAINT chk_end_time CHECK (EXTRACT(HOUR FROM end_time) BETWEEN 15 AND 19)     
-- );

-- -- Trigger function to calculate duration and set status based on hours worked
-- CREATE OR REPLACE FUNCTION calculate_duration_and_status()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     work_duration DECIMAL(5,2);
-- BEGIN
--     -- Ensure start_time and end_time are set
--     IF NEW.start_time IS NULL OR NEW.end_time IS NULL THEN
--         RAISE EXCEPTION 'Start time or end time cannot be NULL';
--     END IF;

--     -- Calculate duration (in hours)
--     work_duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600;

--     -- Update the duration field
--     NEW.duration := work_duration;

--     -- Check if the duration is 8 hours and update status accordingly
--     IF work_duration = 8 THEN
--         NEW.status = 'Normal';
--     ELSE
--         NEW.status = 'Abnormal';
--     END IF;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Trigger to automatically calculate duration and update status
-- CREATE TRIGGER trg_calculate_duration
-- BEFORE INSERT OR UPDATE ON clock_in_records
-- FOR EACH ROW
-- EXECUTE FUNCTION calculate_duration_and_status();


-- -------------------------
-- -- INSERT INTO users
-- -------------------------

-- INSERT INTO users 
-- VALUES 
-- ('ajones','098','Anna','Jones',25,41000,'HR','2024-10-13'),
-- ('ganderson','987','Glen','Anderson',30,49500.80,'Employee','2024-10-13'),
-- ('jwalker','876','James','Walker',22,38890.50,'Manager','2024-10-13');

-- --------------------------
-- -- INSERT INTO Employee
-- --------------------------
-- INSERT INTO employee 
-- VALUES ('ganderson', 40.1, 1);

-- --------------------------
-- -- INSERT INTO Manager
-- --------------------------
-- INSERT INTO manager 
-- VALUES ('jwalker', 40.1, 1);

-- --------------------------
-- -- INSERT INTO HR
-- --------------------------
-- INSERT INTO hr 
-- VALUES ('ajones', 56);

-- --------------------------
-- -- INSERT INTO team
-- --------------------------
-- INSERT INTO team (manager_id) 
-- VALUES ('jwalker'); 

-- --------------------------
-- -- INSERT INTO projects
-- --------------------------
-- INSERT INTO projects (project_name, description, start_date, deadline, revenue, cost, team_id)
-- VALUES 
-- ('Project A', 'Description of Project A', '2024-10-13', '2024-12-31', 150000, 100000, 1),
-- ('Project B', 'Description of Project B', '2024-10-13', '2024-11-30', 200000, 120000, 1);

-- --------------------------
-- -- INSERT INTO employee_project
-- --------------------------
-- INSERT INTO employee_project (employee_id, project_id)
-- VALUES 
-- ('ganderson', 1), 
-- ('ganderson', 2);

-- --------------------------
-- -- INSERT INTO financial_records
-- --------------------------
-- INSERT INTO financial_records (project_id, employee_id, description, category, amount)
-- VALUES 
-- (1, 'ganderson', 'Income from client A', 'Income', 50000),
-- (1, 'ganderson', 'Expense on marketing', 'Expense', 20000),
-- (2, 'ganderson', 'Income from client B', 'Income', 100000),
-- (2, 'ganderson', 'Expense on development', 'Expense', 50000);

-- --------------------------
-- -- INSERT INTO psychological_assessments
-- --------------------------
-- INSERT INTO psychological_assessments (employee_id, assessment, timestamp)
-- VALUES 
-- ('ganderson', 'Assessment for work-life balance', '2024-10-14 09:00:00');

-- --------------------------
-- -- INSERT INTO feedback
-- --------------------------
-- INSERT INTO feedback (employee_id, hr_id, feedback_content, status, response_time)
-- VALUES 
-- ('ganderson', 'ajones', 'Need more work-life balance.', 'OnProgress', NULL),
-- ('ganderson', 'ajones', 'Request for project resources.', 'Solved', '2024-10-15 14:00:00');

-- --------------------------
-- -- INSERT INTO clock_in_records
-- --------------------------
-- INSERT INTO clock_in_records (employee_id, project_id, date, start_time, end_time)
-- VALUES 
-- ('ganderson', 1, '2024-10-13', '2024-10-13 08:00:00', '2024-10-13 16:00:00'), 
-- ('ganderson', 2, '2024-10-14', '2024-10-14 09:00:00', '2024-10-14 17:00:00'); 

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calculate_duration_and_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_duration_and_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.calculate_duration_and_status() OWNER TO postgres;

--
-- Name: set_start_date(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_start_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.start_date IS NULL THEN
        NEW.start_date := CURRENT_DATE;  -- Set the start_date to the current date
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_start_date() OWNER TO postgres;

--
-- Name: update_project_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_project_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the number_of_projects field in the employee table
    UPDATE employee
    SET number_of_projects = (
        SELECT COUNT(*)
        FROM employee_project
        WHERE employee_project.employee_id = NEW.employee_id
    )
    WHERE employee.employee_id = NEW.employee_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_project_count() OWNER TO postgres;

--
-- Name: update_roi(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_roi() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.cost != 0 THEN
        NEW.roi = ((NEW.revenue - NEW.cost) / NEW.cost) * 100;
    ELSE
        NEW.roi = NULL; 
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_roi() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clock_in_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clock_in_records (
    clock_in_id integer NOT NULL,
    employee_id character varying(10),
    project_id integer,
    date date,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    duration numeric(5,2),
    status character varying(20),
    CONSTRAINT clock_in_records_status_check CHECK (((status)::text = ANY ((ARRAY['Abnormal'::character varying, 'Normal'::character varying])::text[])))
);


ALTER TABLE public.clock_in_records OWNER TO postgres;

--
-- Name: clock_in_records_clock_in_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clock_in_records_clock_in_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clock_in_records_clock_in_id_seq OWNER TO postgres;

--
-- Name: clock_in_records_clock_in_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clock_in_records_clock_in_id_seq OWNED BY public.clock_in_records.clock_in_id;


--
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    employee_id character varying(10) NOT NULL,
    total_work_duration numeric(6,1) NOT NULL,
    number_of_projects integer NOT NULL,
    CONSTRAINT employee_number_of_projects_check CHECK ((number_of_projects >= 0)),
    CONSTRAINT employee_total_work_duration_check CHECK ((total_work_duration >= (0)::numeric))
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- Name: employee_project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_project (
    employee_id character varying(10) NOT NULL,
    project_id integer NOT NULL
);


ALTER TABLE public.employee_project OWNER TO postgres;

--
-- Name: employee_team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_team (
    employee_id character varying(50) NOT NULL,
    team_id integer NOT NULL
);


ALTER TABLE public.employee_team OWNER TO postgres;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    feedback_id integer NOT NULL,
    employee_id character varying(10),
    hr_id character varying(10),
    feedback_content text NOT NULL,
    response text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(20) DEFAULT 'Waiting'::character varying,
    response_time timestamp without time zone,
    CONSTRAINT feedback_status_check CHECK (((status)::text = ANY ((ARRAY['Solved'::character varying, 'Waiting'::character varying, 'OnProgress'::character varying])::text[])))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_feedback_id_seq OWNED BY public.feedback.feedback_id;


--
-- Name: financial_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_records (
    item_id integer NOT NULL,
    project_id integer,
    employee_id character varying(10),
    description text,
    category character varying(7) NOT NULL,
    amount numeric(10,2) NOT NULL,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT financial_records_category_check CHECK (((category)::text = ANY ((ARRAY['Income'::character varying, 'Expense'::character varying])::text[])))
);


ALTER TABLE public.financial_records OWNER TO postgres;

--
-- Name: financial_records_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financial_records_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_records_item_id_seq OWNER TO postgres;

--
-- Name: financial_records_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financial_records_item_id_seq OWNED BY public.financial_records.item_id;


--
-- Name: hr; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr (
    hr_id character varying(10) NOT NULL,
    total_work_duration numeric(6,1) NOT NULL,
    CONSTRAINT hr_total_work_duration_check CHECK ((total_work_duration >= (0)::numeric))
);


ALTER TABLE public.hr OWNER TO postgres;

--
-- Name: manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manager (
    manager_id character varying(10) NOT NULL,
    total_work_duration numeric(6,1) NOT NULL,
    number_of_projects integer NOT NULL,
    team_id integer,
    CONSTRAINT manager_number_of_projects_check CHECK ((number_of_projects >= 0)),
    CONSTRAINT manager_total_work_duration_check CHECK ((total_work_duration >= (0)::numeric))
);


ALTER TABLE public.manager OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    project_id integer NOT NULL,
    project_name character varying(225),
    description text,
    start_date date,
    deadline date,
    revenue numeric(15,2),
    cost numeric(15,2),
    roi numeric,
    team_id integer
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_project_id_seq OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_project_id_seq OWNED BY public.projects.project_id;


--
-- Name: psychological_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.psychological_assessments (
    psy_id integer NOT NULL,
    employee_id character varying(10) NOT NULL,
    assessment text,
    "timestamp" timestamp without time zone NOT NULL
);


ALTER TABLE public.psychological_assessments OWNER TO postgres;

--
-- Name: psychological_assessments_psy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.psychological_assessments_psy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.psychological_assessments_psy_id_seq OWNER TO postgres;

--
-- Name: psychological_assessments_psy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.psychological_assessments_psy_id_seq OWNED BY public.psychological_assessments.psy_id;


--
-- Name: team_manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_manager (
    team_id integer NOT NULL,
    manager_id character varying(10)
);


ALTER TABLE public.team_manager OWNER TO postgres;

--
-- Name: team_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_team_id_seq OWNER TO postgres;

--
-- Name: team_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_team_id_seq OWNED BY public.team_manager.team_id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    total_earning numeric(10,2) NOT NULL,
    total_duration integer NOT NULL,
    team_efficiency integer NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id character varying(10) NOT NULL,
    password character varying(30) NOT NULL,
    firstname character varying(30) NOT NULL,
    lastname character varying(30) NOT NULL,
    age integer NOT NULL,
    salary numeric(9,2),
    role character varying(20) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    gender character varying(10),
    CONSTRAINT users_age_check CHECK ((age > 21)),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['hr'::character varying, 'employee'::character varying, 'manager'::character varying])::text[]))),
    CONSTRAINT users_salary_check CHECK ((salary > (0)::numeric))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: clock_in_records clock_in_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clock_in_records ALTER COLUMN clock_in_id SET DEFAULT nextval('public.clock_in_records_clock_in_id_seq'::regclass);


--
-- Name: feedback feedback_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN feedback_id SET DEFAULT nextval('public.feedback_feedback_id_seq'::regclass);


--
-- Name: financial_records item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_records ALTER COLUMN item_id SET DEFAULT nextval('public.financial_records_item_id_seq'::regclass);


--
-- Name: projects project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN project_id SET DEFAULT nextval('public.projects_project_id_seq'::regclass);


--
-- Name: psychological_assessments psy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psychological_assessments ALTER COLUMN psy_id SET DEFAULT nextval('public.psychological_assessments_psy_id_seq'::regclass);


--
-- Name: team_manager team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_manager ALTER COLUMN team_id SET DEFAULT nextval('public.team_team_id_seq'::regclass);


--
-- Name: clock_in_records clock_in_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clock_in_records
    ADD CONSTRAINT clock_in_records_pkey PRIMARY KEY (clock_in_id);


--
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);


--
-- Name: employee_project employee_project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_project
    ADD CONSTRAINT employee_project_pkey PRIMARY KEY (employee_id, project_id);


--
-- Name: employee_team employee_team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_team
    ADD CONSTRAINT employee_team_pkey PRIMARY KEY (employee_id, team_id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);


--
-- Name: financial_records financial_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_records
    ADD CONSTRAINT financial_records_pkey PRIMARY KEY (item_id);


--
-- Name: hr hr_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr
    ADD CONSTRAINT hr_pkey PRIMARY KEY (hr_id);


--
-- Name: manager manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_pkey PRIMARY KEY (manager_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: psychological_assessments psychological_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psychological_assessments
    ADD CONSTRAINT psychological_assessments_pkey PRIMARY KEY (psy_id, employee_id, "timestamp");


--
-- Name: team_manager team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_manager
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: projects set_start_date_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_start_date_trigger BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_start_date();


--
-- Name: clock_in_records trg_calculate_duration; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_calculate_duration BEFORE INSERT OR UPDATE ON public.clock_in_records FOR EACH ROW EXECUTE FUNCTION public.calculate_duration_and_status();

ALTER TABLE public.clock_in_records DISABLE TRIGGER trg_calculate_duration;


--
-- Name: projects trg_update_roi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_roi BEFORE INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_roi();


--
-- Name: employee_project update_project_count_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_project_count_trigger AFTER INSERT OR DELETE ON public.employee_project FOR EACH ROW EXECUTE FUNCTION public.update_project_count();


--
-- Name: clock_in_records clock_in_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clock_in_records
    ADD CONSTRAINT clock_in_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: employee employee_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.users(user_id);


--
-- Name: employee_project employee_project_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_project
    ADD CONSTRAINT employee_project_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: employee_project employee_project_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_project
    ADD CONSTRAINT employee_project_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id);


--
-- Name: employee_team employee_team_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_team
    ADD CONSTRAINT employee_team_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id) ON DELETE CASCADE;


--
-- Name: employee_team employee_team_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_team
    ADD CONSTRAINT employee_team_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: feedback feedback_hr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_hr_id_fkey FOREIGN KEY (hr_id) REFERENCES public.hr(hr_id);


--
-- Name: financial_records financial_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_records
    ADD CONSTRAINT financial_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: financial_records financial_records_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_records
    ADD CONSTRAINT financial_records_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- Name: manager fk_team; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES public.team_manager(team_id);


--
-- Name: hr hr_hr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr
    ADD CONSTRAINT hr_hr_id_fkey FOREIGN KEY (hr_id) REFERENCES public.users(user_id);


--
-- Name: manager manager_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(user_id);


--
-- Name: projects projects_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team_manager(team_id);


--
-- Name: psychological_assessments psychological_assessments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.psychological_assessments
    ADD CONSTRAINT psychological_assessments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: team_manager team_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_manager
    ADD CONSTRAINT team_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.manager(manager_id);


--
-- PostgreSQL database dump complete
--

