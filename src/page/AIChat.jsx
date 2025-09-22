// import React, { useState, useRef, useEffect } from 'react';
// import { useChat } from '../context/ChatContext';
// import Sidebar from './Sidebar';
// import ChatArea from './ChatArea';
// import InputArea from './InputArea';
// import VoiceHandler from './VoiceHandler';
// import { RiRobot2Line } from 'react-icons/ri';

// const AIChat = () => {
//   const { conversations, activeConversation, settings } = useChat();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const chatContainerRef = useRef(null);

//   const activeConv = conversations.find(
//     (conv) => conv.id === activeConversation,
//   );

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [activeConv?.messages]);

//   return (
//     <div className={`ai-chat-container ${settings.theme}`}>
//       <VoiceHandler />

//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       <div className="main-content">
//         <header className="chat-header">
//           <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
//             <RiRobot2Line />
//           </button>

//           <div className="header-info">
//             <h1>{activeConv?.title || 'AI Assistant'}</h1>
//             {activeConv && (
//               <span className="message-count">
//                 {activeConv.messages.length} messages
//               </span>
//             )}
//           </div>

//           <div className="header-actions">
//             {settings.voiceEnabled && (
//               <div className="voice-status">
//                 <div className="pulse-dot"></div>
//                 <span>Voice Active</span>
//               </div>
//             )}
//           </div>
//         </header>

//         <ChatArea
//           ref={chatContainerRef}
//           messages={activeConv?.messages || []}
//           isProcessing={isProcessing}
//         />

//         <InputArea
//           onSend={(message) => setIsProcessing(true)}
//           onResponseComplete={() => setIsProcessing(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default AIChat;

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import InputArea from './InputArea';
import VoiceHandler from './VoiceHandler';
import { RiRobot2Line } from 'react-icons/ri';

const AIChat = () => {
  const { conversations, activeConversation, settings } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  const activeConv = conversations.find(
    (conv) => conv.id === activeConversation,
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [activeConv?.messages]);

  return (
    <div className={`ai-chat-container ${settings.theme}`}>
      <VoiceHandler />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <RiRobot2Line />
          </button>

          <div className="header-info">
            <h1>{activeConv?.title || 'AI Assistant'}</h1>
            {activeConv && (
              <span className="message-count">
                {activeConv.messages.length} messages
              </span>
            )}
          </div>

          <div className="header-actions">
            {settings.voiceEnabled && (
              <div className="voice-status">
                <div className="pulse-dot"></div>
                <span>Voice Active</span>
              </div>
            )}
          </div>
        </header>

        <ChatArea
          ref={chatContainerRef}
          messages={activeConv?.messages || []}
          isProcessing={isProcessing}
        />

        <InputArea
          onSend={(message) => setIsProcessing(true)}
          onResponseComplete={() => setIsProcessing(false)}
        />
      </div>
    </div>
  );
};

export default AIChat;
