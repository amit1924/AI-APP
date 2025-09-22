import React from 'react';
import { RiRobot2Line, RiLightbulbFlashLine } from 'react-icons/ri';

const WelcomeScreen = () => {
  const features = [
    {
      icon: <RiLightbulbFlashLine />,
      title: 'Smart Responses',
      description: 'Get intelligent answers to all your questions',
    },
    {
      icon: '🎨',
      title: 'Image Generation',
      description: 'Create amazing images from text descriptions',
    },
    {
      icon: '🌤️',
      title: 'Weather Updates',
      description: 'Get real-time weather information',
    },
    {
      icon: '📰',
      title: 'News Briefing',
      description: 'Stay updated with latest news',
    },
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-avatar">
          <RiRobot2Line />
        </div>
        <h1>Welcome to AI Assistant</h1>
        <p>How can I help you today?</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="welcome-tips">
        <h3>Try saying:</h3>
        <div className="tip-examples">
          <span>"What's the weather like today?"</span>
          <span>"Generate an image of a sunset"</span>
          <span>"Tell me about artificial intelligence"</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
