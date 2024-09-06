import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import './fonts.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SidebarColumn from './components/sidebar/SidebarColumn';
import Chatbot from './components/chatbot/Chatbot';
import ChatbotIcon from './components/chatbot/ChatbotIcon';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './pages/Home';
import Autobiography from './pages/Autobiography';
import Hobbies from './pages/Hobbies';
import Artifacts_And_Work from './pages/Artifacts_And_Work';
import Writings from './pages/Writings';
import Writing_TheRoughDraftOfTheWebsite from './pages/Writing_TheRoughDraftOfTheWebsite';



function App() {

  AOS.init({
    once: true,
    disable: window.innerWidth < 768,
    duration: 700,
    easing: "ease-out-cubic",
  });

  const [chatbotState, setChatbotState] = useState(false);

  function toggleChatbot() {
    setChatbotState(!chatbotState);
  }

  return (
    <Router>
      <div className="sonic-beige fit-content">
        <div className="sidebar-layout d-flex">
          { /* Sidebar */}
          <SidebarColumn /> {/* Make this sidebar not show but contractable if the screen is mobile length */}

          { /* Content */}
          <div className="App-content d-flex flex-column">
            {/* Main content */}
            <div className='m-4'></div>
            <Routes>
                <Route path={"/Autobiography"} element={<Autobiography />} />
                <Route path={"/Hobbies"} element={<Hobbies />} />
                <Route path={"/Artifacts_And_Work"} element={<Artifacts_And_Work />} />
                <Route path={"/Writings"} element={<Writings />} />
                <Route path={"/Writings/the-rough-draft-of-the-website"} element={<Writing_TheRoughDraftOfTheWebsite />} />
                <Route path={"/"} element={<Home />} />
                <Route path={"/my-app"} element={<Home />} />
            </Routes>

          </div>
        </div>
        < Chatbot chatbotState={chatbotState}/>
        < ChatbotIcon chatbotState={chatbotState} toggleChatbot={toggleChatbot}/>
      </div>
    </Router>
  );
}

export default App;
