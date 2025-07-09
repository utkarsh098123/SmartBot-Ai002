import React, { useState, useRef, useEffect } from 'react';
import '../styles/Homepage.css';

import bot1 from '../assets/bot1.jpg';
import bot2 from '../assets/bot2.jpg';
import bot3 from '../assets/bot3.jpg';
import bot4 from '../assets/bot4.jpg';

const assistants = [
  { name: 'Tech-Buddy', image: bot1, intro: "Hi! I'm Tech-Buddy, your coding assistant." },
  { name: 'Code-Mate', image: bot2, intro: "Hello! Code-Mate here to help you write better code." },
  { name: 'Project-Pal', image: bot3, intro: "Hey there! Project-Pal at your service for all project queries." },
  { name: 'Study-Buddy', image: bot4, intro: "Hi! Study-Buddy will help you with study tips and explanations." },
];

const TechTutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { from: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');

    if (selectedBot?.name === "Project-Pal") {
      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        const data = await response.json();

        setMessages((prev) => [...prev, { from: 'bot', text: data.reply }]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [...prev, { from: 'bot', text: "Oops! Couldn't reach the Project-Pal server." }]);
      }
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'bot', text: `This is a response from ${selectedBot?.name}.` }]);
      }, 500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: `📁 Uploaded: ${file.name}` },
        { from: 'bot', text: 'File received! I will process it soon.' }
      ]);
    }
  };

  const chooseBot = (bot) => {
    setSelectedBot(bot);
    setMessages([{ from: 'bot', text: bot.intro }]);
    document.body.style.overflow = 'hidden';
  };

  const resetBot = () => {
    setSelectedBot(null);
    setMessages([]);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="tech-tutor-root">
      {!selectedBot && (
        <div className="smartbot-wrapper">
          <h1 className="main-title">SmartBot<span className="dot-ai">.ai</span></h1>
          <p className="subtitle">(Your smart coding assistant for quick help & inspiration)</p>
          <div className="assistant-list">
            {assistants.map((assistant, index) => (
              <div key={index} className="assistant-card" onClick={() => chooseBot(assistant)}>
                <img src={assistant.image} alt={assistant.name} />
                <p>{assistant.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedBot && (
        <div className="chat-full-wrapper smartbot-wrapper">
          <div className="chat-section">
            <div className="chat-header">
              <button className="model-btn" onClick={resetBot}>Switch Assistant</button>
            </div>

            <div className="chat-box scrollable-box">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.from}`}>
                  <div className={`chat-bubble ${msg.from}`}>{msg.text}</div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder={`Ask ${selectedBot.name} anything :)`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <>
                <label htmlFor="file-upload" className="file-upload-label">📁 Upload</label>
                <input id="file-upload" type="file" onChange={handleFileUpload} />
              </>
              <button className="send-btn" onClick={sendMessage}>➔</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTutor;
