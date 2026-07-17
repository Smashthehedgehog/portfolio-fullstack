import React from 'react';
import michael_about from '../pictures/michael_about.jpg';


function Home() {
  return (
    <div className="App-content-stuff d-flex flex-column">
        <div className="header-container d-flex flex-column justify-content-center">
            <p data-aos="zoom-in" className='headline-3-large'> Hello, my name is</p>
            <p data-aos="zoom-in" data-aos-delay="400" className='display-1-large sonic-blue-text'> Michael Chibuikem Ani</p>
            <p data-aos="zoom-in" data-aos-delay="800" className='headline-3-small'> A mathematician, musician, gamer, exercise enthusiast, and your company's next
            influential Software Engineer</p>
        </div>
        <div className='m-4'></div>
        <p data-aos="fade-left" className='display-3-large sonic-blue-text'>What do I do?</p>
        <div data-aos="fade-left" className='topic-line sonic-red'></div>
        <div data-aos="fade-left" className='body-container row g-2 mb-5'>
            <div className="col-md-7 col-12">
            <p className='subhead-1-large text-dark'>I specialize in web development using multiple frameworks such as React and Bootstrap, which require 
                an extensive understanding of CSS, HTML, and JavaScript. My expertise is not limited to web development; I am also proficient in coding 
                languages focused on maintenance, such as Java, and data analysis using tools and techniques in Python, R, and MATLAB. I am also proficient
                in handling databases through SQL queries and Microsoft Excel.</p>
            </div>
            <div className="col-md-5 col-12 justify-content-center align-items-center d-flex">
            <img className='content-image' src={michael_about} width={'230rem'} height={'230rem'} alt="Michael Ani" />
            </div>
        </div>
    </div>
  );
}

export default Home;