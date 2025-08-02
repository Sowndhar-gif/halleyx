// Simple AI Chat Widget and Voice Assistant Integration

// Create chat widget UI
const chatWidget = document.createElement('div');
chatWidget.id = 'aiChatWidget';
chatWidget.style.position = 'fixed';
chatWidget.style.bottom = '20px';
chatWidget.style.right = '20px';
chatWidget.style.width = '300px';
chatWidget.style.height = '400px';
chatWidget.style.background = 'rgba(13,17,23,0.95)';
chatWidget.style.border = '2px solid var(--primary)';
chatWidget.style.borderRadius = '12px';
chatWidget.style.boxShadow = '0 0 15px var(--primary-glow)';
chatWidget.style.color = 'var(--text-main)';
chatWidget.style.display = 'flex';
chatWidget.style.flexDirection = 'column';
chatWidget.style.zIndex = '10000';

const chatHeader = document.createElement('div');
chatHeader.style.padding = '10px';
chatHeader.style.background = 'var(--primary)';
chatHeader.style.color = '#000';
chatHeader.style.fontWeight = 'bold';
chatHeader.style.textAlign = 'center';
chatHeader.textContent = 'AI Chat Assistant';

const chatMessages = document.createElement('div');
chatMessages.style.flexGrow = '1';
chatMessages.style.padding = '10px';
chatMessages.style.overflowY = 'auto';
chatMessages.style.fontSize = '0.9rem';

const chatInputContainer = document.createElement('div');
chatInputContainer.style.display = 'flex';
chatInputContainer.style.padding = '10px';
chatInputContainer.style.borderTop = '1px solid var(--primary)';

const chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.placeholder = 'Type your message...';
chatInput.style.flexGrow = '1';
chatInput.style.padding = '8px';
chatInput.style.borderRadius = '8px';
chatInput.style.border = '1px solid var(--primary)';
chatInput.style.background = 'var(--input-bg)';
chatInput.style.color = 'var(--text-main)';

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
sendButton.style.marginLeft = '8px';
sendButton.style.padding = '8px 12px';
sendButton.style.borderRadius = '8px';
sendButton.style.border = 'none';
sendButton.style.background = 'var(--primary)';
sendButton.style.color = '#000';
sendButton.style.fontWeight = 'bold';
sendButton.style.cursor = 'pointer';

chatInputContainer.appendChild(chatInput);
chatInputContainer.appendChild(sendButton);

chatWidget.appendChild(chatHeader);
chatWidget.appendChild(chatMessages);
chatWidget.appendChild(chatInputContainer);

document.body.appendChild(chatWidget);

// Simple bot response logic (placeholder)
function botResponse(message) {
  // Basic canned responses for demo
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
}

function addMessage(text, fromUser = true) {
  const msgDiv = document.createElement('div');
  msgDiv.style.marginBottom = '8px';
  msgDiv.style.padding = '6px 10px';
  msgDiv.style.borderRadius = '12px';
  msgDiv.style.maxWidth = '80%';
  msgDiv.style.wordWrap = 'break-word';
  if (fromUser) {
    msgDiv.style.background = 'var(--secondary)';
    msgDiv.style.color = '#000';
    msgDiv.style.alignSelf = 'flex-end';
  } else {
    msgDiv.style.background = 'var(--primary)';
    msgDiv.style.color = '#000';
    msgDiv.style.alignSelf = 'flex-start';
  }
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', () => {
  const userText = chatInput.value.trim();
  if (!userText) return;
  addMessage(userText, true);
  chatInput.value = '';
  setTimeout(() => {
    const reply = botResponse(userText);
    addMessage(reply, false);
  }, 500);
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

// Voice assistant integration using Web Speech API
const voiceButton = document.createElement('button');
voiceButton.textContent = '🎤';
voiceButton.title = 'Voice Command';
voiceButton.style.position = 'fixed';
voiceButton.style.bottom = '440px';
voiceButton.style.right = '20px';
voiceButton.style.width = '48px';
voiceButton.style.height = '48px';
voiceButton.style.borderRadius = '50%';
voiceButton.style.border = 'none';
voiceButton.style.background = 'var(--primary)';
voiceButton.style.color = '#000';
voiceButton.style.fontSize = '24px';
voiceButton.style.cursor = 'pointer';
voiceButton.style.zIndex = '10001';

document.body.appendChild(voiceButton);

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    addMessage('🎙️ ' + transcript, true);
    const reply = botResponse(transcript);
    addMessage(reply, false);
  };

  recognition.onerror = function(event) {
    addMessage('Voice recognition error: ' + event.error, false);
  };
} else {
  voiceButton.disabled = true;
  voiceButton.title = 'Voice recognition not supported in this browser.';
}

voiceButton.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
  }
});
