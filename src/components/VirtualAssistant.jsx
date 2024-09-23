import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdStop } from "react-icons/md";
import styles from "./assitant.module.css";
import backgroundImage from "../assets/img2.gif"; // Adjust the path accordingly

const greetings = ["Hello boss", "Hello sir", "Hi master"];
const music = ["audio1.mp3", "audio2.mp3", "audio3.mp3"];
const API_KEY = "37acc46646715d87002d2f94f7389db2";
const API_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

function VirtualAssistant() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [weather, setWeather] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        speakThis(result.toLowerCase());
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      alert("Your browser does not support speech recognition.");
    }
  }, [isListening]);

  useEffect(() => {
    wishMe();
  }, []);

  const wishMe = () => {
    const date = new Date();
    const hr = date.getHours();
    if (hr >= 0 && hr < 12) {
      speak("Good Morning boss");
    } else if (hr === 12) {
      speak("Good Noon boss");
    } else if (hr >= 12 && hr <= 17) {
      speak("Good Afternoon boss");
    } else {
      speak("Good Evening boss");
    }
  };

  const speakThis = (message) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = "I don't know what you said";

    if (
      message.includes("hi") ||
      message.includes("hello") ||
      message.includes("hii") ||
      message.includes("hey")
    ) {
      speech.text = greetings[Math.floor(Math.random() * greetings.length)];
    } else if (
      message.includes("how are you") ||
      message.includes("whats up")
    ) {
      speech.text = "I am fine boss tell me how can I help you";
    } else if (message.includes("reality")) {
      speech.text =
        "Wake up to reality. Nothing ever goes as planned in this world...";
    } else if (message.includes("name")) {
      speech.text = "My name is inertia";
    } else if (message.includes("play music")) {
      if (audioRef.current) {
        audioRef.current.src = `/assets/${
          music[Math.floor(Math.random() * music.length)]
        }`;
        audioRef.current.play();
      }
      speech.text = "Playing music";
    } else if (message.includes("pause music")) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      speech.text = "Music paused";
    } else if (message.includes("open google")) {
      window.open("http://google.com", "_blank");
      speech.text = "Opening Google";
    } else if (message.includes("open instagram")) {
      window.open("http://instagram.com", "_blank");
      speech.text = "Opening Instagram";
    } else if (message.includes("open youtube")) {
      window.open("http://youtube.com", "_blank");
      speech.text = "Opening YouTube";
    } else if (
      message.includes("what is") ||
      message.includes("who is") ||
      message.includes("what are") ||
      message.includes("why")
    ) {
      window.open(
        `http://google.com/search?q=${message.replace("search", "")}`,
        "_blank"
      );
      speech.text = `This is what I found on Google related to ${message}`;
    } else if (message.includes("wikipedia")) {
      window.open(
        `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`,
        "_blank"
      );
      speech.text = `Showing result for ${message.replace(
        "wikipedia",
        ""
      )} on Wikipedia`;
    } else if (message.includes("time")) {
      const time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      speech.text = time;
    } else if (message.includes("date")) {
      const date = new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
      });
      speech.text = date;
    } else if (
      message.includes("open calculator") ||
      message.includes("calculate")
    ) {
      window.open("Calculator:///");
      speech.text = "Opening calculator";
    } else if (
      message.includes("what is the temperature") ||
      message.includes("what is the weather") ||
      message.includes("temperature of") ||
      message.includes("weather of") ||
      message.includes("what is the weather of") ||
      message.includes("what is the weather in") ||
      message.includes("tell me the weather in") ||
      message.includes("tell me the weather of") ||
      message.includes("weather in") ||
      message.includes("what is the temperature in") ||
      message.includes("what is the temperature of")
    ) {
      const city = extractCityFromMessage(message);
      fetchWeather(city);
      speech.text = `Fetching weather information for ${city}`;
    } else {
      window.open(
        `http://google.com/search?q=${message.replace("search", "")}`,
        "_blank"
      );
      speech.text = `I found some information for ${message} on Google`;
    }

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // Listen for the end of the speech
    speech.onend = () => {
      stopListening(); // Stop the microphone after speech ends
    };

    window.speechSynthesis.speak(speech);
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`${API_URL}${city}&appid=${API_KEY}`);
      console.log(
        `Fetching weather for ${city} - URL: ${API_URL}${city}&appid=${API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Weather data:", data);
        setWeather(data.weather[0].description);
        setTemperature(`${Math.round(data.main.temp)}°C`);
        setHumidity(`${data.main.humidity}%`);
        setWind(`${data.wind.speed} km/h`);
      } else {
        console.error("Weather API response not OK:", response.status);
        setWeather("City not found");
        setTemperature("");
        setHumidity("");
        setWind("");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather("Sorry, I couldn't fetch the weather information.");
      setTemperature("");
      setHumidity("");
      setWind("");
    }
  };

  const extractCityFromMessage = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    const keywords = [
      "weather in",
      "in",
      "tell me  weather of",
      "tell me  weather in",
      "tell me the weather of",
      "tell me the weather in",
      "what is  weather of",
      "what is  weather in",
      "what is the weather of",
      "what is the weather in",
      "what is the temperature of",
      "what is the temperature in",
      "temperature in",
      "temperature",
      "temperature of",
      "the temperature of",
      "the temperature in",
    ];

    for (let keyword of keywords) {
      const index = lowerCaseMessage.indexOf(keyword);
      if (index !== -1) {
        const city = lowerCaseMessage.substring(index + keyword.length).trim();
        return city.charAt(0).toUpperCase() + city.slice(1); // Capitalize the city name
      }
    }

    // Default city if no valid input is found
    return "London";
  };

  const speak = (sentence) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div
      className={styles.virtualAssistantContainer}
      style={{ "--background-image": `url(${backgroundImage})` }}
    >
      <div
        className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-lg ${
          isListening ? "bg-blue-100" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Virtual Assistant</h2>
        <button
          onClick={startListening}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white flex items-center"
        >
          {isListening ? (
            <FaMicrophoneSlash className="mr-2" />
          ) : (
            <FaMicrophone className="mr-2" />
          )}
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        {isListening && (
          <button
            onClick={stopListening}
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg text-white flex items-center"
          >
            <MdStop className="mr-2" />
            Stop Listening
          </button>
        )}
        <div className="mt-4 text-lg">
          {weather && <p>Weather: {weather}</p>}
          {temperature && <p>Temperature: {temperature}</p>}
          {humidity && <p>Humidity: {humidity}</p>}
          {wind && <p>Wind Speed: {wind}</p>}
        </div>
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}

export default VirtualAssistant;
