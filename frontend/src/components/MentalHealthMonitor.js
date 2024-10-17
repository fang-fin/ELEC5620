import React from 'react';
import GenericChatInterface from './GenericChatInterface';

function MentalHealthMonitor() {
  const handleSendMessage = async (message) => {
    // API 实现指南：
    // 端点：/api/mental-health
    // 方法：POST
    // 请求体：{ message: string, employeeId: string }
    // 预期响应：{ reply: string, mentalHealthStatus?: object }
    // 
    // 该 API 应处理心理健康相关的查询，如压力评估、情绪分析、心理健康建议等。
    // 响应应该提供支持性的回复，可能还包括对用户当前心理状态的评估结果。
    // 注意：这个 API 应该特别注意数据的敏感性和隐私保护。
    const employeeId = "emp456"; // 在实际应用中，这应该从用户会话或状态中获取
    const response = await fetch('/api/mental-health', {
      method: 'POST',
      body: JSON.stringify({ message, employeeId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.reply;
  };

  return <GenericChatInterface 
    title="Mental Health Monitor" 
    onSendMessage={handleSendMessage}
  />;
}

export default MentalHealthMonitor;
