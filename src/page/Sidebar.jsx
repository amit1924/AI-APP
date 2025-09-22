import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiSettingsLine,
  RiNewsLine,
  RiChatSmile3Line,
} from 'react-icons/ri';

const Sidebar = ({ isOpen, onClose }) => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewChat,
    deleteConversation,
    clearAllConversations,
  } = useChat();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="close-btn" onClick={onClose}>
            <RiCloseLine />
          </button>
        </div>

        <div className="sidebar-actions">
          <button className="new-chat-btn" onClick={createNewChat}>
            <RiAddLine />
            New Chat
          </button>

          {conversations.length > 0 && (
            <button className="clear-all-btn" onClick={clearAllConversations}>
              <RiDeleteBinLine />
              Clear All
            </button>
          )}
        </div>

        <div className="conversations-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                activeConversation === conv.id ? 'active' : ''
              }`}
              onClick={() => {
                setActiveConversation(conv.id);
                onClose();
              }}
            >
              <RiChatSmile3Line className="conversation-icon" />
              <div className="conversation-info">
                <h4>{conv.title}</h4>
                <span>{new Date(conv.createdAt).toLocaleDateString()}</span>
              </div>
              <button
                className="delete-conv-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
              >
                <RiDeleteBinLine />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <a href="/news" className="sidebar-link">
            <RiNewsLine />
            Latest News
          </a>
          <a href="/settings" className="sidebar-link">
            <RiSettingsLine />
            Settings
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
