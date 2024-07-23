import React from 'react';
import { Link } from 'react-router-dom';

const Writings = () => {
  return (
    <div>
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Writings</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='subhead-1-large text-dark mb-5'>
                <p>Here is where I will put journal entries throughout my life and carrer. Essentially, 
                    this will just be a mini-blog. The entries I plan to write at the moment will be a 
                    reflection on my undergraduate college life and my thought process throughout blueprinting
                    this website.
                </p>
            </div>
            <div data-aos="fade-left" className='d-flex flex-column gap-4'>
              <Link to="/Writings/the-rough-draft-of-the-website" className='blog-card position-relative no-decoration'>
                  <p className='text-light headline-5-medium'>MAY 27, 2024</p>
                  <p className='headline-1-large sonic-beige-text'>The Rough Draft of the Website</p>
                  <p className='headline-5-large text-light'>My thoughts on why I started this website in the first place
                  and my progress on it so far</p>
              </Link>
            </div>
        </div>
    </div>
  )
}

export default Writings
