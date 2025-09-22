// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useChat } from '../context/ChatContext';
// import {
//   RiArrowLeftLine,
//   RiSunLine,
//   RiMoonLine,
//   RiVolumeUpLine,
//   RiVolumeMuteLine,
//   RiMicLine,
//   RiMicOffLine,
//   RiSaveLine,
//   RiRefreshLine,
// } from 'react-icons/ri';
// import './Settings.css';

// const Settings = () => {
//   const { settings, updateSettings, resetSettings, clearChatHistory } =
//     useChat();
//   const navigate = useNavigate();
//   const [saved, setSaved] = useState(false);

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const handleReset = () => {
//     if (
//       window.confirm('Are you sure you want to reset all settings to default?')
//     ) {
//       resetSettings();
//     }
//   };

//   const handleClearHistory = () => {
//     if (
//       window.confirm(
//         'Are you sure you want to clear all chat history? This action cannot be undone.',
//       )
//     ) {
//       clearChatHistory();
//       alert('Chat history cleared successfully!');
//     }
//   };

//   const languageOptions = [
//     { value: 'en-US', label: 'English (US)' },
//     { value: 'en-IN', label: 'English (India)' },
//     { value: 'hi-IN', label: 'Hindi (India)' },
//     { value: 'es-ES', label: 'Spanish' },
//     { value: 'fr-FR', label: 'French' },
//     { value: 'de-DE', label: 'German' },
//     { value: 'it-IT', label: 'Italian' },
//     { value: 'ja-JP', label: 'Japanese' },
//     { value: 'ko-KR', label: 'Korean' },
//     { value: 'zh-CN', label: 'Chinese (Simplified)' },
//   ];

//   const voiceOptions = [
//     { value: 'Google US English', label: 'Google US English' },
//     {
//       value: 'Microsoft David - English (United States)',
//       label: 'Microsoft David',
//     },
//     {
//       value: 'Microsoft Zira - English (United States)',
//       label: 'Microsoft Zira',
//     },
//     { value: 'Google español', label: 'Google Spanish' },
//     { value: 'Google français', label: 'Google French' },
//     { value: 'Google Deutsch', label: 'Google German' },
//   ];

//   return (
//     <div className={`settings-page ${settings.theme}`}>
//       <header className="page-header">
//         <button onClick={() => navigate(-1)} className="back-btn">
//           <RiArrowLeftLine />
//           Back to Chat
//         </button>
//         <div className="header-content">
//           <h1>Settings</h1>
//           <div className="header-actions">
//             <button
//               className={`save-btn ${saved ? 'saved' : ''}`}
//               onClick={handleSave}
//             >
//               <RiSaveLine />
//               {saved ? 'Saved!' : 'Save'}
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="page-content">
//         {/* Voice & Speech Settings */}
//         <div className="setting-group">
//           <div className="group-header">
//             <RiMicLine className="group-icon" />
//             <h3>Voice & Speech</h3>
//           </div>

//           <div className="setting-items">
//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">
//                   <RiMicLine />
//                   Voice Commands
//                 </label>
//                 <span className="setting-description">
//                   Enable voice recognition for hands-free interaction
//                 </span>
//               </div>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={settings.voiceEnabled}
//                   onChange={(e) =>
//                     updateSettings({ voiceEnabled: e.target.checked })
//                   }
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">
//                   <RiVolumeUpLine />
//                   Auto-speak Responses
//                 </label>
//                 <span className="setting-description">
//                   Automatically speak AI responses when received
//                 </span>
//               </div>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={settings.autoSpeak}
//                   onChange={(e) =>
//                     updateSettings({ autoSpeak: e.target.checked })
//                   }
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Voice Profile</label>
//                 <span className="setting-description">
//                   Choose your preferred voice for speech synthesis
//                 </span>
//               </div>
//               <select
//                 value={settings.voiceProfile}
//                 onChange={(e) =>
//                   updateSettings({ voiceProfile: e.target.value })
//                 }
//                 className="setting-select"
//               >
//                 {voiceOptions.map((voice) => (
//                   <option key={voice.value} value={voice.value}>
//                     {voice.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Speech Rate</label>
//                 <span className="setting-description">
//                   Adjust the speed of speech synthesis
//                 </span>
//               </div>
//               <div className="slider-container">
//                 <input
//                   type="range"
//                   min="0.5"
//                   max="2"
//                   step="0.1"
//                   value={settings.speechRate}
//                   onChange={(e) =>
//                     updateSettings({ speechRate: parseFloat(e.target.value) })
//                   }
//                   className="rate-slider"
//                 />
//                 <span className="rate-value">{settings.speechRate}x</span>
//               </div>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Language</label>
//                 <span className="setting-description">
//                   Set your preferred language for voice and text
//                 </span>
//               </div>
//               <select
//                 value={settings.language}
//                 onChange={(e) => updateSettings({ language: e.target.value })}
//                 className="setting-select"
//               >
//                 {languageOptions.map((lang) => (
//                   <option key={lang.value} value={lang.value}>
//                     {lang.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Appearance Settings */}
//         <div className="setting-group">
//           <div className="group-header">
//             {settings.theme === 'dark' ? (
//               <RiMoonLine className="group-icon" />
//             ) : (
//               <RiSunLine className="group-icon" />
//             )}
//             <h3>Appearance</h3>
//           </div>

//           <div className="setting-items">
//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Theme</label>
//                 <span className="setting-description">
//                   Choose between light and dark themes
//                 </span>
//               </div>
//               <div className="theme-selector">
//                 <button
//                   className={`theme-option ${
//                     settings.theme === 'light' ? 'active' : ''
//                   }`}
//                   onClick={() => updateSettings({ theme: 'light' })}
//                 >
//                   <RiSunLine />
//                   Light
//                 </button>
//                 <button
//                   className={`theme-option ${
//                     settings.theme === 'dark' ? 'active' : ''
//                   }`}
//                   onClick={() => updateSettings({ theme: 'dark' })}
//                 >
//                   <RiMoonLine />
//                   Dark
//                 </button>
//               </div>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Font Size</label>
//                 <span className="setting-description">
//                   Adjust the text size in the chat interface
//                 </span>
//               </div>
//               <div className="slider-container">
//                 <input
//                   type="range"
//                   min="12"
//                   max="20"
//                   step="1"
//                   value={settings.fontSize}
//                   onChange={(e) =>
//                     updateSettings({ fontSize: parseInt(e.target.value) })
//                   }
//                   className="font-slider"
//                 />
//                 <span className="font-value">{settings.fontSize}px</span>
//               </div>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Message Density</label>
//                 <span className="setting-description">
//                   Control the spacing between messages
//                 </span>
//               </div>
//               <select
//                 value={settings.messageDensity}
//                 onChange={(e) =>
//                   updateSettings({ messageDensity: e.target.value })
//                 }
//                 className="setting-select"
//               >
//                 <option value="compact">Compact</option>
//                 <option value="comfortable">Comfortable</option>
//                 <option value="spacious">Spacious</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Privacy & Data Settings */}
//         <div className="setting-group">
//           <div className="group-header">
//             <RiRefreshLine className="group-icon" />
//             <h3>Privacy & Data</h3>
//           </div>

//           <div className="setting-items">
//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Chat History</label>
//                 <span className="setting-description">
//                   Permanently delete all your conversation history
//                 </span>
//               </div>
//               <button className="danger-btn" onClick={handleClearHistory}>
//                 Clear Chat History
//               </button>
//             </div>

//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Auto-delete Messages</label>
//                 <span className="setting-description">
//                   Automatically delete messages older than specified time
//                 </span>
//               </div>
//               <select
//                 value={settings.autoDelete}
//                 onChange={(e) => updateSettings({ autoDelete: e.target.value })}
//                 className="setting-select"
//               >
//                 <option value="never">Never</option>
//                 <option value="1day">1 Day</option>
//                 <option value="1week">1 Week</option>
//                 <option value="1month">1 Month</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Reset Settings */}
//         <div className="setting-group">
//           <div className="group-header">
//             <RiRefreshLine className="group-icon" />
//             <h3>Reset Options</h3>
//           </div>

//           <div className="setting-items">
//             <div className="setting-item">
//               <div className="setting-info">
//                 <label className="setting-label">Reset to Defaults</label>
//                 <span className="setting-description">
//                   Restore all settings to their original values
//                 </span>
//               </div>
//               <button className="danger-btn" onClick={handleReset}>
//                 <RiRefreshLine />
//                 Reset All Settings
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed unused Link import
import { useChat } from '../context/ChatContext';
import {
  RiArrowLeftLine,
  RiSunLine,
  RiMoonLine,
  RiVolumeUpLine,
  RiMicLine,
  RiSaveLine,
  RiRefreshLine,
} from 'react-icons/ri';
import './Settings.css';

const Settings = () => {
  const { settings, updateSettings, resetSettings, clearChatHistory } =
    useChat();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset all settings to default?')
    ) {
      resetSettings();
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all chat history? This action cannot be undone.',
      )
    ) {
      clearChatHistory();
      alert('Chat history cleared successfully!');
    }
  };

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-IN', label: 'English (India)' },
    { value: 'hi-IN', label: 'Hindi (India)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
  ];

  const voiceOptions = [
    { value: 'Google US English', label: 'Google US English' },
    {
      value: 'Microsoft David - English (United States)',
      label: 'Microsoft David',
    },
    {
      value: 'Microsoft Zira - English (United States)',
      label: 'Microsoft Zira',
    },
    { value: 'Google español', label: 'Google Spanish' },
    { value: 'Google français', label: 'Google French' },
    { value: 'Google Deutsch', label: 'Google German' },
  ];

  return (
    <div className={`settings-page ${settings.theme}`}>
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <RiArrowLeftLine />
          Back to Chat
        </button>
        <div className="header-content">
          <h1>Settings</h1>
          <div className="header-actions">
            <button
              className={`save-btn ${saved ? 'saved' : ''}`}
              onClick={handleSave}
            >
              <RiSaveLine />
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* Voice & Speech Settings */}
        <div className="setting-group">
          <div className="group-header">
            <RiMicLine className="group-icon" />
            <h3>Voice & Speech</h3>
          </div>

          <div className="setting-items">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">
                  <RiMicLine />
                  Voice Commands
                </label>
                <span className="setting-description">
                  Enable voice recognition for hands-free interaction
                </span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) =>
                    updateSettings({ voiceEnabled: e.target.checked })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">
                  <RiVolumeUpLine />
                  Auto-speak Responses
                </label>
                <span className="setting-description">
                  Automatically speak AI responses when received
                </span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.autoSpeak}
                  onChange={(e) =>
                    updateSettings({ autoSpeak: e.target.checked })
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Voice Profile</label>
                <span className="setting-description">
                  Choose your preferred voice for speech synthesis
                </span>
              </div>
              <select
                value={settings.voiceProfile || 'Google US English'}
                onChange={(e) =>
                  updateSettings({ voiceProfile: e.target.value })
                }
                className="setting-select"
              >
                {voiceOptions.map((voice) => (
                  <option key={voice.value} value={voice.value}>
                    {voice.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Speech Rate</label>
                <span className="setting-description">
                  Adjust the speed of speech synthesis
                </span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.speechRate || 1}
                  onChange={(e) =>
                    updateSettings({ speechRate: parseFloat(e.target.value) })
                  }
                  className="rate-slider"
                />
                <span className="rate-value">{settings.speechRate || 1}x</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Language</label>
                <span className="setting-description">
                  Set your preferred language for voice and text
                </span>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="setting-select"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="setting-group">
          <div className="group-header">
            {settings.theme === 'dark' ? (
              <RiMoonLine className="group-icon" />
            ) : (
              <RiSunLine className="group-icon" />
            )}
            <h3>Appearance</h3>
          </div>

          <div className="setting-items">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Theme</label>
                <span className="setting-description">
                  Choose between light and dark themes
                </span>
              </div>
              <div className="theme-selector">
                <button
                  className={`theme-option ${
                    settings.theme === 'light' ? 'active' : ''
                  }`}
                  onClick={() => updateSettings({ theme: 'light' })}
                >
                  <RiSunLine />
                  Light
                </button>
                <button
                  className={`theme-option ${
                    settings.theme === 'dark' ? 'active' : ''
                  }`}
                  onClick={() => updateSettings({ theme: 'dark' })}
                >
                  <RiMoonLine />
                  Dark
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Font Size</label>
                <span className="setting-description">
                  Adjust the text size in the chat interface
                </span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="12"
                  max="20"
                  step="1"
                  value={settings.fontSize || 16}
                  onChange={(e) =>
                    updateSettings({ fontSize: parseInt(e.target.value) })
                  }
                  className="font-slider"
                />
                <span className="font-value">{settings.fontSize || 16}px</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Message Density</label>
                <span className="setting-description">
                  Control the spacing between messages
                </span>
              </div>
              <select
                value={settings.messageDensity || 'comfortable'}
                onChange={(e) =>
                  updateSettings({ messageDensity: e.target.value })
                }
                className="setting-select"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Data Settings */}
        <div className="setting-group">
          <div className="group-header">
            <RiRefreshLine className="group-icon" />
            <h3>Privacy & Data</h3>
          </div>

          <div className="setting-items">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Chat History</label>
                <span className="setting-description">
                  Permanently delete all your conversation history
                </span>
              </div>
              <button className="danger-btn" onClick={handleClearHistory}>
                Clear Chat History
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Auto-delete Messages</label>
                <span className="setting-description">
                  Automatically delete messages older than specified time
                </span>
              </div>
              <select
                value={settings.autoDelete || 'never'}
                onChange={(e) => updateSettings({ autoDelete: e.target.value })}
                className="setting-select"
              >
                <option value="never">Never</option>
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="setting-group">
          <div className="group-header">
            <RiRefreshLine className="group-icon" />
            <h3>Reset Options</h3>
          </div>

          <div className="setting-items">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Reset to Defaults</label>
                <span className="setting-description">
                  Restore all settings to their original values
                </span>
              </div>
              <button className="danger-btn" onClick={handleReset}>
                <RiRefreshLine />
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
