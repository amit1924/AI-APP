import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import News from "./components/News";
import "./App.css"; // Import the CSS file for background animation
import GlobalNews from "./components/GlobalNews";

const App = () => {
  const [isActivityEnabled, setIsActivityEnabled] = useState(true);

  const handleActivityChange = (status) => {
    setIsActivityEnabled(status);
  };

  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="background-animation"></div>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/news" element={<News />} />
          <Route path="/gnews" element={<GlobalNews />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
