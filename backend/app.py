from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# Mock data
projects = [
    {"id": "1", "name": "Project A", "description": "Description for Project A", "deadline": "2023-12-31", "employees": ["1", "2"], "totalEarning": 10000, "totalDuration": 100},
    {"id": "2", "name": "Project B", "description": "Description for Project B", "deadline": "2023-11-30", "employees": ["2", "3"], "totalEarning": 15000, "totalDuration": 150},
]

teams = [
    {"id": "1", "name": "Team X", "description": "Description for Team X", "employees": ["1", "2"], "totalEarning": 25000, "totalDuration": 250, "teamEfficiency": 100},
    {"id": "2", "name": "Team Y", "description": "Description for Team Y", "employees": ["3", "4"], "totalEarning": 30000, "totalDuration": 300, "teamEfficiency": 100},
]

employees = [
    {"id": "1", "name": "John Doe", "totalWorkDuration": 500, "numberOfProjects": 2},
    {"id": "2", "name": "Jane Smith", "totalWorkDuration": 450, "numberOfProjects": 3},
]

financial_records = [
    {"id": "1", "projectName": "Project A", "earning": 5000, "cost": 3000, "employeeName": "John Doe", "timestamp": "2023-05-01T10:00:00Z"},
    {"id": "2", "projectName": "Project B", "earning": 7000, "cost": 4000, "employeeName": "Jane Smith", "timestamp": "2023-05-02T11:00:00Z"},
]

psychological_assessments = [
    {"id": "1", "assessment": "Assessment for John Doe", "timestamp": "2023-05-01T09:00:00Z"},
    {"id": "2", "assessment": "Assessment for Jane Smith", "timestamp": "2023-05-02T10:00:00Z"},
]

feedback_history = [
    {"id": "1", "employeeName": "John Doe", "content": "Great work environment", "timestamp": "2023-05-01T14:00:00Z"},
    {"id": "2", "employeeName": "Jane Smith", "content": "Excellent team collaboration", "timestamp": "2023-05-02T15:00:00Z"},
]

clock_in_records = [
    {"id": "1", "projectName": "Project A", "startTime": "2023-05-01T09:00:00Z", "endTime": "2023-05-01T17:00:00Z", "duration": 8},
    {"id": "2", "projectName": "Project B", "startTime": "2023-05-02T08:30:00Z", "endTime": "2023-05-02T16:30:00Z", "duration": 8},
]

# Routes

@app.route('/api/login', methods=['POST'])
def login():
    # Mock login functionality
    data = request.json
    username = data.get('username', '').lower()
    password = data.get('password', '')
    
    # Test login: print received username and password
    print(f"#test login - Received username: {username}, password: {password}")  # Added for debugging
    
    # In a real application, you would verify the credentials against a database
    if username == 'manager' and password == 'password':
        role = 'manager'
    elif username == 'hr' and password == 'password':
        role = 'hr'
    elif username == 'employee' and password == 'password':
        role = 'employee'
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({"success": True, "message": "Login successful", "role": role, "token": "mock_token_12345"})

@app.route('/api/projects', methods=['GET'])
def get_projects():
    # Return mock projects data
    return jsonify({"projects": projects})

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project_details(project_id):
    # Find the project with the given ID
    project = next((p for p in projects if p['id'] == project_id), None)
    if project:
        return jsonify({"projectDetails": project})
    return jsonify({"error": "Project not found"}), 404

@app.route('/api/teams', methods=['GET'])
def get_teams():
    # Return mock teams data
    return jsonify({"teams": teams})

@app.route('/api/teams/<team_id>', methods=['GET'])
def get_team_details(team_id):
    # Find the team with the given ID
    team = next((t for t in teams if t['id'] == team_id), None)
    if team:
        return jsonify({"teamDetails": team})
    return jsonify({"error": "Team not found"}), 404

@app.route('/api/financial-records', methods=['GET'])
def get_financial_records():
    # Return mock financial records
    return jsonify({"records": financial_records})

@app.route('/api/psychological-assessments', methods=['GET'])
def get_psychological_assessments():
    # Return mock psychological assessments
    return jsonify({"assessments": psychological_assessments})

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    # Return mock feedback history
    return jsonify({"feedbackHistory": feedback_history})

@app.route('/api/clock-in-records', methods=['GET'])
def get_clock_in_records():
    # Return mock clock-in records
    return jsonify({"records": clock_in_records})

@app.route('/api/employees', methods=['GET'])
def get_employees():
    # Return mock employees data
    return jsonify({"employees": employees})

@app.route('/api/employee-time-analysis', methods=['GET'])
def get_employee_time_analysis():
    # Generate mock time analysis data
    time_analysis = [
        {
            "id": emp["id"],
            "name": emp["name"],
            "weeklyHours": random.randint(30, 50),
            "monthlyHours": random.randint(120, 200)
        }
        for emp in employees
    ]
    return jsonify({"employees": time_analysis})

if __name__ == '__main__':
    app.run(debug=True)
