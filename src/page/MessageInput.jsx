import React from 'react';
import { RiSendPlane2Line } from 'react-icons/ri';

const MessageInput = ({
  input,
  setInput,
  onSend,
  onVoiceClick,
  isListening,
  inputRef,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-container">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message or use voice command..."
        rows="1"
        className="message-input"
      />

      <div className="input-actions">
        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={onVoiceClick}
          title={isListening ? 'Stop Listening' : 'Start Voice Input'}
        >
          {isListening ? '🔴' : '🎤'}
        </button>

        <button
          className="send-btn"
          onClick={onSend}
          disabled={!input.trim()}
          title="Send Message"
        >
          <RiSendPlane2Line />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
