# API Documentation

This document outlines the API endpoints used in the Arasaka Company Assistant application. Each endpoint is described with its purpose, request format, and expected response.

## General Notes

- All API endpoints use JSON for request and response bodies.
- All endpoints require authentication (implementation details to be determined).
- Base URL for all API calls: `https://api.arasaka-assistant.com/v1` (placeholder)

## Endpoints

### 1. AI Secretary

**Endpoint:** `/api/ai-secretary`

**Method:** POST

**Description:** Handles various management-related queries such as scheduling, task assignment, and meeting management.

**Request Body:**
json
{
"message": string,
"userId": string
}
**Response Body:**
json
{
"reply": string
}

**Notes:**
- The AI should understand context and provide relevant management advice or execute requested operations.
- Consider implementing features like calendar integration, task management systems, etc.

### 2. Personal Savings Assistant

**Endpoint:** `/api/personal-savings`

**Method:** POST

**Description:** Handles personal savings related queries such as current savings status, investment advice, and budget planning.

**Request Body:**
json
{
"message": string,
"userId": string
}
**Response Body:**
json
{
"reply": string,
"savingsData": object (optional)
}

**Notes:**
- The response should provide relevant financial advice.
- `savingsData` might include information about the user's savings or investment portfolio.
- Ensure proper security measures for handling sensitive financial data.

### 3. Mental Health Monitor

**Endpoint:** `/api/mental-health`

**Method:** POST

**Description:** Handles mental health related queries such as stress assessment, mood analysis, and mental health advice.

**Request Body:**
json
{
"message": string,
"employeeId": string
}
**Response Body:**
json
{
"reply": string,
"mentalHealthStatus": object (optional)
}


**Notes:**
- The response should provide supportive replies and possibly include an assessment of the user's current mental state.
- This API should be especially careful with data sensitivity and privacy protection.
- Consider implementing features like mood tracking, stress level assessment, and resources for mental health support.

### 4. Project Management

#### 4.1 Get All Projects

**Endpoint:** `/api/projects`

**Method:** GET

**Description:** Retrieves a list of all projects.

**Response Body:**
json
{
"projects": [
{
"id": string,
"name": string
}
]
}

#### 4.2 Get Project Details

**Endpoint:** `/api/projects/{projectId}`

**Method:** GET

**Description:** Retrieves details of a specific project.

**Response Body:**
json
{
"projectDetails": {
"id": string,
"name": string,
"description": string,
"deadline": string (ISO 8601 date format),
"employees": array of strings (employee IDs),
"totalEarning": number,
"totalDuration": number (in hours)
}
}

#### 4.3 Update Project

**Endpoint:** `/api/projects/{projectId}`

**Method:** PUT

**Description:** Updates details of a specific project.

**Request Body:**
json
{
"name": string,
"description": string,
"deadline": string (ISO 8601 date format),
"employees": array of strings (employee IDs)
}

**Response Body:**
json
{
"success": boolean,
"message": string
}

#### 4.4 Create New Project

**Endpoint:** `/api/projects`

**Method:** POST

**Description:** Creates a new project.

**Request Body:**
json
{
"name": string,
"description": string,
"deadline": string (ISO 8601 date format),
"employees": array of strings (employee IDs)
}
**Response Body:**
json
{
"success": boolean,
"message": string,
"projectId": string
}

### 5. Team Management

#### 5.1 Get All Teams

**Endpoint:** `/api/teams`

**Method:** GET

**Description:** Retrieves a list of all teams.

**Response Body:**
json
{
"teams": [
{
"id": string,
"name": string
}
]
}
#### 5.2 Get Team Details

**Endpoint:** `/api/teams/{teamId}`

**Method:** GET

**Description:** Retrieves details of a specific team.

**Response Body:**
json
{
"teamDetails": {
"id": string,
"name": string,
"description": string,
"employees": array of strings (employee IDs),
"totalEarning": number,
"totalDuration": number,
"teamEfficiency": number
}
}

**Notes:**
- `totalEarning` represents the total earnings for all projects the team has worked on.
- `totalDuration` represents the total time spent on all projects in hours.
- `teamEfficiency` is calculated as `totalEarning / totalDuration`, representing the team's earning per hour.
- Ensure that the calculation of `teamEfficiency` handles cases where `totalDuration` might be zero to avoid division by zero errors.
- Consider implementing a time frame for these calculations (e.g., last month, last quarter) for more relevant efficiency metrics.

