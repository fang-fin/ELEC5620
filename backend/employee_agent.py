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
            template="""You are an empathetic feedback assistant who helps employees submit their feedback efficiently.

            Your role:
            1. Identify the key points from user's casual comments
            2. Categorize feedback (work-life balance, workplace environment, management, etc.)
            3. Structure the feedback professionally
            4. Confirm with user before submission

            Current feedback data:
            {collected_data}

            Current step: {current_step}

            Guidelines:
            - If user provides vague feedback like "I want better work-life balance", ask ONE brief follow-up question
            - If you understand the main point, structure it and prepare for submission
            - If user confirms, respond with: "COMPLETE"
            - If user wants to exit, respond with: "EXIT"

            Example dialogue:
            User: "I want better work-life balance"
            Assistant: "I understand you're concerned about work-life balance. Would you like me to submit this feedback focusing on requesting more flexible working hours or reduced overtime?"
            User: "Yes, flexible hours"
            Assistant: "I'll submit your feedback requesting better work-life balance through flexible working hours. Should I proceed with the submission?"

            Please respond to the user:"""
        )
        
        return LLMChain(
            llm=ChatOpenAI(temperature=0.3, model_name="gpt-3.5-turbo"),
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
        
        if any(term in message_lower for term in ["psychological", "assessment", "evaluation"]):
            return EmployeeAgentType.PSYCH_ASSESSMENT
        elif "feedback" in message_lower:
            return EmployeeAgentType.FEEDBACK
        elif any(term in message_lower for term in ["clock", "time", "hours"]):
            return EmployeeAgentType.CLOCKIN
            
        return None

    def _handle_agent_switch(self, target_agent: EmployeeAgentType) -> str:
        """Handle switching between agents"""
        self.current_agent = target_agent
        self.conversation_state = {
            "current_flow": target_agent.value,
            "collected_data": {},
            "last_response": None
        }
        
        # Welcome messages for each agent
        welcome_messages = {
            EmployeeAgentType.PSYCH_ASSESSMENT: "I'll help you complete your psychological self-assessment. Let's start with the first question: You are walking in the desert and you see a tortoise lying on its back, struggling to turn over. What do you do?",
            EmployeeAgentType.FEEDBACK: "I'll help you submit your feedback. Please describe what you'd like to share.",
            EmployeeAgentType.CLOCKIN: "I'll help analyze your clock-in records. Would you like to see your work duration patterns or project time allocation?"
        }
        
        return welcome_messages.get(target_agent, "How can I assist you?")

    def _call_api(self, agent_type: EmployeeAgentType, data: Dict[str, Any]) -> Dict[str, Any]:
        """Call appropriate API based on agent type"""
        api_endpoints = {
            EmployeeAgentType.PSYCH_ASSESSMENT: "/api/psychological-assessments",
            EmployeeAgentType.FEEDBACK: "/api/feedback",
            EmployeeAgentType.CLOCKIN: "/api/clock-in-records"
        }
        
        try:
            response = requests.post(
                api_endpoints[agent_type],
                json=data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"API call failed: {str(e)}")
            raise

    def process_message(self, message: str, user_id: str) -> str:
        """Process user message and manage conversation flow"""
        try:
            # Check if need to switch agent
            if self.current_agent == EmployeeAgentType.MAIN:
                intent = self._detect_intent(message)
                if intent:
                    return self._handle_agent_switch(intent)
                
                # Use main model for general conversation
                response = self.agents[EmployeeAgentType.MAIN].predict(human_input=message)
                if response.startswith("SWITCH_TO:"):
                    target_agent = EmployeeAgentType[response.split(":")[1]]
                    return self._handle_agent_switch(target_agent)
                return response
            
            # Handle specialized agent conversations
            agent_chain = self.agents[self.current_agent]
            current_state = self.conversation_state
            
            # Check for exit command
            if "exit" in message.lower():
                self.current_agent = EmployeeAgentType.MAIN
                return "Exited current function. How else can I help you?"
            
            # Process message with current specialized agent
            response = agent_chain.predict(
                current_step=current_state.get("current_flow"),
                collected_data=json.dumps(current_state.get("collected_data"), ensure_ascii=False)
            )
            
            # Handle completion of specialized task
            if response == "COMPLETE":
                try:
                    # Prepare data for API call
                    api_data = {
                        "userId": user_id,
                        **current_state["collected_data"]
                    }
                    
                    # Call appropriate API
                    api_response = self._call_api(
                        self.current_agent,
                        api_data
                    )
                    
                    # Reset to main agent
                    self.current_agent = EmployeeAgentType.MAIN
                    return f"Task completed successfully! {api_response.get('message', '')}"
                    
                except Exception as e:
                    logger.error(f"API call failed: {str(e)}")
                    return "Sorry, there was an error processing your request. Please try again."
            
            # Update conversation state
            if self.current_agent == EmployeeAgentType.PSYCH_ASSESSMENT:
                # Store answers for psychological assessment
                if "Q1:" in response:
                    current_state["collected_data"]["q1"] = message
                elif "Q2:" in response:
                    current_state["collected_data"]["q2"] = message
                elif "Q3:" in response:
                    current_state["collected_data"]["q3"] = message
            
            elif self.current_agent == EmployeeAgentType.FEEDBACK:
                # Store feedback content
                current_state["collected_data"]["content"] = message
            
            elif self.current_agent == EmployeeAgentType.CLOCKIN:
                # Store clock-in analysis request
                current_state["collected_data"]["analysis_request"] = message
            
            self.conversation_state["last_response"] = response
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
