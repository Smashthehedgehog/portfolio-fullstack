import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import './theme.css';
import './App.css';
import './fonts.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import NavBar from './components/navbar/NavBar';
import Footer from './components/footer/Footer';
import Chatbot from './components/chatbot/Chatbot';
import ChatbotIcon from './components/chatbot/ChatbotIcon';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import Articles from './pages/Articles';
import Writing_TheRoughDraftOfTheWebsite from './pages/Writing_TheRoughDraftOfTheWebsite';
import Resume from './pages/Resume';
import Contact from './pages/Contact';



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
      <div className="sonic-beige fit-content d-flex flex-column">
        <NavBar />

        <div className="App-content d-flex flex-column">
          <div className="site-content-inner">
            <div className='m-4'></div>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"/my-app"} element={<Home />} />
                <Route path={"/about-me"} element={<AboutMe />} />
                <Route path={"/projects"} element={<Projects />} />
                <Route path={"/articles"} element={<Articles />} />
                <Route path={"/articles/the-rough-draft-of-the-website"} element={<Writing_TheRoughDraftOfTheWebsite />} />
                <Route path={"/resume"} element={<Resume />} />
                <Route path={"/contact"} element={<Contact />} />

                {/* legacy path redirects */}
                <Route path={"/Autobiography"} element={<Navigate to="/about-me" replace />} />
                <Route path={"/Artifacts_And_Work"} element={<Navigate to="/projects" replace />} />
                <Route path={"/Writings"} element={<Navigate to="/articles" replace />} />
                <Route path={"/Writings/the-rough-draft-of-the-website"} element={<Navigate to="/articles/the-rough-draft-of-the-website" replace />} />
            </Routes>
          </div>
        </div>

        <Footer />
        < Chatbot chatbotState={chatbotState}/>
        < ChatbotIcon chatbotState={chatbotState} toggleChatbot={toggleChatbot}/>
      </div>
    </Router>
  );
}

export default App;
