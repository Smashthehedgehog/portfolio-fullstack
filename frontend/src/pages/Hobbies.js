import React from "react";
import CarouselSlide from '../components/carousel_slide/CarouselSlide';
import musescore_ego from '../pictures/musescore_ego.jpg';
import musescore_goodbye from '../pictures/musescore_goodbye.jpg';
import musescore_liveyourlife from '../pictures/musescore_liveyourlife.jpg';
import videogames_sonic from '../pictures/videogames_sonic.jpg';
import videogames_xenoblade from '../pictures/videogames_xenoblade.jpg';
import videogames_ssbb from '../pictures/videogames_ssbb.jpg';
import videogames_tales from '../pictures/videogames_tales.jpg';
import videogames_ys from '../pictures/videogames_ys.jpg';
import videogames_mandl from '../pictures/videogames_mandl.jpg';
import videogames_zelda from '../pictures/videogames_zelda.jpg';
import trails_of_cold_steel_two from '../pictures/trails_of_cold_steel_two.jpg';

const musescore_image_set = [musescore_ego, musescore_goodbye, musescore_liveyourlife];
const videogame_image_set = [videogames_sonic, videogames_xenoblade, videogames_ssbb, videogames_tales, videogames_zelda, videogames_ys, videogames_mandl];

const Hobbies = () => {
    return (
        <div className="App-content-stuff d-flex flex-column">
            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Music Notation</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='subhead-1-large text-dark mb-5'>
                <p>I first tried my knack at music notation way back
                in 2015. For context, I was in marching band in middle school, and I wanted to make some 
                sheet music for my band to play. I was a huge fan of Ace Attorney, so I tried to notate one of the 
                songs from Ace Attorney Investigations 2 &#40;which unfortunately is still unlocalized so officially
                it is known as Gyakuten Kenji 2&#41;. I made this sheet music on Noteflight, and safe to say it is clear
                that I lacked a LOT of experience back then.</p>
                <div className="align-items-center d-flex justify-content-center subhead-1-large mb-3">
                    <a href='https://www.noteflight.com/scores/view/8d83a57f00d7017dba5d3824a27c20580ffd31f9' target='_blank' className="pill-button no-decoration text-dark"> Click Here to listen to such an atrocity!</a>
                </div>
                <p>From there, I started using Musescore to attempt to notate sheet music but 
                to no coheret avail. Thus, I took a break from music notation for a while, as come high school, my interests 
                transfered from music to sports. Then in late 2019, I got the urge to go back into Musescore just from sheet music that I've
                seen people create, and never looked back. For the past 4 years &#40;though on and off&#41; I've been notating sheet music from
                songs in a concert band arrangement. Here are some examples of what I've done. </p>
                <div className="justify-content-center d-flex">
                    <div className="sonic-card mb-4">
                        <CarouselSlide imageURLs={musescore_image_set} />
                    </div>
                </div>
                <p>As of May 2024, I decided that I needed to start putting this talent to more use.
                Therefore, I created a Fiverr gig off of it. Check it out here! </p>
                <div className="align-items-center d-flex justify-content-center subhead-1-large mb-3">
                    <a href='https://www.fiverr.com/michael_ani_62/write-sheet-music-for-any-song-of-your-choice-as-a-concert-band-cover?context_referrer=search_gigs&source=top-bar&ref_ctx_id=34fb1c5b630d42fa836f85489f7d4f7e&pckg_id=1&pos=34&context_type=auto&funnel=34fb1c5b630d42fa836f85489f7d4f7e&imp_id=c75f95cf-6408-4afe-980f-92928e9a4634' target='_blank' className="pill-button no-decoration text-dark"> Click Here to go to the Fiverr gig!</a>
                </div>
            </div>

            <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Video Games</p>
            <div data-aos="fade-left" className='topic-line sonic-red'></div>
            <div data-aos="fade-left" className='subhead-1-large text-dark mb-5'>
                <p>Throughout my life, I've played many, and I mean many, video games. From the ones you would expect like
                    2K and Madden, to obscure, unheard of ones like Xenoblade Chronicles X. As I mentioned before, I basically came out 
                    the womb on Sonic Heroes, so my first video game system was a GameCube. Since then, I've owned a Gameboy, a Playstation, 
                    a Nintendo DS, Wii, 3DS, Wii U, Xbox One, and a Switch. Along the line, I've played on other systems as well, playing more
                    and more games along the way. My favorite one always swaps between Sonic Unleashed and Xenoblade Chronicles 2, as those are fantastic
                    games worth their own weight. Here is a slideshow of some of my favorite video games of all time!
                </p>
                <div className="justify-content-center d-flex">
                    <div className="sonic-card mb-4">
                        <CarouselSlide imageURLs={videogame_image_set} />
                    </div>
                </div>
                <p>If there is a certain type of games I really like, those are story-based video games, or ones with a beginning and an end more than
                    just sandbox video games. As such, I've been playing through many of those type of games. Currently, this is the video game I'm on:
                </p>
                <div className="justify-content-center d-flex">
                    <div className="sonic-card w-75 mb-4">
                        <img src={trails_of_cold_steel_two} className="object-fit-cover w-100 h-100 d-block"/>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default Hobbies;