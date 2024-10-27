# TODO: develop langchain agent

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

def process_ai_secretary(message, user_id):
    # TODO: Implement AI secretary processing logic
    # This should include code for interacting with a large language model
    pass


def process_personal_savings(message, user_id):
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found")
            return {
                "reply": "Service unavailable: API key not configured",
                "success": False
            }
        
        # 检查 API key 类型
        if api_key.startswith('sk-proj'):
            logger.warning("Using project API key, which may have limitations")
        
        # 添加延迟以遵守速率限制
        time.sleep(5)  # 在每次 API 调用前等待 5 秒
        
        # 初始化 ChatOpenAI
        logger.info("Initializing ChatOpenAI...")
        chat = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-3.5-turbo",
            openai_api_key=api_key,
            request_timeout=30  # 增加超时时间
        )
        logger.info("ChatOpenAI initialized successfully")

        # Create system message for context
        system_message = SystemMessage(content="""
        You are a personal savings assistant. Your role is to:
        1. Provide financial advice
        2. Help with budgeting
        3. Suggest saving strategies
        4. Answer questions about personal finance
        Be friendly and professional in your responses.
        """)

        # Create human message from user input
        human_message = HumanMessage(content=message)

        # Debug logs
        logger.info(f"Processing message for user {user_id}: {message}")

        # Get response from ChatGPT with retry mechanism
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = chat([system_message, human_message])
                logger.info(f"AI response: {response.content}")
                return {
                    "reply": response.content,
                    "success": True
                }
            except openai.RateLimitError as e:
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 10  # 逐步增加等待时间
                    logger.warning(f"Rate limit hit, waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                else:
                    raise

    except openai.RateLimitError as e:
        logger.error(f"Rate limit exceeded after retries: {e}")
        return {
            "reply": "Service temporarily unavailable due to high demand. Please try again in a few minutes.",
            "success": False
        }
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {
            "reply": "An unexpected error occurred.",
            "success": False
        }

def process_mental_health(message, employee_id):
    # TODO: Implement mental health monitoring processing logic
    # This should include code for sentiment analysis and mental health advice generation
    pass
