
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatboxRef = useRef(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      gsap.from(chatboxRef.current, { opacity: 0, duration: 0.5, y: 20 });
    }
  }, [isOpen]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedChatbot');
    if (!hasVisited) {
      setShowOnboarding(true);
      const timer = setTimeout(() => {
        setShowOnboarding(false);
        localStorage.setItem('hasVisitedChatbot', 'true');
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowOnboarding(false); // Hide onboarding if user clicks
    localStorage.setItem('hasVisitedChatbot', 'true');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Simple bot response logic
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }, 500);
  };

  const getBotResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      return 'Hello there! How can I assist you?';
    } else if (lowerCaseInput.includes('ticket')) {
      return 'You can purchase tickets from the match details page.';
    } else if (lowerCaseInput.includes('match')) {
      return 'You can find the list of upcoming matches on the home page.';
    } else {
      return "I'm sorry, I don't understand. Can you please rephrase?";
    }
  };

  return (
    <div className="relative">
      {showOnboarding && (
        <div className="absolute bottom-20 right-8 bg-blue-500 text-white text-sm px-3 py-1 rounded-md shadow-lg animate-bounce-slow z-50">
          AI Assistant
        </div>
      )}
      <button
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 rounded-full shadow-lg z-50 p-2 ${showOnboarding ? 'animate-pulse' : ''}`}
      >
        <img src='/chatAI.png' alt='Chat AI' className="w-12 h-12"/>
      </button>
       
     
      {isOpen && (
        <div ref={chatboxRef} className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:text-gray-100">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-bold">Chat Support</h3>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100' : 'bg-blue-500 text-white'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex">
              <input 
                type="text" 
                value={inputValue} 
                onChange={handleInputChange} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow border rounded-l-lg p-2 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
              <button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
