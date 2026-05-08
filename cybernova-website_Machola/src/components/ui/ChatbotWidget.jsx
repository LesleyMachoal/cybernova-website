import React, { useState, useRef, useEffect } from 'react';
import { findResponse } from '@/utils/chatbotKnowledge';
import './ChatbotWidget.css';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! 👋 Welcome to CyberNova Analytics. How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = findResponse(inputValue);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickReply = (question) => {
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const botResponse = findResponse(question);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Chat Widget */}
      <div className={`chatbot-widget ${isOpen ? 'open' : 'closed'}`}>
        {/* Chat Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <h3>CyberNova Support 🛡️</h3>
            <p>AI Assistant</p>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                {msg.text.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < msg.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="quick-replies">
            <button onClick={() => handleQuickReply('What services do you offer?')}>
              Our Services
            </button>
            <button onClick={() => handleQuickReply('Tell me about your pricing')}>
              Pricing
            </button>
            <button onClick={() => handleQuickReply('How can I contact you?')}>
              Contact Info
            </button>
            <button onClick={() => handleQuickReply('Tell me about your projects')}>
              Projects
            </button>
          </div>
        )}

        {/* Chat Input */}
        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={isTyping}
            className="chat-input"
          />
          <button type="submit" disabled={isTyping || inputValue.trim() === ''} className="send-btn">
            ➤
          </button>
        </form>
      </div>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open chat"
        >
          💬
        </button>
      )}
    </>
  );
}
