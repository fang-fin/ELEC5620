// import React, { useState, useEffect } from 'react';

// function FeedbackMechanism() {
//   const [feedback, setFeedback] = useState('');
//   const [feedbackHistory, setFeedbackHistory] = useState([]);

//   useEffect(() => {
//     fetchFeedbackHistory();
//   }, []);

//   // const fetchFeedbackHistory = async () => {
//   //   try {
//   //     const response = await fetch('/api/feedback');
//   //     const data = await response.json();
//   //     setFeedbackHistory(data.feedbacks);
//   //   } catch (error) {
//   //     console.error('Error fetching feedback history:', error);
//   //   }
//   // };
//   const fetchFeedbackHistory = async () => {
//     try {
//       const response = await fetch('/api/feedbacks');
//       const data = await response.json();

//       if (Array.isArray(data.feedbacks)) {
//         setFeedbackHistory(data.feedbacks);
//       } else {
//         console.error('Feedbacks is not an array', data);
//         setFeedbackHistory([]);  
//       }
//     } catch (error) {
//       console.error('Error fetching feedbacks:', error);
//       setFeedbackHistory([]);  
//     }
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userId = localStorage.getItem('userId'); // 获取用户ID
//     try {
//       const response = await fetch('/api/feedback', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           content: feedback,
//           timestamp: new Date().toISOString(),
//           userId: userId 
//         }),
//       });
//       if (response.ok) {
//         alert('Feedback submitted successfully');
//         setFeedback('');
//         fetchFeedbackHistory();
//       } else {
//         alert('Failed to submit feedback');
//       }
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">Feedback Mechanism</h2>
      
//       {/* Feedback Input */}
//       <div className="mb-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Your Feedback
//             </label>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               className="w-full p-2 border rounded"
//               rows="4"
//               required
//             />
//           </div>
//           <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
//             Submit Feedback
//           </button>
//         </form>
//       </div>

//       {/* Feedback History */}
//       <div>
//         <h3 className="text-xl font-semibold mb-2">Feedback History</h3>
//         <ul className="space-y-2">
//           {feedbackHistory.map((item, index) => (
//             <li key={index} className="border-b pb-2">
//               <p className="text-gray-600 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
//               <p>{item.content}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default FeedbackMechanism;

import React, { useState, useEffect } from 'react';

function FeedbackMechanism() {
  const [feedback, setFeedback] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  // 获取反馈历史记录
  const fetchFeedbackHistory = async () => {
    try {
      const response = await fetch('/api/feedback'); // 使用正确的路径
      const data = await response.json();
  
      // 提取反馈历史记录
      if (data.feedback && Array.isArray(data.feedback.employees)) {  // 确保与后端返回的数据字段匹配
        setFeedbackHistory(data.feedback.employees); // 设置反馈历史记录
      } else {
        console.error('Employees is not an array', data);
        setFeedbackHistory([]);  
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbackHistory([]);  
    }
  };
  

  // 提交反馈
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    
    // add debug information before request
    console.log('Submitting feedback:', {
      content: feedback,
      userId: userId,
      timestamp: new Date().toISOString()
    });


    try {
      const response = await fetch('/api/feedback', { // 使用正确的路径
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: feedback,
          timestamp: new Date().toISOString(),
          userId: userId  // 传递用户ID
        }),
      });
      
      // add debug information after response
      console.log('Feedback submission response:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        alert('Feedback submitted successfully');
        setFeedback(''); // 清空反馈输入框
        fetchFeedbackHistory(); // 重新获取反馈历史记录
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Feedback Mechanism</h2>
      
      {/* 提交反馈 */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Submit Feedback
          </button>
        </form>
      </div>

      {/* 反馈历史记录 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Feedback History</h3>
        <ul className="space-y-2">
          {feedbackHistory.map((item, index) => (
            <li key={index} className="border-b pb-2">
              <p className="text-gray-600 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
              <p>{item.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FeedbackMechanism;

