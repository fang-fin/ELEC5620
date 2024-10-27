from typing import Dict, Any, Optional
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage
import requests
import json
import logging
from enum import Enum
import time
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmployeeAgentType(Enum):
    """Types of specialized agents for employee services"""
    MAIN = "main"
    PSYCH_ASSESSMENT = "psychological_assessment"
    FEEDBACK = "feedback"
    CLOCKIN = "clockin"

class EmployeeAgent:
    def __init__(self):
        # Initialize different specialized agents
        self.agents = {
            EmployeeAgentType.MAIN: self._create_main_agent(),
            EmployeeAgentType.PSYCH_ASSESSMENT: self._create_psych_assessment_agent(),
            EmployeeAgentType.FEEDBACK: self._create_feedback_agent(),
            EmployeeAgentType.CLOCKIN: self._create_clockin_agent()
        }
        
        # Current active agent type
        self.current_agent = EmployeeAgentType.MAIN
        
        # Conversation state management
        self.conversation_state = {
            "current_flow": None,
            "collected_data": {},
            "last_response": None
        }

    def _create_main_agent(self) -> LLMChain:
        """Create main conversation agent for general employee assistance"""
        main_prompt = PromptTemplate(
            input_variables=["chat_history", "human_input"],
            template="""You are an AI assistant for company employees. Your main functions are:
            1. Provide savings tips and financial advice
            2. Guide on company expense compliance
            3. Direct to specialized assistants when needed

            Switch to specialized assistants when:
            1. User mentions psychological assessment or self-evaluation
            2. User wants to submit feedback
            3. User asks about clock-in records analysis

            If switching needed, respond with: "SWITCH_TO:[FUNCTION]"
            Example: "SWITCH_TO:PSYCH_ASSESSMENT"

            Chat History:
            {chat_history}
            
            Human: {human_input}
            Assistant: """
        )
        
        return LLMChain(
            llm=ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo"),
            prompt=main_prompt,
            memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True),
            verbose=True
        )

    def _create_psych_assessment_agent(self) -> LLMChain:
        """Create psychological assessment assistant"""
        psych_prompt = PromptTemplate(
            input_variables=["current_step", "collected_data"],
            template="""You are a psychological assessment assistant. Guide the user through three specific questions:

            Questions to ask:
            1. You are walking in the desert and you see a tortoise lying on its back, struggling to turn over. What do you do?
            2. If your family needed your help, what would you do?
            3. When you see someone in pain, how do you react?

            Collected data so far:
            {collected_data}

            Current step: {current_step}

            If all questions are answered, respond with: "COMPLETE"
            If user requests to exit, respond with: "EXIT"
            
            Please continue guiding the user:"""
        )
        
        return LLMChain(
            llm=ChatOpenAI(temperature=0.3, model_name="gpt-3.5-turbo"),
            prompt=psych_prompt,
            verbose=True
        )

    def _create_feedback_agent(self) -> LLMChain:
        """Create feedback submission assistant"""
        feedback_prompt = PromptTemplate(
            input_variables=["current_step", "collected_data"],
            template="""You are an empathetic AI feedback assistant who helps employees express their concerns and suggestions effectively.

            Your Personality:
            - Empathetic and understanding
            - Professional yet friendly
            - Proactive in identifying underlying concerns
            - Skilled at structuring casual feedback into actionable insights

            Current Context:
            {collected_data}

            Current conversation step: {current_step}

            Your Capabilities:
            1. When receiving initial feedback:
               - Understand the core message
               - Identify emotional undertones
               - Recognize key areas of concern
               - Reflect back understanding and ask for confirmation

            2. When user confirms:
               - Respond with "COMPLETE" to trigger submission
               - Do not include conversation history in your response

            3. If feedback needs clarification:
               - Ask specific, relevant questions
               - Help user articulate their thoughts better

            Response Guidelines:
            - Respond ONLY with your next message to the user
            - Do not repeat the conversation history
            - Keep responses concise and focused
            - If user confirms, just respond with "COMPLETE"
            - If user says "exit", just respond with "EXIT"

            Example Responses:
            - "I understand your concern about work-life balance. Would you like me to submit this feedback?"
            - "COMPLETE"
            - "Could you tell me more about how this affects your work?"

            Please provide your next response to the user:"""
        )
        
        return LLMChain(
            llm=ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo"),
            prompt=feedback_prompt,
            verbose=True
        )

    def _create_clockin_agent(self) -> LLMChain:
        """Create clock-in records analysis assistant"""
        clockin_prompt = PromptTemplate(
            input_variables=["current_step", "collected_data"],
            template="""You are a clock-in records analysis assistant. Help analyze work patterns and provide insights.

            Focus on:
            - Work duration patterns
            - Project time allocation
            - Schedule optimization suggestions

            Current analysis:
            {collected_data}

            Current step: {current_step}

            If analysis is complete, respond with: "COMPLETE"
            If user requests to exit, respond with: "EXIT"
            
            Please continue the analysis:"""
        )
        
        return LLMChain(
            llm=ChatOpenAI(temperature=0.3, model_name="gpt-3.5-turbo"),
            prompt=clockin_prompt,
            verbose=True
        )

    def _detect_intent(self, message: str) -> Optional[EmployeeAgentType]:
        """Detect user intent and determine appropriate agent"""
        message_lower = message.lower()
        logger.info(f"Detecting intent from message: {message}")
        
        if any(term in message_lower for term in ["psychological", "assessment", "evaluation"]):
            logger.info("Detected intent: PSYCH_ASSESSMENT")
            return EmployeeAgentType.PSYCH_ASSESSMENT
        elif "feedback" in message_lower:
            logger.info("Detected intent: FEEDBACK")
            return EmployeeAgentType.FEEDBACK
        elif any(term in message_lower for term in ["clock", "time", "hours"]):
            logger.info("Detected intent: CLOCKIN")
            return EmployeeAgentType.CLOCKIN
            
        logger.info("No specific intent detected, staying with MAIN agent")
        return None

    def _handle_agent_switch(self, target_agent: EmployeeAgentType) -> str:
        """Handle switching between agents"""
        logger.info(f"Switching agent from {self.current_agent} to {target_agent}")
        self.current_agent = target_agent
        self.conversation_state = {
            "current_flow": target_agent.value,
            "collected_data": {},
            "last_response": None
        }
        logger.info(f"Conversation state reset for new agent: {target_agent}")
        
        # Welcome messages for each agent
        welcome_messages = {
            EmployeeAgentType.PSYCH_ASSESSMENT: "I'll help you complete your psychological self-assessment. Let's start with the first question: You are walking in the desert and you see a tortoise lying on its back, struggling to turn over. What do you do?",
            EmployeeAgentType.FEEDBACK: "I'll help you submit your feedback. Please describe what you'd like to share.",
            EmployeeAgentType.CLOCKIN: "I'll help analyze your clock-in records. Would you like to see your work duration patterns or project time allocation?"
        }
        
        message = welcome_messages.get(target_agent, "How can I assist you?")
        logger.info(f"Sending welcome message for {target_agent}: {message}")
        return message

    def _call_api(self, agent_type: EmployeeAgentType, data: Dict[str, Any]) -> Dict[str, Any]:
        """Call appropriate API based on agent type"""
        try:
            # Define API endpoints for different agent types
            api_endpoints = {
                EmployeeAgentType.PSYCH_ASSESSMENT: "http://localhost:5000/api/psychological-assessments",
                EmployeeAgentType.FEEDBACK: "http://localhost:5000/api/feedback",
                EmployeeAgentType.CLOCKIN: "http://localhost:5000/api/clock-in"
            }
            
            api_endpoint = api_endpoints.get(agent_type)
            if not api_endpoint:
                raise ValueError(f"No API endpoint defined for agent type: {agent_type}")
                
            logger.info(f"Calling API: {api_endpoint}")
            logger.info(f"With data: {data}")
            
            response = requests.post(
                api_endpoint,
                json=data,
                headers={"Content-Type": "application/json"}
            )
            
            logger.info(f"API response status: {response.status_code}")
            logger.info(f"API response content: {response.json()}")
            
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"API call failed: {str(e)}")
            raise

    def process_message(self, message: str, user_id: str) -> str:
        """Process user message and manage conversation flow"""
        try:
            logger.info(f"\n{'='*50}")
            logger.info(f"Processing message for user {user_id}")
            logger.info(f"Current agent: {self.current_agent}")
            logger.info(f"Message: {message}")
            
            # Check if need to switch agent
            if self.current_agent == EmployeeAgentType.MAIN:
                intent = self._detect_intent(message)
                if intent:
                    logger.info(f"Switching to specialized agent: {intent}")
                    return self._handle_agent_switch(intent)
                
                logger.info("Using main agent for general conversation")
                response = self.agents[EmployeeAgentType.MAIN].predict(human_input=message)
                
                if response.startswith("SWITCH_TO:"):
                    target_agent = EmployeeAgentType[response.split(":")[1]]
                    logger.info(f"Main agent suggested switch to: {target_agent}")
                    return self._handle_agent_switch(target_agent)
                return response
            
            # Handle specialized agent conversations
            logger.info(f"Processing with specialized agent: {self.current_agent}")
            agent_chain = self.agents[self.current_agent]
            current_state = self.conversation_state
            
            # Check for exit command
            if "exit" in message.lower():
                logger.info("Exit command detected, returning to main agent")
                self.current_agent = EmployeeAgentType.MAIN
                return "Exited current function. How else can I help you?"
            
            # Process message with current specialized agent
            logger.info("Current conversation state:")
            logger.info(f"Flow: {current_state.get('current_flow')}")
            logger.info(f"Collected data: {current_state.get('collected_data')}")
            
            response = agent_chain.predict(
                current_step=current_state.get("current_flow"),
                collected_data=json.dumps(current_state.get("collected_data"), ensure_ascii=False)
            )
            
            logger.info(f"Agent response: {response}")
            
            # Handle completion of specialized task
            if response == "COMPLETE":
                logger.info("Task completion detected, preparing API call")
                try:
                    api_data = {
                        "userId": user_id,
                        **current_state["collected_data"]
                    }
                    logger.info(f"Calling API for {self.current_agent} with data: {api_data}")
                    
                    api_response = self._call_api(
                        self.current_agent,
                        api_data
                    )
                    
                    logger.info(f"API response: {api_response}")
                    logger.info("Returning to main agent")
                    self.current_agent = EmployeeAgentType.MAIN
                    return f"Task completed successfully! {api_response.get('message', '')}"
                    
                except Exception as e:
                    logger.error(f"API call failed: {str(e)}")
                    return "Sorry, there was an error processing your request. Please try again."
            
            # Update conversation state based on agent type
            logger.info(f"Updating conversation state for {self.current_agent}")
            if self.current_agent == EmployeeAgentType.PSYCH_ASSESSMENT:
                # Store answers for psychological assessment
                if "Q1:" in response:
                    current_state["collected_data"]["q1"] = message
                    logger.info("Stored Q1 response")
                elif "Q2:" in response:
                    current_state["collected_data"]["q2"] = message
                    logger.info("Stored Q2 response")
                elif "Q3:" in response:
                    current_state["collected_data"]["q3"] = message
                    logger.info("Stored Q3 response")
            
            elif self.current_agent == EmployeeAgentType.FEEDBACK:
                # if user confirms feedback submission
                if message.lower() in ['yes', 'confirm', 'agree', "that's exactly it"]:
                    logger.info("User confirmed feedback submission")
                    # prepare API call data
                    api_data = {
                        "userId": user_id,
                        "content": current_state["collected_data"].get("content", ""),
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    try:
                        logger.info(f"Calling feedback API with data: {api_data}")
                        api_response = self._call_api(
                            self.current_agent,
                            api_data
                        )
                        logger.info(f"Feedback API response: {api_response}")
                        
                        # reset state and return to main conversation
                        self.current_agent = EmployeeAgentType.MAIN
                        return f"Feedback submitted successfully! {api_response.get('message', '')}"
                        
                    except Exception as e:
                        logger.error(f"Failed to submit feedback: {e}")
                        return "Sorry, there was an error submitting your feedback. Please try again."
                else:
                    # store feedback content
                    current_state["collected_data"]["content"] = message
                    logger.info(f"Stored feedback content: {message}")
            
            elif self.current_agent == EmployeeAgentType.CLOCKIN:
                current_state["collected_data"]["analysis_request"] = message
                logger.info("Stored clock-in analysis request")
            
            self.conversation_state["last_response"] = response
            logger.info(f"{'='*50}\n")
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return "I apologize, but I encountered an error. Please try again or contact support."

    def reset(self):
        """Reset the conversation state"""
        self.current_agent = EmployeeAgentType.MAIN
        self.conversation_state = {
            "current_flow": None,
            "collected_data": {},
            "last_response": None
        }
        logger.info("Conversation state reset")

# Test function
def test_employee_agent():
    """Test the employee agent functionality"""
    agent = EmployeeAgent()
    user_id = "test_user"
    
    test_messages = [
        "I need help with saving money",
        "I want to do a psychological assessment",
        "Here's my answer to Q1: I would help the tortoise",
        "I want to submit feedback",
        "I'd like to analyze my work hours",
        "exit"
    ]
    
    print("Starting Employee Agent test...")
    for message in test_messages:
        print(f"\nUser: {message}")
        response = agent.process_message(message, user_id)
        print(f"AI: {response}")
        time.sleep(2)  # Avoid rate limiting

if __name__ == "__main__":
    test_employee_agent()
