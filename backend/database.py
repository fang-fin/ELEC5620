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
    # TODO: Implement user authentication logic
    # 1. Connect to the database
    # 2. Query the user table to verify username and password
    # 3. Return user role information
    pass

def get_projects():
    # TODO: Implement logic to retrieve all projects
    # 1. Connect to the database
    # 2. Query the project table to get all project information
    # 3. Return the list of projects
    pass

def get_project_details(project_id):
    # TODO: Implement logic to retrieve specific project details
    # 1. Connect to the database
    # 2. Query the project table based on project_id to get detailed project information
    # 3. Return project details
    pass

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
