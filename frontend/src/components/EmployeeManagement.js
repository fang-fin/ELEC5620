import React, { useState, useEffect } from 'react';

function EmployeeManagement() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeAge, setEmployeeAge] = useState('');
  const [employeeGender, setEmployeeGender] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');  // 新增：员工角色
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: employeeName,
          age: parseInt(employeeAge),
          gender: employeeGender,
          role: employeeRole  // 新增：包含员工角色
        }),
      });
      if (response.ok) {
        alert('Employee added successfully');
        setEmployeeName('');
        setEmployeeAge('');
        setEmployeeGender('');
        setEmployeeRole('');  // 重置角色选择
        fetchEmployees();
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
      
      {/* Employee Input */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Age
            </label>
            <input
              type="number"
              value={employeeAge}
              onChange={(e) => setEmployeeAge(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Gender
            </label>
            <select
              value={employeeGender}
              onChange={(e) => setEmployeeGender(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Role
            </label>
            <select
              value={employeeRole}
              onChange={(e) => setEmployeeRole(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Add Employee
          </button>
        </form>
      </div>

      {/* Employee List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Employee List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Total Work Duration (hours)</th>
              <th className="border p-2">Number of Projects</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.age}</td>
                <td className="border p-2">{employee.gender}</td>
                <td className="border p-2">{employee.role}</td>
                <td className="border p-2">{employee.totalWorkDuration}</td>
                <td className="border p-2">{employee.numberOfProjects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeManagement;
