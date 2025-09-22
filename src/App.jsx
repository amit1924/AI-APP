// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Chat from './components/Chat';
// import News from './components/News';
// import './App.css';
// import GlobalNews from './components/GlobalNews';
// import AI from './components/AI';

// const App = () => {
//   const [isActivityEnabled, setIsActivityEnabled] = useState(true);

//   const handleActivityChange = (status) => {
//     setIsActivityEnabled(status);
//   };

//   return (
//     <Router>
//       <div className="bg-gray-900 min-h-screen">
//         <div className=""></div>
//         <Routes>
//           <Route path="/chat" element={<Chat />} />
//           <Route path="/" element={<AI />} />
//           <Route path="/news" element={<News />} />
//           <Route path="/gnews" element={<GlobalNews />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIChat from './page/AIChat';
import News from './page/News';
import Settings from './page/Settings';
import { ChatProvider } from './context/ChatContext';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AIChat />} />
            <Route path="/news" element={<News />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
