// import React, { createContext, useContext, useState, useEffect } from 'react';

// const ChatContext = createContext();

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };

// export const ChatProvider = ({ children }) => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [settings, setSettings] = useState({
//     voiceEnabled: false,
//     language: 'en-IN',
//     theme: 'dark',
//     autoSpeak: false,
//   });

//   // Load data from localStorage
//   useEffect(() => {
//     const savedConversations = localStorage.getItem('ai-conversations');
//     const savedSettings = localStorage.getItem('ai-settings');

//     if (savedConversations) {
//       setConversations(JSON.parse(savedConversations));
//     }

//     if (savedSettings) {
//       setSettings(JSON.parse(savedSettings));
//     }
//   }, []);

//   // Save to localStorage
//   useEffect(() => {
//     localStorage.setItem('ai-conversations', JSON.stringify(conversations));
//   }, [conversations]);

//   useEffect(() => {
//     localStorage.setItem('ai-settings', JSON.stringify(settings));
//   }, [settings]);

//   // Create new conversation
//   const createNewChat = () => {
//     const newChat = {
//       id: Date.now().toString(),
//       title: 'New Chat',
//       messages: [],
//       createdAt: new Date().toISOString(),
//     };

//     setConversations((prev) => [newChat, ...prev]);
//     setActiveConversation(newChat.id);
//     return newChat.id;
//   };

//   // Add message to active conversation
//   const addMessage = (message) => {
//     if (!activeConversation) return;

//     setConversations((prev) =>
//       prev.map((conv) => {
//         if (conv.id === activeConversation) {
//           const updatedConv = {
//             ...conv,
//             messages: [...conv.messages, message],
//             title:
//               conv.messages.length === 0
//                 ? message.content.length > 20
//                   ? message.content.substring(0, 20) + '...'
//                   : message.content
//                 : conv.title,
//           };
//           return updatedConv;
//         }
//         return conv;
//       }),
//     );
//   };

//   // Delete conversation
//   const deleteConversation = (conversationId) => {
//     setConversations((prev) =>
//       prev.filter((conv) => conv.id !== conversationId),
//     );
//     if (activeConversation === conversationId) {
//       setActiveConversation(
//         conversations.length > 1 ? conversations[0].id : null,
//       );
//     }
//   };

//   // Clear all conversations
//   const clearAllConversations = () => {
//     setConversations([]);
//     setActiveConversation(null);
//   };

//   // Update settings
//   const updateSettings = (newSettings) => {
//     setSettings((prev) => ({ ...prev, ...newSettings }));
//   };

//   const value = {
//     conversations,
//     activeConversation,
//     settings,
//     setActiveConversation,
//     createNewChat,
//     addMessage,
//     deleteConversation,
//     clearAllConversations,
//     updateSettings,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [settings, setSettings] = useState({
    voiceEnabled: false,
    language: 'en-IN',
    theme: 'dark',
    autoSpeak: false,
    voiceProfile: 'Google US English', // Added missing property
    speechRate: 1, // Added missing property
    fontSize: 16, // Added missing property
    messageDensity: 'comfortable', // Added missing property
    autoDelete: 'never', // Added missing property
  });

  // Load data from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai-conversations');
    const savedSettings = localStorage.getItem('ai-settings');

    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ai-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ai-settings', JSON.stringify(settings));
  }, [settings]);

  // Create new conversation
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveConversation(newChat.id);
    return newChat.id;
  };

  // Add message to active conversation
  const addMessage = (message) => {
    if (!activeConversation) return;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation) {
          const updatedConv = {
            ...conv,
            messages: [...conv.messages, message],
            title:
              conv.messages.length === 0
                ? message.content.length > 20
                  ? message.content.substring(0, 20) + '...'
                  : message.content
                : conv.title,
          };
          return updatedConv;
        }
        return conv;
      }),
    );
  };

  // Delete conversation
  const deleteConversation = (conversationId) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId),
    );
    if (activeConversation === conversationId) {
      setActiveConversation(
        conversations.length > 1 ? conversations[0]?.id : null,
      );
    }
  };

  // Clear all conversations
  const clearAllConversations = () => {
    setConversations([]);
    setActiveConversation(null);
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset settings to default - ADDED MISSING FUNCTION
  const resetSettings = () => {
    setSettings({
      voiceEnabled: false,
      language: 'en-IN',
      theme: 'dark',
      autoSpeak: false,
      voiceProfile: 'Google US English',
      speechRate: 1,
      fontSize: 16,
      messageDensity: 'comfortable',
      autoDelete: 'never',
    });
  };

  // Clear chat history - ADDED MISSING FUNCTION (alias for clearAllConversations)
  const clearChatHistory = () => {
    clearAllConversations();
  };

  const value = {
    conversations,
    activeConversation,
    settings,
    setActiveConversation,
    createNewChat,
    addMessage,
    deleteConversation,
    clearAllConversations,
    updateSettings,
    resetSettings, // Added missing function
    clearChatHistory, // Added missing function
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
