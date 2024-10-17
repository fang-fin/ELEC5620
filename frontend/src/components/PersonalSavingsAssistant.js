import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function PersonalSavingsAssistant() {
  const handleSendMessage = async (message) => {
    // API 实现指南：
    // 端点：/api/personal-savings
    // 方法：POST
    // 请求体：{ message: string, userId: string }
    // 预期响应：{ reply: string, savingsData?: object }
    // 
    // 该 API 应处理个人储蓄相关的查询，如当前储蓄状况、投资建议、预算规划等。
    // 响应应该提供相关的财务建议，可能还包括用户的储蓄数据或投资组合信息。
    const userId = "user123"; // 在实际应用中，这应该从用户会话或状态中获取
    const response = await fetch('/api/personal-savings', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  return <GenericChatInterface 
    title="Personal Savings Assistant" 
    onSendMessage={handleSendMessage}
  />;
}

export default PersonalSavingsAssistant;
