import React from 'react';
import './Resume.css';

const Resume = () => {
    return (
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>My Resume</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <a
                href="/MichaelAni_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className='btn-cta resume-mobile-link d-md-none mb-4'
            >
                Open Resume PDF
            </a>
            <div data-aos="fade-left" className='resume-preview-frame mb-5'>
                <iframe src="/MichaelAni_Resume.pdf" title="Michael Ani Resume" className='resume-embed'></iframe>
            </div>
        </div>
    );
};

export default Resume;
