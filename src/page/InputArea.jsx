// import React, { useState, useRef } from 'react';
// import { useChat } from '../context/ChatContext';
// import {
//   RiSendPlane2Line,
//   RiMicLine,
//   RiMicOffLine,
//   RiImageLine,
//   RiSettingsLine,
// } from 'react-icons/ri';

// const InputArea = ({ onSend, onResponseComplete }) => {
//   const [input, setInput] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const { addMessage, settings, activeConversation, createNewChat } = useChat();
//   const inputRef = useRef(null);

//   // Weather API function
//   const fetchWeather = async (city) => {
//     try {
//       const API_URL =
//         'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
//       const response = await fetch(
//         `${API_URL}${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
//       );

//       if (response.ok) {
//         const data = await response.json();
//         const weatherDescription = data.weather[0].description;
//         const temp = Math.round(data.main.temp);
//         const humidity = data.main.humidity;
//         const windSpeed = data.wind.speed;

//         const weatherMessage = `## Weather Report for ${data.name}\n\n**Current Conditions:** ${weatherDescription}\n\n**Temperature:** ${temp}°C\n**Humidity:** ${humidity}%\n**Wind Speed:** ${windSpeed} km/h\n\n*Data provided by OpenWeatherMap*`;

//         return {
//           type: 'text',
//           content: weatherMessage,
//           speakText: weatherMessage.replace(/[#*\-`]/g, ''),
//         };
//       } else {
//         return {
//           type: 'text',
//           content:
//             '**City not found**\n\nPlease check the city name and try again.',
//           speakText:
//             'City not found. Please check the city name and try again.',
//         };
//       }
//     } catch (error) {
//       return {
//         type: 'text',
//         content:
//           "## Error\n\n**Sorry, I couldn't fetch the weather information.**\n\nPlease check your internet connection and try again.",
//         speakText:
//           "Sorry, I couldn't fetch the weather information. Please check your internet connection and try again.",
//       };
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       sender: 'user',
//       type: 'text',
//       content: input.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     // If no active conversation, create one
//     let convId = activeConversation;
//     if (!convId) {
//       convId = createNewChat();
//     }

//     addMessage(userMessage);
//     onSend?.(userMessage);

//     const currentInput = input;
//     setInput('');

//     // Process the input and generate AI response
//     setTimeout(async () => {
//       const aiResponse = await processUserInput(currentInput);

//       const aiMessage = {
//         id: Date.now().toString() + '-ai',
//         sender: 'ai',
//         type: aiResponse.type,
//         content: aiResponse.content,
//         timestamp: new Date().toISOString(),
//       };

//       addMessage(aiMessage);

//       // Speak response if voice is enabled
//       if (settings.autoSpeak && aiResponse.speakText) {
//         speakText(aiResponse.speakText);
//       }

//       onResponseComplete?.();
//     }, 1000);
//   };

//   const processUserInput = async (userInput) => {
//     const command = userInput.toLowerCase();

//     // Date and Time
//     const dateRegex =
//       /(?:what is the date|what time is it|what is the time|what is the time now|tell me the date|what is the day today|tell me the time)/i;
//     const matchDate = userInput.match(dateRegex);

//     if (matchDate) {
//       const now = new Date();
//       const dayIndex = now.getDay();
//       const daysOfWeek = [
//         'Sunday',
//         'Monday',
//         'Tuesday',
//         'Wednesday',
//         'Thursday',
//         'Friday',
//         'Saturday',
//       ];
//       const dayName = daysOfWeek[dayIndex];
//       const date = now.toLocaleDateString();
//       const time = now.toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       });

//       const dateResponse = `## 📅 Current Date & Time\n\n**Day:** ${dayName}\n**Date:** ${date}\n**Time:** ${time}\n\n*Hope you're having a great ${dayName}!*`;

//       return {
//         type: 'text',
//         content: dateResponse,
//         speakText: `Today is ${dayName}, date is ${date}, and the time is ${time}`,
//       };
//     }

//     // Generate Image
//     else if (
//       command.includes('generate an image') ||
//       command.includes('generate image')
//     ) {
//       const prompt = command
//         .replace(/generate an image|generate image/gi, '')
//         .trim();
//       const width = 512;
//       const height = 512;
//       const seed = Math.floor(Math.random() * 1000);
//       const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
//         prompt,
//       )}?width=${width}&height=${height}&seed=${seed}&model=default`;

//       return {
//         type: 'image',
//         content: imageUrl,
//         speakText: `Generating image of ${prompt}, please wait...`,
//       };
//     }

//     // Weather
//     else if (
//       command.includes('weather in') ||
//       command.includes('weather of') ||
//       command.includes('temperature in') ||
//       command.includes('temperature of')
//     ) {
//       const cityRegex =
//         /(weather in|weather of|temperature in|temperature of)\s+([\w\s]+)/i;
//       const match = userInput.match(cityRegex);

