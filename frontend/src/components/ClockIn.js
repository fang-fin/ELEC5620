import React, { useState, useEffect } from 'react';

function ClockIn() {
  const [projectName, setProjectName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clockInRecords, setClockInRecords] = useState([]);

  useEffect(() => {
    fetchClockInRecords();
  }, []);

  // const fetchClockInRecords = async () => {
  //   try {
  //     const response = await fetch('/api/clock-in-records');
  //     const data = await response.json();
  //     setClockInRecords(data.records);
  //   } catch (error) {
  //     console.error('Error fetching clock-in records:', error);
  //   }
  // };
  const fetchClockInRecords = async () => {
    try {
      const response = await fetch('/api/clock-in-records');
      const data = await response.json();
  
      console.log('Fetched data:', data);
      console.log('data.records:', data.records);
  
      if (data.success && data.records && Array.isArray(data.records.records)) {
        setClockInRecords(data.records.records);  
        console.log('clockInRecords successfully set:', data.records.records);
      } else {
        console.error('clockInRecords is not an array or request failed', data);
        setClockInRecords([]);  
      }
    } catch (error) {
      console.error('Error fetching clock-in records:', error);
      setClockInRecords([]);  
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / 1000 / 60; // Duration in minutes

    if (duration < 0) {
      alert('End time must be after start time');
      return;
    }

    try {
      const response = await fetch('/api/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          duration,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });
      if (response.ok) {
        alert('Clock-in record submitted successfully');
        setProjectName('');
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
              Start Time
            </label>
            <input
              type="datetime-local"
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
              type="datetime-local"
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
              <th className="border p-2">Duration (minutes)</th>
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
