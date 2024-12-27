import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import News from "./components/News";
import "./App.css";
import GlobalNews from "./components/GlobalNews";

const App = () => {
  const [isActivityEnabled, setIsActivityEnabled] = useState(true);

  const handleActivityChange = (status) => {
    setIsActivityEnabled(status);
  };

  return (
    <Router>
      <div className=" background-animation">
        <div className=""></div>
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
