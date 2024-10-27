import React, { useState, useEffect } from 'react';

function ClockIn() {
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clockInRecords, setClockInRecords] = useState([]);
  const userId = localStorage.getItem('userId'); // 从 localStorage 获取 userId

  useEffect(() => {
    fetchClockInRecords();
  }, []);

  const fetchClockInRecords = async () => {
    try {
      const response = await fetch('/api/clock-in-records');
      const data = await response.json();

      if (data.success && data.records && Array.isArray(data.records.records)) {
        setClockInRecords(data.records.records);  
      } else {
        setClockInRecords([]);  
      }
    } catch (error) {
      console.error('Error fetching clock-in records:', error);
      setClockInRecords([]);  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(`${date}T${startTime}`); // 组合日期和时间
    const end = new Date(`${date}T${endTime}`);     // 组合日期和时间
    const duration = (end - start) / 1000 / 60; // Duration in minutes

    if (duration < 0) {
      alert('End time must be after start time');
      return;
    }

    // add debug information before request
    console.log('Submitting clock-in record:', {
      projectName,
      duration,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    });

    try {
      const response = await fetch('/api/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          startTime: start.toISOString(), 
          endTime: end.toISOString(),    
          userId,
        }),
      });
      
      // add debug information after response
      console.log('Clock-in submission response:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        alert('Clock-in record submitted successfully');
        setProjectName('');
        setDate('');
        setStartTime('');
        setEndTime('');
        fetchClockInRecords();
      } else {
        alert('Failed to submit clock-in record');
      }
    } catch (error) {
      console.error('Error submitting clock-in record:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Clock-In</h2>
      
      {/* Clock-In Input */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time 
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time 
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Submit Clock-In Record
          </button>
        </form>
      </div>
      
      {/* Clock-In Records */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Clock-In Records</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Project Name</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
              <th className="border p-2">Duration (hours)</th>
            </tr>
          </thead>
          <tbody>
            {clockInRecords.map((record, index) => (
              <tr key={index}>
                <td className="border p-2">{record.projectName}</td>
                <td className="border p-2">{new Date(record.startTime).toLocaleString()}</td>
                <td className="border p-2">{new Date(record.endTime).toLocaleString()}</td>
                <td className="border p-2">{record.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClockIn;