#### 5.3 Update Team

**Endpoint:** `/api/teams/{teamId}`

**Method:** PUT

**Description:** Updates details of a specific team.

**Request Body:**
json
{
"name": string,
"description": string,
"employees": array of strings (employee IDs)
}
**Response Body:**
json
{
"success": boolean,
"message": string
}

#### 5.4 Create New Team

**Endpoint:** `/api/teams`

**Method:** POST

**Description:** Creates a new team.

**Request Body:**
json
{
"name": string,
"description": string,
"employees": array of strings (employee IDs)
}

**Response Body:**
json
{
"success": boolean,
"message": string,
"teamId": string
}

### 6. Financial Report

#### 6.1 Get Financial Records

**Endpoint:** `/api/financial-records`

**Method:** GET

**Description:** Retrieves a list of all financial records.

**Response Body:**
json
{
"records": [
{
"id": string,
"projectName": string,
"earning": number,
"cost": number,
"employeeName": string,
"timestamp": string (ISO 8601 date-time format)
}
]
}

#### 6.2 Add Financial Record

**Endpoint:** `/api/financial-records`

**Method:** POST

**Description:** Adds a new financial record.

**Request Body:**
json
{
"projectName": string,
"earning": number,
"cost": number,
"timestamp": string (ISO 8601 date-time format)
}

**Response Body:**
json
{
"success": boolean,
"message": string,
"recordId": string
}


### 7. Psychological Assessment

#### 7.1 Get Psychological Assessments

**Endpoint:** `/api/psychological-assessments`

**Method:** GET

**Description:** Retrieves a list of all psychological assessments for the authenticated employee.

**Response Body:**
json
{
"assessments": [
{
"id": string,
"assessment": string,
"timestamp": string (ISO 8601 date-time format)
}
]
}

#### 7.2 Submit Psychological Assessment

**Endpoint:** `/api/psychological-assessments`

**Method:** POST

**Description:** Submits a new psychological assessment.

**Request Body:**

json
{
"assessment": string,
"timestamp": string (ISO 8601 date-time format)
}
**Response Body:**
json
{
"success": boolean,
"message": string,
"assessmentId": string
}

### 8. Feedback Mechanism

#### 8.1 Get Feedback History

**Endpoint:** `/api/feedback`

**Method:** GET

**Description:** Retrieves a list of all feedback submissions.

**Response Body:**
json
{
"feedbackHistory": [
{
"id": string,
"employeeName": string,
"content": string,
"timestamp": string (ISO 8601 date-time format)
}
]
}

#### 8.2 Submit Feedback

**Endpoint:** `/api/feedback`

**Method:** POST

**Description:** Submits a new feedback.

**Request Body:**
json
{
"content": string,
"timestamp": string (ISO 8601 date-time format)
}

**Response Body:**
json
{
"success": boolean,
"message": string,
"feedbackId": string
}

### 9. Clock-In System

#### 9.1 Get Clock-In Records

**Endpoint:** `/api/clock-in-records`

**Method:** GET

**Description:** Retrieves a list of all clock-in records for the authenticated user.

**Response Body:**
json
{
"records": [
{
"id": string,
"projectName": string,
"startTime": string,
"endTime": string,
"duration": number
}
]
}

### 10. Employee Management

#### 10.1 Get All Employees

**Endpoint:** `/api/employees`

**Method:** GET

**Description:** Retrieves a list of all employees with their work statistics.

**Response Body:**
json
{
"employees": [
{
"id": string,
"name": string,
"totalWorkDuration": number,
"numberOfProjects": number
}
]
}

#### 10.2 Add New Employee

**Endpoint:** `/api/employees`

**Method:** POST

**Description:** Adds a new employee to the system.

**Request Body:**
json
{
"name": string,
"age": number,
"gender": string
}

**Response Body:**
json
{
"success": boolean,
"message": string,
"employeeId": string
}

