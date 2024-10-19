import React, { useState, useEffect } from 'react';

function EmployeeManagement() {
  const [employeeName, setEmployeeName] = useState('');
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
        body: JSON.stringify({ name: employeeName }),
      });
      if (response.ok) {
        alert('Employee added successfully');
        setEmployeeName('');
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
              <th className="border p-2">Total Work Duration (hours)</th>
              <th className="border p-2">Number of Projects</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
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
