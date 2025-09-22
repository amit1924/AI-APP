import React from 'react';

const quickActions = [
  {
    icon: '🎤',
    label: 'Voice Command',
    prompt: '',
    type: 'voice',
  },
  {
    icon: '🎨',
    label: 'Generate Image',
    prompt: 'Generate an image of ',
    type: 'text',
  },
  {
    icon: '🌤️',
    label: 'Weather',
    prompt: 'What is the weather in ',
    type: 'text',
  },
  {
    icon: '📰',
    label: 'Latest News',
    prompt: 'Tell me the latest news',
    type: 'text',
  },
  {
    icon: '🔍',
    label: 'Search Web',
    prompt: 'Search for ',
    type: 'text',
  },
  {
    icon: '⏰',
    label: 'Current Time',
    prompt: 'What time is it',
    type: 'text',
  },
  {
    icon: '🗺️',
    label: 'Search Location',
    prompt: 'Search location ',
    type: 'text',
  },
  {
    icon: '🎵',
    label: 'Play Song',
    prompt: 'Play song of ',
    type: 'text',
  },
];

const QuickActions = ({ onVoiceCommand, onTextCommand }) => {
  return (
    <div className="quick-actions">
      {quickActions.map((action, index) => (
        <button
          key={index}
          className="quick-action-btn"
          onClick={() => {
            if (action.type === 'voice') {
              onVoiceCommand();
            } else {
              onTextCommand(action.prompt);
            }
          }}
        >
          <span className="action-icon">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
