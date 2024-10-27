# TODO: develop langchain agent

from employee_agent import EmployeeAgent
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
import os
import logging
import openai
import time

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a single instance of EmployeeAgent to maintain conversation state
employee_agent = EmployeeAgent()

def process_personal_savings(message, user_id):
    """Process personal savings related queries using EmployeeAgent"""
    try:
        # Debug log
        logger.info(f"Processing personal savings message for user {user_id}: {message}")
        
        # Check API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found")
            return {
                "reply": "Service unavailable: API key not configured",
                "success": False
            }
        
        # Check API key type
        if api_key.startswith('sk-proj'):
            logger.warning("Using project API key, which may have limitations")
        
        # Add delay to avoid rate limits
        time.sleep(2)
        
        # Process message using EmployeeAgent
        try:
            response = employee_agent.process_message(message, user_id)
            logger.info(f"EmployeeAgent response: {response}")
            
            return {
                "reply": response,
                "success": True
            }
            
        except openai.RateLimitError as e:
            logger.error(f"Rate limit exceeded: {e}")
            return {
                "reply": "Service temporarily unavailable due to high demand. Please try again in a few minutes.",
                "success": False
            }
            
    except Exception as e:
        logger.error(f"Error in process_personal_savings: {str(e)}")
        return {
            "reply": "An unexpected error occurred.",
            "success": False
        }

def process_mental_health(message, employee_id):
    # TODO: Implement mental health monitoring processing logic
    # This should include code for sentiment analysis and mental health advice generation
    pass

def process_ai_secretary(message, user_id):
    # TODO: Implement AI secretary processing logic
    # This should include code for interacting with a large language model
    pass
