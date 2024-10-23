#!/usr/bin/env python3
import psycopg2
import logging 

#####################################################
##  Database Connection
#####################################################

def openConnection():

    database_name = "elec5620"
    userid = "postgres"
    passwd = "PASSword123."
    myHost = "elec5620.cdce2uw4szzi.ap-southeast-2.rds.amazonaws.com"  # RDS' Endpoint

    conn = None
    try:
        # connect to RDS PostgreSQL instance
        conn = psycopg2.connect(database=database_name, user=userid, password=passwd, host=myHost, port="5432")
        return conn
    except psycopg2.Error as e:
        logging.error(f"Database connection error: {e}")
        return conn

def check_login(username, password):
    conn = openConnection()
    if not conn:
        logging.error("Failed to connect to the database.")
        return None

    try:
        with conn.cursor() as cursor:
            query = """
            SELECT firstName, lastName, role 
            FROM users 
            WHERE user_id = %s AND password = %s
            """
            cursor.execute(query, (user_id, password))
            user = cursor.fetchone()

            if user:
                return {
                    'firstName': user[0],
                    'lastName': user[1],
                    'role': user[2]
                }
            else:
                return None
    except psycopg2.Error as e:
        logging.error(f"Error fetching user: {e}")
        return None
    finally:
        conn.close() 

def get_projects():
    conn = openConnection()
    if not conn:
        logging.error("Failed to connect to the database.")
        return None

    try:
        with conn.cursor() as cursor:
            query = """
            SELECT project_id, project_name
            FROM projects
            """
            cursor.execute(query)
            projects = cursor.fetchall()

            project_list = []
            for project in projects:
                project_list.append({
                    'Project_id': project[0],
                    'project_name': project[1]
                })

            return project_list
    except psycopg2.Error as e:
        logging.error(f"Error fetching projects: {e}")
        return None
    finally:
        conn.close()

def get_project_details(project_id):
    conn = openConnection()
    if not conn:
        logging.error("Failed to connect to the database.")
        return None

    try:
        with conn.cursor() as cursor:
            # Fetch project details including duration based on start_date and deadline
            query = """
            SELECT p.project_id, p.project_name, p.description, p.deadline, p.start_date,
                   SUM(e.salary * ep.hours_worked) AS total_earning, 
                   EXTRACT(EPOCH FROM (p.deadline - p.start_date)) / 3600 AS total_duration
            FROM projects p
            LEFT JOIN employee_project ep ON p.project_id = ep.project_id
            LEFT JOIN employee e ON e.employee_id = ep.employee_id
            WHERE p.project_id = %s
            GROUP BY p.project_id
            """
            cursor.execute(query, (project_id,))
            project = cursor.fetchone()

            if project:
                # Fetch employees working on the project
                employee_query = """
                SELECT e.employee_id 
                FROM employee_project ep
                JOIN employee e ON e.employee_id = ep.employee_id
                WHERE ep.project_id = %s
                """
                cursor.execute(employee_query, (project_id,))
                employees = [row[0] for row in cursor.fetchall()]

                return {
                    "id": str(project[0]),
                    "name": project[1],
                    "description": project[2],
                    "deadline": project[3].isoformat(),  # Convert to ISO 8601 format
                    "employees": employees,
                    "totalEarning": float(project[5]) if project[5] else 0.0,
                    "totalDuration": float(project[6]) if project[6] else 0.0  # Duration in hours
                }
            else:
                return None
    except psycopg2.Error as e:
        logging.error(f"Error fetching project details: {e}")
        return None
    finally:
        conn.close()

def get_teams():
    # TODO: Implement logic to retrieve all teams
    # 1. Connect to the database
    # 2. Query the team table to get all team information
    # 3. Return the list of teams
    pass

def get_team_details(team_id):
    # TODO: Implement logic to retrieve specific team details
    # 1. Connect to the database
    # 2. Query the team table based on team_id to get detailed team information
    # 3. Return team details
    pass

def get_financial_records():
    # TODO: Implement logic to retrieve financial records
    # 1. Connect to the database
    # 2. Query the financial records table to get all financial records
    # 3. Return the list of financial records
    pass

def get_psychological_assessments():
    # TODO: Implement logic to retrieve psychological assessments
    # 1. Connect to the database
    # 2. Query the psychological assessment table to get all assessment records
    # 3. Return the list of psychological assessments
    pass

def get_feedback():
    # TODO: Implement logic to retrieve feedback
    # 1. Connect to the database
    # 2. Query the feedback table to get all feedback records
    # 3. Return the list of feedback
    pass

def get_clock_in_records():
    # TODO: Implement logic to retrieve clock-in records
    # 1. Connect to the database
    # 2. Query the clock-in records table to get all clock-in records
    # 3. Return the list of clock-in records
    pass

def get_employees():
    # TODO: Implement logic to retrieve all employees
    # 1. Connect to the database
    # 2. Query the employee table to get all employee information
    # 3. Return the list of employees
    pass

def get_employee_time_analysis():
    # TODO: Implement logic to retrieve employee time analysis
    # 1. Connect to the database
    # 2. Query the clock-in records table to calculate working hours for each employee
    # 3. Return employee time analysis results
    pass

def create_project(project_data):
    # TODO: Implement logic to create a project
    # 1. Connect to the database
    # 2. Insert project_data into the project table
    # 3. Return the ID of the newly created project
    pass

def update_project(project_id, project_data):
    # TODO: Implement logic to update a project
    # 1. Connect to the database
    # 2. Update the project table based on project_id with the relevant information
    # 3. Return whether the update was successful
    pass

def create_team(team_data):
    # TODO: Implement logic to create a team
    # 1. Connect to the database
    # 2. Insert team_data into the team table
    # 3. Return the ID of the newly created team
    pass

def update_team(team_id, team_data):
    # TODO: Implement logic to update a team
    # 1. Connect to the database
    # 2. Update the team table based on team_id with the relevant information
    # 3. Return whether the update was successful
    pass

def add_financial_record(record_data):
    # TODO: Implement logic to add a financial record
    # 1. Connect to the database
    # 2. Insert record_data into the financial records table
    # 3. Return the ID of the newly created record
    pass

def submit_psychological_assessment(assessment_data):
    # TODO: Implement logic to submit a psychological assessment
    # 1. Connect to the database
    # 2. Insert assessment_data into the psychological assessment table
    # 3. Return the ID of the newly created assessment
    pass

def submit_feedback(feedback_data):
    # TODO: Implement logic to submit feedback
    # 1. Connect to the database
    # 2. Insert feedback_data into the feedback table
    # 3. Return the ID of the newly created feedback
    pass

def add_employee(employee_data):
    # TODO: Implement logic to add an employee
    # 1. Connect to the database
    # 2. Insert employee_data into the employee table
    # 3. Return the ID of the newly created employee
    pass

def get_time_tracking_data():
    # TODO: Implement logic to retrieve time tracking data
    # 1. Connect to the database
    # 2. Query the time tracking table to get all time tracking records
    # 3. Return the list of time tracking data
    pass

def add_time_tracking_record(record_data):
    # TODO: Implement logic to add a time tracking record
    # 1. Connect to the database
    # 2. Insert record_data into the time tracking table
    # 3. Return the ID of the newly created record
    pass

def submit_clock_in(clock_in_data):
    # TODO: Implement logic to submit a clock-in record
    # 1. Connect to the database
    # 2. Insert clock_in_data into the clock-in records table
    # 3. Return the ID of the newly created clock-in record
    pass
