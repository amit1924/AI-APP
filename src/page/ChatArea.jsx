import React, { forwardRef } from 'react';
import Message from './Message';
import WelcomeScreen from './WelcomeScreen';

const ChatArea = forwardRef(({ messages, isProcessing }, ref) => {
  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div ref={ref} className="chat-area">
      {messages.map((message, index) => (
        <Message key={message.id || index} message={message} />
      ))}

      {isProcessing && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>AI is thinking...</span>
        </div>
      )}
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;
