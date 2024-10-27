from agent import process_personal_savings
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_personal_savings():
    test_cases = [
        "How can I save money on my daily expenses?"
    ]
    
    user_id = "test_user"
    
    for i, message in enumerate(test_cases):
        try:
            logger.info(f"\nTest {i+1}: Sending message: {message}")
            
            # 在每次测试之间添加较长的延迟
            if i > 0:
                wait_time = 20  # 20秒延迟
                logger.info(f"Waiting {wait_time} seconds before next test...")
                time.sleep(wait_time)
            
            response = process_personal_savings(message, user_id)
            logger.info(f"Response: {response}")
            
            if response['success']:
                logger.info("Test passed ✓")
            else:
                logger.warning("Test failed ✗")
                
        except Exception as e:
            logger.error(f"Test failed with error: {e}")
            return False
            
        logger.info("-" * 50)
    
    return True

if __name__ == "__main__":
    logger.info("Starting Personal Savings Assistant tests...")
    success = test_personal_savings()
    logger.info(f"Tests completed. Overall success: {'✓' if success else '✗'}")
