import React from "react";
import ImageCarousel from '../components/image_carousel/ImageCarousel';
import nigeria from '../pictures/nigeria.jpg';
import sonic_heroes from '../pictures/sonic_heroes.jpg';
import sonic_x from '../pictures/sonic_x.jpg';
import date_academy from '../pictures/date_academy.jpg';
import ib_logo from '../pictures/ib_logo.jpg';
import tucker_high_school from '../pictures/tucker_high_school.jpg';
import mike_football from '../pictures/mike_football.jpg';
import ga_tech_logo from '../pictures/ga_tech_logo.jpg';
import peeps from '../pictures/peeps.jpg';
import mike_alpha from '../pictures/mike_alpha.jpg';
import stepshow from '../pictures/stepshow.jpg';
import grad from '../pictures/grad.jpg';

const image_set_1 = [nigeria, sonic_heroes, sonic_x, date_academy];
const image_set_2 = [ib_logo, tucker_high_school, mike_football, ga_tech_logo];
const image_set_3 = [peeps, mike_alpha, stepshow, grad];

// NOTE: SPECIFY THAT POSITION IS RELATIVE IN PARENT DIV!!
// D-FLEX DOES NOT AUTOMATICALLY MEAN POSITION RELATIVE

const Autobiography = () => {
    return (
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Early Days</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='body-container row g-2 mb-5'>
                <div className="col-md-7 col-12">
                <p className='subhead-1-large text-dark'>I was born in the state of Georgia, but
                my parents both immigrated here from Nigeria to ensure that I have the best chance
                of success possible. Out the jump, I've always been a huge fan of Sonic, as my first 
                video game was Sonic Heroes and my first television show was Sonic X.  As a matter of
                fact, this website was made using Sonic's colors as a template. I also went to several 
                elementary schools, such as Midway Elementary and Ivy Prep &#40;which I did not like&#41; 
                before landing in D.A.T.E Academy from 5<sup>th</sup> to 8<sup>th</sup> grade.</p>
                </div>
                <div className="col-md-5 col-12 d-flex">
                    <ImageCarousel images = {image_set_1} />
                </div>
            </div>
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Years of Adolescense</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='body-container row g-2 mb-5'>
                <div className="col-md-7 col-12">
                <p className='subhead-1-large text-dark'>One of my mentors and the most influential teacher
                in my life, Dr. Porter, suggested that I go to Tucker High School and take on its rigorous
                IB program, which I did. I believe that really helped shape my abilities, especially heading
                towards college. But in the meantime, I also played football all 4 years of highschool, which
                built in my drive for exercise and my desire to become the strongest person I can be, not only
                physically, but mentally as well. From there, I ended up admitted to Georgia Tech with a full
                ride scholarship.</p>
                </div>
                <div className="col-md-5 col-12 d-flex">
                    <ImageCarousel images = {image_set_2} />
                </div>
            </div>
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>College and Beyond &#40;soon&#41;</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='body-container row g-2 mb-5'>
                <div className="col-md-7 col-12">
                <p className='subhead-1-large text-dark'>College life was some of the most fun I've ever had. From
                making new friends to learning about my love for coding, I made a lot of experiences and grew
                substantially as a person. I even became a member of Alpha Phi Alpha Fraternity, Inc., surronding myself
                with brothers who desire to put in the same level of work and effort that I do. Due to the massive influx of
                Computer Science majors at Tech, I wasn't able to switch my major, but I did get a minor and still graduated in
                four years. Now as my undergraduate life is coming to a close, I hope to continue my work ethic and strive in wherever
                God leads me next.</p>
                </div>
                <div className="col-md-5 col-12 d-flex">
                    <ImageCarousel images = {image_set_3} />
                </div>
            </div>
        </div>
    );
};
 
export default Autobiography;