**Notes:**
- The `totalWorkDuration` should be calculated from the employee's clock-in records.
- The `numberOfProjects` should be derived from the projects the employee is associated with.
- Consider implementing additional endpoints for updating and deleting employee records.
- Ensure proper access control to restrict who can add or view employee information.
- The `gender` field is collected during employee creation but not displayed in the list view to maintain privacy.
### 11. Advice Box

#### 11.1 Get All Feedback (for Advice Box)

**Endpoint:** `/api/feedback`

**Method:** GET

**Description:** Retrieves a list of all feedback submissions for display in the Advice Box.

**Response Body:**
json
{
"feedbackHistory": [
{
"id": string,
"employeeName": string,
"content": string,
"timestamp": string (ISO 8601 date-time format)
}
]
}


**Notes:**
- This endpoint is the same as the one used for getting feedback history, but it's listed here to emphasize its use in the Advice Box context.
- Consider implementing pagination if the number of feedback entries becomes large.
- Ensure that sensitive information is properly handled and that only authorized personnel can access this data.

### 12. Time Analysis

#### 12.1 Get Employee Time Analysis Data

**Endpoint:** `/api/employee-time-analysis`

**Method:** GET

**Description:** Retrieves a list of all employees with their weekly and monthly working hours.

**Response Body:**
json
{
"employees": [
{
"id": string,
"name": string,
"weeklyHours": number,
"monthlyHours": number
}
]
}

**Notes:**
- The `weeklyHours` should represent the total working hours for the most recent 7-day period.
- The `monthlyHours` should represent the total working hours for the most recent 30-day period.
- Ensure that the calculation of working hours is based on the clock-in and clock-out records.
- Consider implementing pagination if the number of employees is large.
- This endpoint should be restricted to users with appropriate permissions (e.g., managers, HR personnel).

### 13. User Authentication

#### 13.1 User Login

**Endpoint:** `/api/login`

**Method:** POST

**Description:** Authenticates a user and returns their role.

**Request Body:**
json
{
"username": string,
"password": string
}
**Response Body:**
json
{
"success": boolean,
"message": string,
"role": string
}
**Notes:**
- The username comparison should be case-insensitive. Convert the input username to lowercase before comparing with the database.
- Implement proper password hashing and salting on the backend for security.
- The `role` field in the response should be one of: "manager", "hr", or "employee".
- Generate a secure JWT (JSON Web Token) or similar token for authenticated sessions.
- Store user roles and permissions in the database to determine access levels.
- Implement token expiration and refresh mechanisms for enhanced security.
- Consider implementing multi-factor authentication for sensitive roles (e.g., managers and HR).
- Log failed login attempts and implement account lockout after multiple failed attempts to prevent brute-force attacks.
- Ensure all subsequent API requests include the authentication token in the header for user verification.
- Implement proper error handling to avoid leaking sensitive information in error messages.

### 14. Time Tracking

#### 14.1 Get Time Tracking Data

**Endpoint:** `/api/time-tracking`

**Method:** GET

**Description:** Retrieves a list of all time tracking records for the authenticated user.

**Response Body:**
json
{
"records": [
{
"id": string,
"projectName": string,
"startTime": string,
"endTime": string,
"duration": number
}
]
}

#### 14.2 Add Time Tracking Record

**Endpoint:** `/api/time-tracking`

**Method:** POST

**Description:** Adds a new time tracking record.

**Request Body:**
json
{
"projectName": string,
"startTime": string,
"endTime": string,
"duration": number
}

**Response Body:**
json
{
"success": boolean,
"message": string,
"recordId": string
}

## Security Considerations

1. All API endpoints should use HTTPS.
2. Implement proper authentication and authorization mechanisms.
3. Sanitize and validate all input data.
4. Be cautious with error messages to avoid leaking sensitive information.
5. Implement rate limiting to prevent abuse.
6. Regularly audit and update the API for security vulnerabilities.

## Data Privacy

1. Ensure compliance with relevant data protection regulations (e.g., GDPR, CCPA).
2. Implement data encryption both in transit and at rest.
3. Provide users with options to view, edit, and delete their data.
4. Implement proper data retention and deletion policies.

## Version Control

This API is versioned. The current version is v1. When making changes, consider backwards compatibility or create a new version if breaking changes are necessary.


