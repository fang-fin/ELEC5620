import React, { useState, useEffect } from 'react';

function AdviceBox() {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      console.log('Fetching feedback data...');
      const response = await fetch('/api/feedback');
      console.log('Raw response:', response);
      
      const data = await response.json();
      console.log('Parsed feedback data:', data);
      
      if (data.error) {
        console.error('Error from server:', data.error);
        alert('Error fetching feedback: ' + data.error);
      } else if (data.feedbackHistory) {
        console.log('Setting feedback list:', data.feedbackHistory);
        setFeedbackList(data.feedbackHistory);
      } else {
        console.warn('Unexpected data format:', data);
        setFeedbackList([]);
      }
    } catch (error) {
      console.error('Error in fetchFeedback:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Advice Box</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.length > 0 ? (
              feedbackList.map((feedback) => (
                <tr key={feedback.id}>
                  <td className="border p-2">{feedback.id}</td>
                  <td className="border p-2">{feedback.employeeName}</td>
                  <td className="border p-2">{feedback.content}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center">
                  No feedback records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdviceBox;
