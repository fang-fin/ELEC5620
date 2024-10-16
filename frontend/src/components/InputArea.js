import React, { useState } from 'react';

function InputArea() {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里应该有发送消息的逻辑
    console.log("Sending message:", input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Type your message..."
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </div>
    </form>
  );
}

export default InputArea;
