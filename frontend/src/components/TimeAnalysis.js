import React, { useState, useEffect } from 'react';

function TimeAnalysis() {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    fetchEmployeeTimeData();
  }, []);

  const fetchEmployeeTimeData = async () => {
    try {
      const response = await fetch('/api/employee-time-analysis');
      const data = await response.json();
      setEmployeeData(data.employees);
    } catch (error) {
      console.error('Error fetching employee time data:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Time Analysis</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Weekly Working Hours</th>
              <th className="border p-2">Monthly Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.weeklyHours}</td>
                <td className="border p-2">{employee.monthlyHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimeAnalysis;
