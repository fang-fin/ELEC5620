import React, { useState, useEffect } from 'react';

function AdviceBox() {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        alert('Error fetching feedback: ' + data.error);
      } else {
        setFeedbackList(data.feedbackHistory || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
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
            {feedbackList.map((feedback) => (
              <tr key={feedback.id}>
                <td className="border p-2">{feedback.id}</td>
                <td className="border p-2">{feedback.employeeName}</td>
                <td className="border p-2">{feedback.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdviceBox;
