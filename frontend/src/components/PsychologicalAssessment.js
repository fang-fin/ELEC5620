import React, { useState, useEffect } from 'react';

function PsychologicalAssessment() {
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [question3, setQuestion3] = useState('');
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/psychological-assessments');
      const data = await response.json();
  
      if (data.assessments && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
      } else if (data.assessments && Array.isArray(data.assessments.assessments)) {
        setAssessments(data.assessments.assessments); // 处理多层嵌套
      } else {
        setAssessments([]);
        console.error('Assessments is not an array or in unexpected format', data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setAssessments([]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedText = `Q1: ${question1}\nQ2: ${question2}\nQ3: ${question3}`;
    const userId = localStorage.getItem('userId'); 
    try {
      const response = await fetch('/api/psychological-assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessment: combinedText,
          timestamp: new Date().toISOString(),
          userId: userId 
        }),
      });
      if (response.ok) {
        alert('Assessment submitted successfully');
        setQuestion1('');
        setQuestion2('');
        setQuestion3('');
        fetchAssessments();
      } else {
        alert('Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Psychological Self-Assessment</h2>
      
      {/* Assessment Input */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">New Assessment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question 1: You are walking in the desert and you see a tortoise lying on its back, struggling to turn over. What do you do?
            </label>
            <textarea
              value={question1}
              onChange={(e) => setQuestion1(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question 2: If your family needed your help, what would you do?
            </label>
            <textarea
              value={question2}
              onChange={(e) => setQuestion2(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question 3: When you see someone in pain, how do you react?
            </label>
            <textarea
              value={question3}
              onChange={(e) => setQuestion3(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Submit Assessment
          </button>
        </form>
      </div>

      {/* Assessment History */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Assessment History</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Assessment</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr key={index}>
                <td className="border p-2">{new Date(assessment.timestamp).toLocaleString()}</td>
                <td className="border p-2">{assessment.assessment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PsychologicalAssessment;
