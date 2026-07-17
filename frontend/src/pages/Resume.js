import React from 'react';

const Resume = () => {
    return (
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>My Resume</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='d-flex justify-content-center mb-4'>
                <a href="/MichaelAni_Resume.pdf" download className='btn-cta no-decoration'>
                    <i className="bi bi-download me-2"></i> Download Resume
                </a>
            </div>
            <div data-aos="fade-left" className='d-flex justify-content-center'>
                <div className='resume-preview-frame mb-5'>
                    <iframe src="/MichaelAni_Resume.pdf" title="Michael Ani Resume" className='resume-embed'></iframe>
                </div>
            </div>
        </div>
    );
};

export default Resume;
