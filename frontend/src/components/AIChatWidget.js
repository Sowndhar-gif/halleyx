import React, { useState, useRef, useEffect, useCallback } from 'react';

const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', fromUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null); // recognition state
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Memoize addMessage
  const addMessage = useCallback((text, fromUser = true) => {
    setMessages(prev => [...prev, { text, fromUser }]);
  }, []); // setMessages is guaranteed to be stable

  // Memoize handleBotResponse, moving botResponse logic inside
  const handleBotResponse = useCallback((userText) => {
    // Simple bot response logic - moved inside useCallback
    const botResponseLogic = (message) => {
      const msg = message.toLowerCase();
      if (msg.includes('hello') || msg.includes('hi')) {
        return 'Hello! How can I assist you today?';
      }
      if (msg.includes('product')) {
        return 'You can browse products in the Customer Portal under "Browse Products".';
      }
      if (msg.includes('order')) {
        return 'You can place orders by adding products to your cart and checking out.';
      }
      if (msg.includes('help')) {
        return 'I am here to help! Ask me about products, orders, or your account.';
      }
      return "Sorry, I didn't understand that. Please try asking something else.";
    };

    setTimeout(() => {
      const reply = botResponseLogic(userText);
      addMessage(reply, false);
    }, 500);
  }, [addMessage]); // addMessage is a dependency, as it's used inside

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, true);
        handleBotResponse(transcript); // This is where the dependency is needed
        setIsListening(false);
      };

      recognitionInstance.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = function() {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    // Cleanup function for useEffect
    // This runs when the component unmounts or before the effect re-runs if dependencies change
    return () => {
      if (recognition) { // 'recognition' is now a dependency
        recognition.stop();
        // Remove event listeners to prevent memory leaks and ensure clean shutdown
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
      }
    };
  }, [addMessage, handleBotResponse, recognition]); // Added recognition to dependency array

  const handleSend = () => {
    const userText = inputText.trim();
    if (!userText) return;

    addMessage(userText, true);
    setInputText('');
    handleBotResponse(userText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!isSupported || !recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--primary)',
          color: '#000',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 10001,
          boxShadow: '0 0 15px var(--primary-glow)'
        }}
        title="Toggle Chat"
      >
        💬
      </button>

      {/* Voice Assist Button */}
      {isSupported && isVisible && (
        <button
          onClick={toggleListening}
          title={isListening ? 'Stop Voice Command' : 'Voice Command'}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? 'var(--secondary)' : 'var(--primary)',
            color: '#000',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10001,
            boxShadow: isListening
              ? '0 0 20px var(--secondary-glow)'
              : '0 0 15px var(--primary-glow)',
            transition: 'all 0.3s ease'
          }}
        >
          {isListening ? '🔴' : '🎤'}
        </button>
      )}

      {/* Chat Widget */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '140px',
            right: '20px',
            width: '300px',
            height: '400px',
            background: 'rgba(13,17,23,0.95)',
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            boxShadow: '0 0 15px var(--primary-glow)',
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px',
              background: 'var(--primary)',
              color: '#000',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '10px 10px 0 0'
            }}
          >
          Sowndhar's E-market
          </div>

          {/* Messages */}
          <div
            style={{
              flexGrow: 1,
              padding: '10px',
              overflowY: 'auto',
              fontSize: '0.9rem',
              maxHeight: '300px'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  background: message.fromUser ? 'var(--secondary)' : 'var(--primary)',
                  color: '#000',
                  alignSelf: message.fromUser ? 'flex-end' : 'flex-start',
                  marginLeft: message.fromUser ? 'auto' : '0',
                  marginRight: message.fromUser ? '0' : 'auto'
                }}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid var(--primary)'
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flexGrow: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--primary)',
                background: 'var(--input-bg)',
                color: 'var(--text-main)'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;