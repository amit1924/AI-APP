// import React from 'react';
// import { FaUser, FaRobot, FaImage, FaNewspaper } from 'react-icons/fa';

// import { RiSunFill } from 'react-icons/ri';

// const Message = ({ message }) => {
//   const isUser = message.sender === 'user';

//   const renderContent = () => {
//     switch (message.type) {
//       case 'image':
//         return (
//           <div className="message-image">
//             <img src={message.content} alt="Generated" />
//             <a href={message.content} download={`ai-image-${Date.now()}.png`}>
//               Download Image
//             </a>
//           </div>
//         );

//       case 'weather':
//         return (
//           <div className="message-weather">
//             <RiSunFill className="weather-icon" />
//             <div className="weather-content">{message.content}</div>
//           </div>
//         );

//       case 'news':
//         return (
//           <div className="message-news">
//             <FaNewspaper className="news-icon" />
//             <div className="news-content">{message.content}</div>
//           </div>
//         );

//       default:
//         return (
//           <div
//             className="message-text"
//             dangerouslySetInnerHTML={{
//               __html: formatText(message.content),
//             }}
//           />
//         );
//     }
//   };

//   const formatText = (text) => {
//     return text
//       .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//       .replace(/\*(.*?)\*/g, '<em>$1</em>')
//       .replace(/`(.*?)`/g, '<code>$1</code>')
//       .replace(/\n/g, '<br/>');
//   };

//   return (
//     <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
//       <div className="message-avatar">{isUser ? <FaUser /> : <FaRobot />}</div>

//       <div className="message-content">
//         {renderContent()}
//         <div className="message-time">
//           {new Date(message.timestamp).toLocaleTimeString()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;

import React from 'react';
import {
  FaUser,
  FaRobot,
  FaImage,
  FaNewspaper,
  FaMapMarkerAlt,
  FaMusic,
  FaSearch,
} from 'react-icons/fa';
import { RiSunFill, RiTimeLine } from 'react-icons/ri';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatContent = (content) => {
    // Convert markdown-like syntax to HTML
    return content
      .replace(/##\s+(.+)/g, '<h2 class="message-heading">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="message-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="message-italic">$1</em>')
      .replace(/-\s+(.+)/g, '<li class="message-list-item">• $1</li>')
      .replace(/\n/g, '<br/>');
  };

  const getMessageIcon = () => {
    const content = message.content.toLowerCase();
    if (content.includes('weather'))
      return <RiSunFill className="message-type-icon" />;
    if (content.includes('news'))
      return <FaNewspaper className="message-type-icon" />;
    if (content.includes('location') || content.includes('map'))
      return <FaMapMarkerAlt className="message-type-icon" />;
    if (content.includes('song') || content.includes('music'))
      return <FaMusic className="message-type-icon" />;
    if (content.includes('search'))
      return <FaSearch className="message-type-icon" />;
    if (content.includes('time') || content.includes('date'))
      return <RiTimeLine className="message-type-icon" />;
    return <FaRobot className="message-type-icon" />;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="message-image">
            <div className="image-header">
              <FaImage className="image-icon" />
              <span>Generated Image</span>
            </div>
            <img
              src={message.content}
              alt="AI Generated"
              className="generated-image"
            />
            <a
              href={message.content}
              download={`ai-image-${Date.now()}.png`}
              className="download-btn"
            >
              Download Image
            </a>
          </div>
        );

      case 'weather':
        return (
          <div className="message-weather">
            <div className="weather-header">
              <RiWeatherFill className="weather-icon" />
              <span>Weather Report</span>
            </div>
            <div
              className="weather-content"
              dangerouslySetInnerHTML={{
                __html: formatContent(message.content),
              }}
            />
          </div>
        );

      default:
        return (
          <div
            className="message-text"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        );
    }
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? <FaUser /> : getMessageIcon()}
      </div>

      <div className="message-content">
        <div className="message-bubble">{renderContent()}</div>
        <div className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;
