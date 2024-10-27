from flask import Flask, jsonify, request
from database import *
from agent import process_ai_secretary, process_personal_savings, process_mental_health

app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username', '').lower()
        password = data.get('password', '')
        
        logging.info(f"Login attempt for user: {username}")
        
        user_data = check_login(username, password)
        
        if user_data:
            logging.info(f"Login successful for user: {username}")
            return jsonify({
                "success": True,
                "message": "Login successful",
                "role": user_data['role']
            }), 200
        else:
            logging.warning(f"Login failed for user: {username}")
            return jsonify({
                "success": False, 
                "message": "Invalid credentials"
            }), 401
            
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route('/api/projects', methods=['GET'])
def get_projects_route():
    logging.info("GET /api/projects called")
    projects = get_projects()
    logging.info(f"Retrieved projects: {projects}")
    if projects is None:
        return jsonify({"success": False, "message": "Failed to retrieve projects"}), 500
    return jsonify({"success": True, "projects": projects}), 200

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project_details_route(project_id):
    project = get_project_details(project_id)
    if project is None:
        return jsonify({"success": False, "message": "Project not found"}), 404
    return jsonify({"success": True, "projectDetails": project}), 200

@app.route('/api/teams', methods=['GET'])
def get_teams_route():
    logging.info("GET /api/teams called")
    teams = get_teams()
    logging.info(f"Retrieved teams: {teams}")
    if teams is None:
        return jsonify({"success": False, "message": "Failed to retrieve teams"}), 500
    return jsonify({"success": True, "teams": teams}), 200

@app.route('/api/teams/<team_id>', methods=['GET'])
def get_team_details_route(team_id):
    team = get_team_details(team_id)
    if team is None:
        return jsonify({"success": False, "message": "Team not found"}), 404
    return jsonify({"success": True, "teamDetails": team}), 200

@app.route('/api/financial-records', methods=['GET'])
def get_financial_records_route():
    try:
        records_data = get_financial_records()
        if not records_data or 'records' not in records_data:
            return jsonify({"success": False, "message": "Failed to retrieve financial records"}), 500

        return jsonify({"success": True, "records": records_data['records']}), 200

    except Exception as e:
        logging.error(f"Error occurred in get_financial_records_route: {e}")
        logging.error(traceback.format_exc())  
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route('/api/psychological-assessments', methods=['GET'])
def get_psychological_assessments_route():
    assessments = get_psychological_assessments()
    if assessments is None:
        return jsonify({"success": False, "message": "Failed to retrieve psychological assessments"}), 500
    return jsonify({"success": True, "assessments": assessments}), 200

@app.route('/api/feedback', methods=['GET'])
def get_feedback_route():
    logging.info("GET /api/feedback called")
    feedback = get_feedback()
    
    if feedback is None:
        logging.error("Failed to retrieve feedback")
        return jsonify({
            "success": False,
            "message": "Failed to retrieve feedback",
            "feedbackHistory": []
        }), 500
        
    logging.info(f"Retrieved feedback: {feedback}")
    return jsonify(feedback), 200

@app.route('/api/clock-in-records', methods=['GET'])
def get_clock_in_records_route():
    records = get_clock_in_records()
    if records is None:
        return jsonify({"success": False, "message": "Failed to retrieve clock-in records"}), 500
    return jsonify({"success": True, "records": records}), 200

@app.route('/api/employees', methods=['GET'])
def get_employees_route():
    employees = get_employees()
    if employees is None:
        return jsonify({"success": False, "message": "Failed to retrieve employees"}), 500
    return jsonify({"success": True, "employees": employees}), 200

@app.route('/api/employee-time-analysis', methods=['GET'])
def get_employee_time_analysis_route():
    time_analysis = get_employee_time_analysis()
    if time_analysis is None:
        return jsonify({"success": False, "message": "Failed to retrieve employee time analysis"}), 500
    return jsonify({"success": True, "timeAnalysis": time_analysis}), 200

@app.route('/api/ai-secretary', methods=['POST'])
def ai_secretary_route():
    data = request.json
    result = process_ai_secretary(data.get('message'), data.get('userId'))
    if result is None:
        return jsonify({"success": False, "message": "Failed to process AI secretary request"}), 500
    return jsonify({"success": True, "reply": result}), 200

@app.route('/api/personal-savings', methods=['POST'])
def personal_savings_route():
    data = request.json
    result = process_personal_savings(data.get('message'), data.get('userId'))
    if result is None:
        return jsonify({"success": False, "message": "Failed to process personal savings request"}), 500
    return jsonify({"success": True, "reply": result.get('reply'), "savingsData": result.get('savingsData', {})}), 200

