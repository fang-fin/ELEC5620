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

def check_login(user_id, password):
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
