import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function AISecretary() {
  const handleSendMessage = async (message) => {
    // API 实现指南：
    // 端点：/api/ai-secretary
    // 方法：POST
    // 请求体：{ message: string }
    // 预期响应：{ reply: string }
    // 
    // 该 API 应处理各种管理相关查询，如日程安排、任务分配、会议管理等。
    // 响应应该模拟一个智能助理，能够理解上下文并提供相关的管理建议或执行请求的操作。
    const response = await fetch('/api/ai-secretary', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  const extraUI = (
    <div className="p-4 bg-gray-100">
      {/* 可以在这里添加额外的 UI 元素，如快速操作按钮或常用命令提示 */}
    </div>
  );

  return <GenericChatInterface 
    title="AI Secretary" 
    onSendMessage={handleSendMessage}
    extraUI={extraUI}
  />;
}

export default AISecretary;
