import React, { useState, useEffect } from 'react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

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
        // You can integrate this with the chat widget
        console.log('Voice input:', transcript);
        // Here you could trigger the chat widget with the transcript
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
  }, []);

  const toggleListening = () => {
    if (!isSupported || !recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <button
      onClick={toggleListening}
      title={isListening ? 'Stop Voice Command' : 'Voice Command'}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '100px',
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
  );
};

export default VoiceAssistant; 