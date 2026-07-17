import React from 'react';
import michael_transparent_bw from '../pictures/michael_transparent_bw.png';


function Home() {
  return (
    <div className="App-content-stuff d-flex flex-column">
        <div className="hero-bg-portrait-wrap d-none d-md-block">
            <img
                src={michael_transparent_bw}
                alt=""
                aria-hidden="true"
                className="hero-bg-portrait"
                data-aos="fade-left"
                data-aos-delay="1600"
                data-aos-duration="1000"
            />
        </div>
        <div className="header-container d-flex flex-column justify-content-center">
            <p data-aos="zoom-in" className='headline-3-large'> Yerrrrr, my name is</p>
            <p data-aos="zoom-in" data-aos-delay="400" className='display-1-large hero-name-wrap'>
                <span className="hero-name"> Michael Chibuikem Ani</span>
            </p>
            <p data-aos="zoom-in" data-aos-delay="800" className='headline-3-small'>And yes, if it isn't obvious enough, I'm a huge Sonic fan, I wonder how you could tell...</p>
            <p data-aos="zoom-in" data-aos-delay="1200" className='headline-3-small'>I'm also a full-stack web developer (React, Bootstrap, JavaScript) with a data science edge — building everything from AI-powered tools and neural networks to full CRUD applications and automated data workflows in Python and SQL.</p>
        </div>
    </div>
  );
}

export default Home;