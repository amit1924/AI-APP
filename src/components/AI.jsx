import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import './chat.css';
import { BsMic, BsMicMute, BsImage, BsNewspaper } from 'react-icons/bs';
import { FaStop, FaRobot, FaUser, FaRegSun, FaSearch } from 'react-icons/fa';
import { IoMdSend, IoMdTime } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { MdClearAll, MdLanguage, MdWbSunny } from 'react-icons/md';
import { RiChatSmile3Line } from 'react-icons/ri';

const AI = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const [context, setContext] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDefaultMessage, setShowDefaultMessage] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [isSpeechInput, setIsSpeechInput] = useState(false);
  const AIContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const userScrolledUp = useRef(false);
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [wind, setWind] = useState('');
  const [city, setCity] = useState('');
  const [isImageFLash, setIsImageFLash] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    setShowDefaultMessage(!(storedMessages && storedMessages.length > 0));
  }, []);

  const API_URL =
    'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `${API_URL}${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`,
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Weather data:', data);
        const weatherDescription = data.weather[0].description;
        const temp = Math.round(data.main.temp);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const weatherMessage = `## Weather Report for ${data.name}\n\n**Current Conditions:** ${weatherDescription}\n\n**Temperature:** ${temp}°C\n**Humidity:** ${humidity}%\n**Wind Speed:** ${windSpeed} km/h\n\n*Data provided by OpenWeatherMap*`;
        speakText(weatherMessage.replace(/[#*\-`]/g, ''));

        setMessages((prev) => [
          ...prev,
          { sender: 'ai', type: 'text', content: weatherMessage },
        ]);

        setWeather(weatherDescription);
        setTemperature(`${temp}°C`);
        setHumidity(`${humidity}%`);
        setWind(`${windSpeed} km/h`);
      } else {
        console.error('Weather API response not OK:', response.status);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content:
              '**City not found**\n\nPlease check the city name and try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          type: 'text',
          content:
            "## Error\n\n**Sorry, I couldn't fetch the weather information.**\n\nPlease check your internet connection and try again.",
        },
      ]);
    }
  };

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsSpeechInput(true);

        setTimeout(async () => {
          const cityRegex = /weather in (\w+)/i;
          const match = transcript.match(cityRegex);

          if (match && match[1]) {
            const city = match[1];
            await fetchWeather(city);
          } else {
            await handleSend();
          }
        }, 100);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onstart = () => {
        setIsFlashing(true);
      };

      recognitionRef.current.onend = () => {
        setIsFlashing(false);
      };
    } else {
      alert('Your browser does not support speech recognition.');
    }
  }, [language]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchAIResponse = async (message) => {
    setLoading(true);

    try {
      const shouldIncludeTemperature =
        message.toLowerCase().includes('weather') ||
        message.toLowerCase().includes('temperature') ||
        message.toLowerCase().includes('weather of') ||
        message.toLowerCase().includes('temperature of') ||
        message.toLowerCase().includes('weather in') ||
        message.toLowerCase().includes('temperature in');

      let finalPrompt = message;

      if (shouldIncludeTemperature) {
        finalPrompt = `${message}. The temperature is ${temperature}.`;
      }

      if (Object.keys(context).length > 0) {
        finalPrompt = `${finalPrompt} Context: ${Object.values(context).join(
          ', ',
        )}`;
      }

      // Enhanced prompt for better formatting
      const formattedPrompt = `Please provide a well-structured response for: "${finalPrompt}". 
      Use headings (## for main headings, ### for subheadings), **bold text** for important points, 
      bullet points (- item) for lists, numbered lists (1. item), and proper paragraphs. Make it visually appealing and easy to read.`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(formattedPrompt)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiResponse = await response.text();
      console.log(`aiResponse: ${aiResponse}`);

      const cleanedResponse = sanitizeText(aiResponse);
      speakText(cleanedResponse.replace(/[#*\-`]/g, '')); // Remove formatting for speech

      if (messages.length > 0) {
        setShowDefaultMessage(false);
      }

      const keywords = aiResponse.match(/([A-Z][a-z]+ [A-Z][a-z]+)/g);
      if (keywords) {
        setContext((prevContext) => ({ ...prevContext, ...keywords }));
      }

      return aiResponse;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return '## Hello! 👋\n\n**I am here to help!** \n\nHow can I assist you today?';
    } finally {
      setLoading(false);
    }
  };

  const sanitizeText = (text) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  const cityRegex =
    /(weather in|weather of|temperature in|temperature of)\s+([\w\s]+)/i;

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', type: 'text', content: input },
    ]);
    setShowDefaultMessage(false);

    const dateRegex =
      /(?:what is the date|what time is it|what is the time|what is the time now|tell me the date|what is the day today|tell me the time)/i;
    const matchDate = input.match(dateRegex);
    const command = input.toLowerCase();

    if (matchDate) {
      const now = new Date();
      const dayIndex = now.getDay();
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayName = daysOfWeek[dayIndex];
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const dateResponse = `## 📅 Current Date & Time\n\n**Day:** ${dayName}\n**Date:** ${date}\n**Time:** ${time}\n\n*Hope you're having a great ${dayName}!*`;
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', type: 'text', content: dateResponse },
      ]);
      speakText(
        `Today is ${dayName}, date is ${date}, and the time is ${time}`,
      );
    } else if (command.includes('generate an image')) {
      const prompt = command.replace('generate image', '').trim();
      const width = 512;
      const height = 512;
      const seed = Math.floor(Math.random() * 1000);
      const model = 'default';
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
        prompt,
      )}?width=${width}&height=${height}&seed=${seed}&model=${model}`;
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', type: 'image', content: imageUrl },
      ]);
      setIsImageFLash(true);
      setTimeout(() => setIsImageFLash(false), 4000);
      speakText(`Generating image sir please wait...`);
    } else if (
      command.includes('tell me the latest news') ||
      command.includes('tell me latest news')
    ) {
      const newsArticles = navigate('/gnews');
      speakText(`opening latest news sir: ${newsArticles}`);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          type: 'text',
          content: `## 📰 Latest News\n\n**Here are the latest news articles:**\n\n- Breaking news updates\n- Current events coverage\n- Trending stories\n\n*Click below to explore more news*`,
        },
        { sender: 'ai', type: 'news', content: newsArticles },
      ]);
    } else if (command.startsWith('search location')) {
      const location = command.slice(15).trim();
      if (location) {
        const mapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(
          location,
        )}`;
        window.open(mapsUrl, '_blank');
        speakText(`Opening google maps for: ${location}`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content: `## 🗺️ Location Search\n\n**Searching for:** ${location}\n\n- Opening Google Maps\n- Showing nearby places\n- Providing directions\n\n*Location search completed*`,
          },
        ]);
      } else {
        speakText(`Please specify a location to search for`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content:
              '## ❗ Missing Information\n\n**Please specify a location to search for.**\n\nExample: "search location Paris"',
          },
        ]);
      }
    } else if (command.includes('play song of')) {
      const songName = command.replace('play song of', '').trim();
      const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(
        songName,
      )}`;
      window.open(searchUrl, '_blank');
      speakText(`Playing ${songName} on Spotify, sir...`);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          type: 'text',
          content: `## 🎵 Music Player\n\n**Now Playing:** ${songName}\n\n- Opening Spotify\n- Searching for track\n- Starting playback\n\n*Enjoy your music!*`,
        },
      ]);
    } else if (command.startsWith('search image of')) {
      const searchQuery = command.replace('search image of', '').trim();
      const imageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
        searchQuery,
      )}`;
      window.open(imageUrl, '_blank');
      speakText(`Searching images for ${searchQuery}, sir...`);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          type: 'text',
          content: `## 🖼️ Image Search\n\n**Searching for:** ${searchQuery}\n\n- Browsing image database\n- Filtering results\n- Displaying relevant images\n\n*Image search completed*`,
        },
      ]);
    } else if (command.startsWith('search for')) {
      const searchQuery = command.slice(10).trim();
      console.log('Search query extracted:', searchQuery);
      if (searchQuery) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(
          searchQuery,
        )}`;
        console.log(`Opening Google search URL: ${url}`);
        window.open(url, '_blank');
        speakText(`Opening ${searchQuery} on Google, sir...`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content: `## 🔍 Web Search\n\n**Searching for:** ${searchQuery}\n\n- Querying search engines\n- Analyzing results\n- Presenting information\n\n*Search completed successfully*`,
          },
        ]);
      } else {
        console.log('No search query found.');
        speakText(`Please specify what you want to search for.`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content:
              '## ❗ Search Error\n\n**Please specify what you want to search for.**\n\nExample: "search for artificial intelligence"',
          },
        ]);
      }
    } else if (command.includes('open ')) {
      const appName = command.split('open ')[1].trim();
      const apps = {
        notepad: 'C:\\Windows\\system32\\notepad.exe',
        calculator: 'C:\\Windows\\system32\\calc.exe',
      };
      if (apps[appName]) {
        speakText(`Opening ${appName}, sir...`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content: `## 🚀 Application Launch\n\n**Opening:** ${appName}\n\n- Starting application\n- Loading interface\n- Ready for use\n\n*Application launched successfully*`,
          },
        ]);
      } else if (command.includes('song')) {
        const songName = appName;
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
          songName,
        )}`;
        window.open(searchUrl, '_blank');
        speakText(`Opening ${songName} on YouTube, sir...`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content: `## 📺 YouTube Search\n\n**Searching for:** ${songName}\n\n- Browsing YouTube\n- Finding videos\n- Preparing playback\n\n*YouTube search completed*`,
          },
        ]);
      } else {
        let site = appName;
        if (!site.startsWith('http')) {
          if (!site.startsWith('www.')) site = 'www.' + site;
          site += '.com';
        }
        window.open('http://' + site, '_blank');
        speakText(`Opening ${site.split('.')[1]}, sir...`);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            type: 'text',
            content: `## 🌐 Website Launch\n\n**Opening:** ${site}\n\n- Connecting to server\n- Loading webpage\n- Displaying content\n\n*Website loaded successfully*`,
          },
        ]);
      }
    } else {
      const match = input.match(cityRegex);
      setLoading(true);
      if (match && match[2]) {
        const city = match[2].trim();
        await fetchWeather(city);
        setLoading(false);
      } else {
        const aiResponse = await fetchAIResponse(input);
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', type: 'text', content: aiResponse },
        ]);
      }
    }

    setInput('');
    setIsSpeechInput(false);
  };

  const formatContent = (content, sender) => {
    if (sender === 'user') {
      return <div className="text-sm whitespace-pre-wrap">{content}</div>;
    }

    // Process AI responses with rich formatting
    let formattedContent = content;

    // Replace markdown-like syntax with HTML elements
    formattedContent = formattedContent
      // Headers (## Heading -> <h2>)
      .replace(
        /##\s+(.+)/g,
        '<h2 class="text-xl font-bold text-purple-300 mb-2">$1</h2>',
      )
      // Subheaders (### Subheading -> <h3>)
      .replace(
        /###\s+(.+)/g,
        '<h3 class="text-lg font-semibold text-blue-300 mb-2">$1</h3>',
      )
      // Bold text (**bold** -> <strong>)
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-bold text-yellow-300">$1</strong>',
      )
      // Italic text (*italic* -> <em>)
      .replace(/\*(.*?)\*/g, '<em class="italic text-green-300">$1</em>')
      // Bullet points (- item -> <li>)
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-cyan-300 mb-1">• $1</li>')
      // Numbered lists (1. item -> <li>)
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-cyan-300 mb-1">$1</li>')
      // Code blocks (```code``` -> <code>)
      .replace(
        /```([^`]+)```/g,
        '<code class="bg-gray-900 text-green-400 px-2 py-1 rounded text-sm font-mono">$1</code>',
      )
      // Line breaks
      .replace(/\n/g, '<br/>');

    // Split content into paragraphs and wrap each
    const paragraphs = formattedContent.split('<br/><br/>');

    return (
      <div className="ai-response space-y-3">
        {paragraphs.map((paragraph, pIndex) => (
          <div
            key={pIndex}
            className="text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </div>
    );
  };

  const renderMessages = () => {
    return messages.map((msg, index) => {
      if (msg.type === 'image') {
        return (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4 message-enter`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
                msg.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-900 text-white'
              } ${isImageFLash ? 'animate-pulse' : ''}`}
            >
              <a href={msg.content} download={`image-${index}.png`}>
                <img
                  src={msg.content}
                  alt="Generated"
                  className="rounded-lg w-full h-auto"
                />
              </a>
            </div>
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4 message-enter`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-2xl ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              >
                {msg.sender === 'user' ? (
                  <FaUser className="text-white text-sm" />
                ) : (
                  <FaRobot className="text-white text-sm" />
                )}
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  msg.sender === 'user'
                    ? ' text-white rounded-br-none font-bold text-5xl'
                    : '  text-white rounded-bl-none font-bold text-5xl'
                } shadow-lg`}
              >
                {formatContent(msg.content, msg.sender)}
              </div>
            </div>
          </div>
        );
      }
    });
  };

  useEffect(() => {
    if (isSpeechInput && input.trim() !== '') {
      handleSend();
    }
  }, [input, isSpeechInput]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support speech synthesis.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour < 12) greeting = 'Good morning';
    else if (currentHour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    const message = `${greeting}, I am your AI Assistant. I can generate image and can answer about your all queries`;
    speakText(message);
  }, []);

  const clearChatFunction = () => {
    localStorage.removeItem('messages');
    setMessages([]);
    setShowDefaultMessage(true);
  };

  const quickActions = [
    {
      icon: <BsMic className="text-lg" />,
      label: 'Voice Command',
      action: startListening,
    },
    {
      icon: <BsImage className="text-lg" />,
      label: 'Generate Image',
      prompt: 'generate an image of',
    },
    {
      icon: <BsNewspaper className="text-lg" />,
      label: 'Latest News',
      prompt: 'tell me the latest news',
    },
    {
      icon: <MdWbSunny className="text-lg" />,
      label: 'Weather',
      prompt: 'weather in',
    },
    {
      icon: <FaSearch className="text-lg" />,
      label: 'Search Web',
      prompt: 'search for',
    },
    {
      icon: <IoMdTime className="text-lg" />,
      label: 'Current Time',
      prompt: 'what time is it',
    },
  ];

  const handleQuickAction = (action) => {
    if (action.prompt) {
      setInput(action.prompt + ' ');
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`min-h-screen fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <RiChatSmile3Line className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <p className="text-gray-400 text-sm">Always here to help</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-400 text-sm font-semibold uppercase">
              Quick Actions
            </h3>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4">
              Settings
            </h3>
            <div className="space-y-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi (India)</option>
              </select>

              <button
                onClick={clearChatFunction}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
              >
                <MdClearAll className="text-lg" />
                <span>Clear AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-white p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              <FaRegSun className="text-lg" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isSpeaking && (
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Speaking</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* AI Messages */}
        <div className="flex-1 overflow-hidden">
          <div ref={chatContainerRef} className="h-full overflow-y-auto p-4">
            {showDefaultMessage && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                  <RiChatSmile3Line className="text-white text-4xl" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Hello! I'm your{' '}
                  <span className="text-transparent bg-clip-text bg-gray-900">
                    AI Assistant
                  </span>
                </h1>
                <p className="text-gray-300 text-lg max-w-md">
                  Ask me anything, generate images, get weather updates, search
                  the web, and much more!
                </p>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              {renderMessages()}

              {loading && (
                <div className="flex justify-start items-center py-4">
                  <div className="flex items-center space-x-3 bg-gray-800 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <FaRobot className="text-white text-sm" />
                    </div>
                    <div className="typing-indicator flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setIsSpeechInput(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSend();
                    }
                  }}
                  placeholder="Type your message or use voice command..."
                  className="w-full p-4 pr-12 rounded-xl bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  {isFlashing ? (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  ) : null}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={startListening}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isFlashing
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white`}
                  title="Start Voice Input"
                >
                  {isFlashing ? (
                    <BsMicMute className="text-lg" />
                  ) : (
                    <BsMic className="text-lg" />
                  )}
                </button>

                <button
                  onClick={handleSend}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-all duration-200"
                  title="Send Message"
                >
                  <IoMdSend className="text-lg" />
                </button>

                <button
                  onClick={stopSpeaking}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isSpeaking
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } text-white`}
                  title={isSpeaking ? 'Stop Speaking' : 'Stop AI Voice'}
                >
                  <FaStop className="text-lg" />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AI;
