import React, { useState } from 'react';
import '../css/Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Chào bạn! Tôi có thể giúp gì?' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Chatbot đang quá tải. Vui lòng thử lại sau!' },
        ]);
        return;
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Xin lỗi, tôi không thể trả lời ngay bây giờ.' }]);
    }

    setInput('');
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Đóng Chat' : 'Nhắn Tin'}
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">Chatbot - Hỗ trợ</div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>
                  <strong>{msg.sender === 'bot' ? 'Bot' : 'Bạn'}:</strong> {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
