from database import openConnection
import logging

logging.basicConfig(level=logging.INFO)

def test_database_connection():
    conn = openConnection()
    if conn:
        logging.info("Successfully connected to the database!")
        
        try:
            with conn.cursor() as cursor:
                # Test projects table
                cursor.execute("""
                    SELECT project_id, project_name, description, deadline 
                    FROM projects 
                    ORDER BY project_id DESC 
                    LIMIT 5
                """)
                projects = cursor.fetchall()
                logging.info("Latest 5 projects:")
                for project in projects:
                    logging.info(f"ID: {project[0]}, Name: {project[1]}, Deadline: {project[3]}")

                # Test teams table
                cursor.execute("""
                    SELECT id, name, description 
                    FROM teams 
                    ORDER BY id DESC 
                    LIMIT 5
                """)
                teams = cursor.fetchall()
                logging.info("\nLatest 5 teams:")
                for team in teams:
                    logging.info(f"ID: {team[0]}, Name: {team[1]}")

                # Test employee assignments
                cursor.execute("""
                    SELECT ep.project_id, p.project_name, ep.employee_id
                    FROM employee_project ep
                    JOIN projects p ON ep.project_id = p.project_id
                    ORDER BY ep.project_id DESC
                    LIMIT 5
                """)
                assignments = cursor.fetchall()
                logging.info("\nLatest 5 project assignments:")
                for assignment in assignments:
                    logging.info(f"Project ID: {assignment[0]}, Name: {assignment[1]}, Employee: {assignment[2]}")

        except Exception as e:
            logging.error(f"Error executing query: {e}")
        finally:
            conn.close()
            logging.info("Database connection closed")
    else:
        logging.error("Failed to connect to the database")

if __name__ == "__main__":
    test_database_connection()