@app.route('/api/mental-health', methods=['POST'])
def mental_health_route():
    data = request.json
    result = process_mental_health(data.get('message'), data.get('employeeId'))
    if result is None:
        return jsonify({"success": False, "message": "Failed to process mental health request"}), 500
    return jsonify({"success": True, "reply": result.get('reply'), "mentalHealthStatus": result.get('mentalHealthStatus', {})}), 200

@app.route('/api/projects', methods=['POST'])
def create_project_route():
    data = request.json
    logging.info("POST /api/projects called")
    logging.info(f"Request data: {data}")
    
    result = create_project(data)
    logging.info(f"Create project result: {result}")
    
    if result is None:
        return jsonify({"success": False, "message": "Failed to create project"}), 500
    return jsonify({"success": True, "message": "Project created", "projectId": result}), 201

@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project_route(project_id):
    data = request.json
    result = update_project(data, project_id)
    if result is None:
        return jsonify({"success": False, "message": "Failed to update project"}), 500
    return jsonify({"success": True, "message": "Project updated"}), 200

@app.route('/api/teams', methods=['POST'])
def create_team_route():
    data = request.json
    logging.info("POST /api/teams called")
    logging.info(f"Request data: {data}")
    
    result = create_team(data)
    logging.info(f"Create team result: {result}")
    
    if result is None:
        return jsonify({"success": False, "message": "Failed to create team"}), 500
    return jsonify({"success": True, "message": "Team created", "teamId": result}), 201

@app.route('/api/teams/<team_id>', methods=['PUT'])
def update_team_route(team_id):
    data = request.json
    logging.info(f"PUT /api/teams/{team_id} called with data: {data}")
    
    result = update_team(team_id, data)
    if result is None:
        return jsonify({"success": False, "message": "Failed to update team"}), 500
    return jsonify({"success": True, "message": "Team updated"}), 200

@app.route('/api/financial-records', methods=['POST'])
def add_financial_record_route():
    data = request.json
    result = add_financial_record(data)
    if result is None:
        return jsonify({"success": False, "message": "Failed to add financial record"}), 500
    return jsonify({"success": True, "message": "Financial record added", "recordId": result}), 201

@app.route('/api/psychological-assessments', methods=['POST'])
def submit_psychological_assessment_route():
    data = request.json
    result = submit_psychological_assessment(data)
    if result is None:
        return jsonify({"success": False, "message": "Failed to submit psychological assessment"}), 500
    return jsonify({"success": True, "message": "Assessment submitted", "assessmentId": result}), 201

@app.route('/api/feedback', methods=['POST'])
def submit_feedback_route():
    try:
        data = request.json
        logging.info(f"Received feedback submission: {data}")
        
        result = submit_feedback(data)
        if result is None:
            logging.error("Failed to submit feedback")
            return jsonify({
                "success": False,
                "message": "Failed to submit feedback"
            }), 500
            
        logging.info(f"Feedback submission result: {result}")
        return jsonify(result), 201
        
    except Exception as e:
        logging.error(f"Error in submit_feedback_route: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

@app.route('/api/employees', methods=['POST'])
def add_employee_route():
    data = request.json
    result = add_employee(data)
    if result is None:
        return jsonify({"success": False, "message": "Failed to add employee"}), 500
    return jsonify({"success": True, "message": "Employee added", "employeeId": result}), 201

# @app.route('/api/time-tracking', methods=['GET'])
# def get_time_tracking_data_route():
#     result = get_time_tracking_data()
#     if result is None:
#         return jsonify({"success": False, "message": "Failed to retrieve time tracking data"}), 500
#     return jsonify({"success": True, "records": result}), 200

# @app.route('/api/time-tracking', methods=['POST'])
# def add_time_tracking_record_route():
#     data = request.json
#     result = add_time_tracking_record(data)
#     if result is None:
#         return jsonify({"success": False, "message": "Failed to add time tracking record"}), 500
#     return jsonify({"success": True, "message": "Time tracking record added", "recordId": result}), 201

@app.route('/api/clock-in', methods=['POST'])
def submit_clock_in_route():
    data = request.json
    result = submit_clock_in(data)
    if result is None:
        return jsonify({"success": False, "message": "Failed to submit clock-in record"}), 500
    return jsonify({"success": True, "message": "Clock-in record submitted", "recordId": result}), 201

if __name__ == '__main__':
    app.run(debug=True)
