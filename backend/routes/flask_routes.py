from flask import Flask, request, jsonify
from models.api_class import APIBuilder, ManagerAPI, EmployeeAPI, HRAPI
from langchain.llms import OpenAI
from langchain.chains import ConversationChain

app = Flask(__name__)
llm = OpenAI(temperature=0.7)
conversation = ConversationChain(llm=llm, verbose=True)

class APIDirector:
    def __init__(self):
        self._builder = None

    def construct_api(self, role):
        if role == "manager":
            self._builder = ManagerAPI()
        elif role == "employee":
            self._builder = EmployeeAPI()
        elif role == "hr":
            self._builder = HRAPI()
        else:
            raise ValueError("Invalid role")

        self._builder.create_new_api()
        self._builder.add_general_functions()
        self._builder.add_ai_functions()

    @property
    def api(self):
        return self._builder.api

director = APIDirector()

@app.route('/api/login', methods=['POST'])
def login():
    # TODO: Implement login logic with psycopg2
    return jsonify({"success": True, "message": "Login successful", "role": "manager", "token": "sample_token"})

# Manager routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    director.construct_api("manager")
    return jsonify(director.api.manage_projects())

@app.route('/api/teams', methods=['GET'])
def get_teams():
    director.construct_api("manager")
    return jsonify(director.api.manage_team())

@app.route('/api/ai-secretary', methods=['POST'])
def ai_secretary():
    director.construct_api("manager")
    user_input = request.json.get('message')
    return jsonify({"reply": director.api.ai_secretary(user_input)})

# Employee routes
@app.route('/api/financial-report', methods=['GET'])
def financial_report():
    director.construct_api("employee")
    return jsonify(director.api.financial_report())

@app.route('/api/psychological-assessments', methods=['POST'])
def self_assessment():
    director.construct_api("employee")
    assessment = request.json.get('assessment')
    return jsonify(director.api.self_assessment(assessment))

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    director.construct_api("employee")
    feedback = request.json.get('content')
    return jsonify(director.api.submit_feedback(feedback))

@app.route('/api/clock-in', methods=['POST'])
def clock_in():
    director.construct_api("employee")
    clock_in_data = request.json
    return jsonify(director.api.clock_in(clock_in_data))

@app.route('/api/personal-savings', methods=['POST'])
def personal_savings_assistant():
    director.construct_api("employee")
    user_input = request.json.get('message')
    return jsonify({"reply": director.api.personal_savings_assistant(user_input)})

# HR routes
@app.route('/api/employees', methods=['GET'])
def get_employees():
    director.construct_api("hr")
    return jsonify(director.api.employee_management())

@app.route('/api/advice-box', methods=['GET'])
def advice_box():
    director.construct_api("hr")
    return jsonify(director.api.advice_box())

@app.route('/api/employee-time-analysis', methods=['GET'])
def time_analysis():
    director.construct_api("hr")
    return jsonify(director.api.time_analysis())

@app.route('/api/mental-health', methods=['POST'])
def mental_health_monitor():
    director.construct_api("hr")
    user_input = request.json.get('message')
    return jsonify({"reply": director.api.mental_health_monitor(user_input)})

if __name__ == '__main__':
    app.run(debug=True)

