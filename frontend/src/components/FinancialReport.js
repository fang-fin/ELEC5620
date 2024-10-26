import React, { useState, useEffect } from 'react';

function FinancialReport() {
  const [projectName, setProjectName] = useState('');
  const [earning, setEarning] = useState('');
  const [cost, setCost] = useState('');
  const [financialRecords, setFinancialRecords] = useState([]);

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  // const fetchFinancialRecords = async () => {
  //   try {
  //     const response = await fetch('/api/financial-records');
  //     const data = await response.json();
  //     setFinancialRecords(data.records);
  //   } catch (error) {
  //     console.error('Error fetching financial records:', error);
  //   }
  // };
  const fetchFinancialRecords = async () => {
    try {
      const response = await fetch('/api/financial-records');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.records) {
        setFinancialRecords(data.records);
      } else {
        console.error('No records found in the response');
      }
    } catch (error) {
      console.error('Error fetching financial records:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/financial-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          earning: parseFloat(earning),
          cost: parseFloat(cost),
          timestamp: new Date().toISOString() // 添加当前时间戳
        }),
      });
      if (response.ok) {
        alert('Financial record added successfully');
        setProjectName('');
        setEarning('');
        setCost('');
        fetchFinancialRecords();
      } else {
        alert('Failed to add financial record');
      }
    } catch (error) {
      console.error('Error adding financial record:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Financial Report</h2>
      
      {/* Reports Input */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New Report</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={earning}
            onChange={(e) => setEarning(e.target.value)}
            placeholder="Earning"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Add Record
          </button>
        </form>
      </div>

      {/* Financial Records Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Financial Records</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Project Name</th>
              <th className="border p-2">Earning</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Employee Name</th>
              <th className="border p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {financialRecords.map((record, index) => (
              <tr key={index}>
                <td className="border p-2">{record.projectName}</td>
                <td className="border p-2">${record.earning.toFixed(2)}</td>
                <td className="border p-2">${record.cost.toFixed(2)}</td>
                <td className="border p-2">{record.employeeName}</td>
                <td className="border p-2">{new Date(record.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinancialReport;