//       if (match && match[2]) {
//         const city = match[2].trim();
//         const weatherData = await fetchWeather(city);
//         return weatherData;
//       } else {
//         return {
//           type: 'text',
//           content:
//             'Please specify a city for weather information. Example: "weather in London"',
//           speakText: 'Please specify a city for weather information.',
//         };
//       }
//     }

//     // Search Location (Google Maps)
//     else if (command.startsWith('search location')) {
//       const location = command.slice(15).trim();
//       if (location) {
//         const mapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(
//           location,
//         )}`;
//         window.open(mapsUrl, '_blank');

//         return {
//           type: 'text',
//           content: `## 🗺️ Location Search\n\n**Searching for:** ${location}\n\n- Opening Google Maps\n- Showing nearby places\n- Providing directions\n\n*Location search completed*`,
//           speakText: `Opening Google Maps for ${location}`,
//         };
//       }
//     }

//     // Play Song (Spotify)
//     else if (
//       command.includes('play song of') ||
//       command.includes('play song')
//     ) {
//       const songName = command.replace(/play song of|play song/gi, '').trim();
//       const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(
//         songName,
//       )}`;
//       window.open(searchUrl, '_blank');

//       return {
//         type: 'text',
//         content: `## 🎵 Music Player\n\n**Now Playing:** ${songName}\n\n- Opening Spotify\n- Searching for track\n- Starting playback\n\n*Enjoy your music!*`,
//         speakText: `Playing ${songName} on Spotify`,
//       };
//     }

//     // Search Image (Google Images)
//     else if (command.startsWith('search image of')) {
//       const searchQuery = command.replace('search image of', '').trim();
//       const imageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
//         searchQuery,
//       )}`;
//       window.open(imageUrl, '_blank');

//       return {
//         type: 'text',
//         content: `## 🖼️ Image Search\n\n**Searching for:** ${searchQuery}\n\n- Browsing image database\n- Filtering results\n- Displaying relevant images\n\n*Image search completed*`,
//         speakText: `Searching images for ${searchQuery}`,
//       };
//     }

//     // Search Web (Google)
//     else if (command.startsWith('search for')) {
//       const searchQuery = command.slice(10).trim();
//       if (searchQuery) {
//         const url = `https://www.google.com/search?q=${encodeURIComponent(
//           searchQuery,
//         )}`;
//         window.open(url, '_blank');

//         return {
//           type: 'text',
//           content: `## 🔍 Web Search\n\n**Searching for:** ${searchQuery}\n\n- Querying search engines\n- Analyzing results\n- Presenting information\n\n*Search completed successfully*`,
//           speakText: `Searching for ${searchQuery} on Google`,
//         };
//       }
//     }

//     // Open Applications/Websites
//     else if (command.includes('open ')) {
//       const appName = command.split('open ')[1].trim();
//       const apps = {
//         notepad: 'C:\\Windows\\system32\\notepad.exe',
//         calculator: 'C:\\Windows\\system32\\calc.exe',
//       };

//       if (apps[appName]) {
//         // For desktop apps - this would need Electron for actual implementation
//         return {
//           type: 'text',
//           content: `## 🚀 Application Launch\n\n**Opening:** ${appName}\n\n- Starting application\n- Loading interface\n- Ready for use\n\n*Note: This feature works in desktop applications*`,
//           speakText: `I would open ${appName} in a desktop environment`,
//         };
//       } else {
//         let site = appName;
//         if (!site.startsWith('http')) {
//           if (!site.startsWith('www.')) site = 'www.' + site;
//           site += '.com';
//         }
//         window.open('http://' + site, '_blank');

//         return {
//           type: 'text',
//           content: `## 🌐 Website Launch\n\n**Opening:** ${site}\n\n- Connecting to server\n- Loading webpage\n- Displaying content\n\n*Website loaded successfully*`,
//           speakText: `Opening ${site.split('.')[1]}`,
//         };
//       }
//     }

//     // Latest News
//     else if (
//       command.includes('tell me the latest news') ||
//       command.includes('latest news')
//     ) {
//       // Navigate to news page or open news
//       window.open('/news', '_blank');

//       return {
//         type: 'text',
//         content: `## 📰 Latest News\n\n**Here are the latest news articles:**\n\n- Breaking news updates\n- Current events coverage\n- Trending stories\n\n*Opening news section...*`,
//         speakText: 'Opening latest news for you',
//       };
//     }

//     // Default AI Response
//     else {
//       try {
//         const response = await fetch(
//           `https://text.pollinations.ai/${encodeURIComponent(userInput)}`,
//         );
//         const text = await response.text();

