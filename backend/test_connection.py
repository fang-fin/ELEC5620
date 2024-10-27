from database import openConnection
import logging

logging.basicConfig(level=logging.INFO)

def test_database_connection():
    conn = openConnection()
    if conn:
        logging.info("Successfully connected to the database!")
        
        # 测试查询
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                logging.info(f"PostgreSQL version: {version}")
                
                # 测试 users 表
                cursor.execute("SELECT COUNT(*) FROM users;")
                user_count = cursor.fetchone()
                logging.info(f"Number of users in database: {user_count[0]}")
                
        except Exception as e:
            logging.error(f"Error executing query: {e}")
        finally:
            conn.close()
            logging.info("Database connection closed")
    else:
        logging.error("Failed to connect to the database")

if __name__ == "__main__":
    test_database_connection()