//         return {
//           type: 'text',
//           content: text,
//           speakText: text.replace(/[#*\-`]/g, ''),
//         };
//       } catch (error) {
//         return {
//           type: 'text',
//           content:
//             "I apologize, but I'm having trouble processing your request. Please try again.",
//           speakText:
//             "I apologize, but I'm having trouble processing your request. Please try again.",
//         };
//       }
//     }
//   };

//   const speakText = (text) => {
//     if ('speechSynthesis' in window && settings.voiceEnabled) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.lang = settings.language;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const quickActions = [
//     {
//       icon: '🎤',
//       label: 'Voice Command',
//       prompt: '',
//     },
//     {
//       icon: '🎨',
//       label: 'Generate Image',
//       prompt: 'Generate an image of ',
//     },
//     {
//       icon: '🌤️',
//       label: 'Weather',
//       prompt: 'What is the weather in ',
//     },
//     {
//       icon: '📰',
//       label: 'Latest News',
//       prompt: 'Tell me the latest news',
//     },
//     {
//       icon: '🔍',
//       label: 'Search Web',
//       prompt: 'Search for ',
//     },
//     {
//       icon: '⏰',
//       label: 'Current Time',
//       prompt: 'What time is it',
//     },
//     {
//       icon: '🗺️',
//       label: 'Search Location',
//       prompt: 'Search location ',
//     },
//     {
//       icon: '🎵',
//       label: 'Play Song',
//       prompt: 'Play song of ',
//     },
//   ];

//   // Voice recognition handler
//   const startVoiceRecognition = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert('Your browser does not support speech recognition.');
//       return;
//     }

//     const SpeechRecognition =
//       window.webkitSpeechRecognition || window.SpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.lang = settings.language;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput(transcript);
//       setIsListening(false);

//       // Auto-send after voice input
//       setTimeout(() => {
//         handleSend();
//       }, 500);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setIsListening(false);
//     };

//     recognition.onstart = () => {
//       setIsListening(true);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   return (
//     <div className="input-area">
//       <div className="quick-actions">
//         {quickActions.map((action, index) => (
//           <button
//             key={index}
//             className="quick-action-btn"
//             onClick={() => {
//               if (action.label === 'Voice Command') {
//                 startVoiceRecognition();
//               } else {
//                 setInput(action.prompt);
//               }
//             }}
//           >
//             <span className="action-icon">{action.icon}</span>
//             {action.label}
//           </button>
//         ))}
//       </div>

//       <div className="input-container">
//         <textarea
//           ref={inputRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message or use voice command..."
//           rows="1"
//           className="message-input"
//         />

//         <div className="input-actions">
//           <button
//             className={`voice-btn ${isListening ? 'listening' : ''}`}
//             onClick={startVoiceRecognition}
//             title={isListening ? 'Stop Listening' : 'Start Voice Input'}
//           >
//             {isListening ? '🔴' : '🎤'}
//           </button>

//           <button
//             className="send-btn"
//             onClick={handleSend}
//             disabled={!input.trim()}
//             title="Send Message"
//           >
//             <RiSendPlane2Line />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InputArea;

import React, { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { VoiceRecognition } from '../services/VoiceRecognition';
import { CommandProcessor } from '../services/CommandProcessor';
import { SpeechService } from '../services/SpeechService';
import QuickActions from './QuickAction';
import MessageInput from './MessageInput';

const InputArea = ({ onSend, onResponseComplete }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { addMessage, settings, activeConversation, createNewChat } = useChat();
  const inputRef = useRef(null);

  const voiceRecognition = new VoiceRecognition(settings);
  const speechService = new SpeechService(settings);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // If no active conversation, create one
    let convId = activeConversation;
    if (!convId) {
      convId = createNewChat();
    }

    addMessage(userMessage);
    onSend?.(userMessage);

    const currentInput = input;
    setInput('');

    // Process the input and generate AI response
    setTimeout(async () => {
      const aiResponse = await CommandProcessor.processCommand(
        currentInput,
        settings,
      );

      const aiMessage = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        type: aiResponse.type,
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
      };

      addMessage(aiMessage);

      // Speak response if voice is enabled
      if (settings.autoSpeak && aiResponse.speakText) {
        speechService.speakText(aiResponse.speakText);
      }

      onResponseComplete?.();
    }, 1000);
  };

  const startVoiceRecognition = () => {
    if (!voiceRecognition.isSupported()) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    voiceRecognition.startRecognition(
      (transcript) => {
        setInput(transcript);
        setIsListening(false);

        // Auto-send after voice input
        setTimeout(() => {
          handleSend();
        }, 500);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      },
      () => setIsListening(true),
      () => setIsListening(false),
    );
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="input-area">
      <QuickActions
        onVoiceCommand={startVoiceRecognition}
        onTextCommand={handleQuickAction}
      />

      <MessageInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onVoiceClick={startVoiceRecognition}
        isListening={isListening}
        inputRef={inputRef}
      />
    </div>
  );
};

export default InputArea;
