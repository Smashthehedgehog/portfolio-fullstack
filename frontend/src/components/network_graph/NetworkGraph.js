import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import ForceGraph3D from "react-force-graph-3d";
import axios from 'axios';
import Modal from "../modal/Modal";
import CarouselSlide from "../carousel_slide/CarouselSlide";
import './NetworkGraph.css';

import about_mike from '../../pictures/about_mike.png';
import ga_tech_logo from '../../pictures/ga_tech_logo.jpg';
import powerlifting from '../../pictures/powerlifting.png';
import mike_alpha from '../../pictures/mike_alpha.jpg';
import nigeria from '../../pictures/nigeria.jpg';
import saxophone from '../../pictures/saxophone.png';
import sonic from '../../pictures/sonic.png';
import video_game from '../../pictures/video_game.png';
import musescore_ego from '../../pictures/musescore_ego.jpg';
import musescore_goodbye from '../../pictures/musescore_goodbye.jpg';
import musescore_liveyourlife from '../../pictures/musescore_liveyourlife.jpg';

const musescore_image_set = [musescore_ego, musescore_goodbye, musescore_liveyourlife];

const CENTER_NODE_ID = 'center';
const CENTER_SPRITE_PX = 140;
const SATELLITE_SPRITE_PX = 70;
const COLOR_AMBER = '#f19b00';
const COLOR_BLUE = '#3061e3';

const PLACEHOLDER_BODY = 'Placeholder text — details coming soon.';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://u7uk2ych80.execute-api.us-east-1.amazonaws.com';

function GameCarouselSlot({ loading, images }) {
    if (loading) {
        return <div className="d-flex justify-content-center align-items-center w-100 h-100 p-5">Loading games...</div>;
    }
    return images.length > 0 ? <CarouselSlide imageURLs={images} /> : null;
}

function VideoGamesContent() {
    const [completedGames, setCompletedGames] = useState([]);
    const [playingGames, setPlayingGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/backloggd-games`)
            .then(res => {
                setCompletedGames(res.data.completed.map(path => `${API_BASE}${path}`));
                setPlayingGames(res.data.playing.map(path => `${API_BASE}${path}`));
            })
            .catch(err => console.error('Failed to load Backloggd games:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>Throughout my life, I've played many, and I mean many, video games. From the ones you would expect like
                2K and Madden, to obscure, unheard of ones like Xenoblade Chronicles X. As I mentioned before, I basically came out
                the womb on Sonic Heroes, so my first video game system was a GameCube. Since then, I've owned a Gameboy, a Playstation,
                a Nintendo DS, Wii, 3DS, Wii U, Xbox One, and a Switch. Along the line, I've played on other systems as well, playing more
                and more games along the way. My favorite one always swaps between Sonic Unleashed and Xenoblade Chronicles 2, as those are fantastic
                games worth their own weight. Here is a slideshow of 10 completely random video games, pulled dynamically from my Backloggd account through an API call I created.
            </p>
            <div className="justify-content-center d-flex">
                <div className="sonic-card-no-link mb-4">
                    <GameCarouselSlot loading={loading} images={completedGames} />
                </div>
            </div>
            <p>If there is a certain type of games I really like, those are story-based video games, or ones with a beginning and an end more than
                just sandbox video games. As such, I've been playing through many of those type of games. The video game(s) below are the ones I am currently playing (and yes, this is also pulled directly from Backloggd so
                I wouldn't have to keep manually updating this page).:
            </p>
            <div className="justify-content-center d-flex">
                <div className="sonic-card-no-link w-75 mb-4">
                    <GameCarouselSlot loading={loading} images={playingGames} />
                </div>
            </div>
        </div>
    );
}

function PlaceholderContent() {
    return <p className="body-1-large">{PLACEHOLDER_BODY}</p>;
}

function MusicContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>I first tried my knack at music notation way back
            in 2015. For context, I was in marching band in middle school, playing mny saxophone since I was in 5th grade. I wanted to make some
            sheet music for my band to play. I was a huge fan of Ace Attorney, so I tried to notate one of the
            songs from Ace Attorney Investigations 2 &#40;which unfortunately is still unlocalized so officially
            it is known as Gyakuten Kenji 2&#41;. I made this sheet music on Noteflight, and safe to say it is clear
            that I lacked a LOT of experience back then.</p>
            <div className="align-items-center d-flex justify-content-center subhead-1-large mb-3">
                <a href='https://www.noteflight.com/scores/view/8d83a57f00d7017dba5d3824a27c20580ffd31f9' target='_blank' className="pill-button no-decoration text-dark"> Click here to listen to such an atrocity!</a>
            </div>
            <p>From there, I started using Musescore to attempt to notate sheet music but
            to no coheret avail. Thus, I took a break from music notation for a while, as come high school, my interests
            transfered from music to sports. Then in late 2019, I got the urge to go back into Musescore just from sheet music that I've
            seen people create, and never looked back. For the past 4 years &#40;though on and off&#41; I've been notating sheet music from
            songs in a concert band arrangement. Here are some examples of what I've done. </p>
            <div className="justify-content-center d-flex">
                <div className="sonic-card-no-link mb-4">
                    <CarouselSlide imageURLs={musescore_image_set} />
                </div>
            </div>
            <p>As a matter of fact, let's play something nice. Here is one of my personal favorite notations:</p>
            <div className="align-items-center d-flex justify-content-center subhead-1-large mb-3">
                <a href='https://musescore.com/user/2749681/scores/35774384?share=copy_link' target='_blank' className="pill-button no-decoration text-dark"> Click here to listen to some gas!</a>
            </div>
        </div>
    );
}

function SonicContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>I essentially came out the womb as a Sonic fan. The very first anime/TV show I ever watched was Sonic X,
                and my first video game was Sonic Heroes. From that, I'd always been caught up with Sonic related content,
                whether it be fan animations such as Nazo Unleashed, custom sprite series such as 'Sonic Shadow and Silver Show'
                and other variations of that specific style (if you know you know), comics such as the Archie comics, where Sonic
                is insanely OP, and the current IDW comics, and of course the video games. Fun fact, my favorite song of all time
                is 'Endless Possibilities' from Sonic Unleashed. I remember when I got the Wii version of the game thinking it would
                be the same as the PS3 version. Well boy was I wrong! All in all I've been around for the ups and downs of the Sonic
                series since the mid 2000s, and I hope that the series gets back on track once again (AKA BRING THE UNLEASHED BOOST
                FORMULA BACK SEGA).
            </p>
        </div>
    );
}

function NigeriaContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>So I was born and raised in the States, but my parents are both Nigerian from the Igbo tribe. Thus, I am also Igbo. Now
                do I speak the language? For now...no, but I can (kind of) understand it. My dad is from Enugu state, while my mom is from
                Abia state. I can't lie these genes are fantastic!
            </p>
        </div>
    );
}

function PowerliftingContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>Since high school, I've been keeping up with my progress in the gym and improving my general lifts, but I didn't start
                deadlifting until late 2023. After college, I would just keep up with all of my compound lifts until I decided to start
                powerlifting in August 2025. Since then, the sport has had its ups and downs. My biggest up so far, destroying the State
                Championships! My biggest down? My performance in Nationals. I've been lifting in the USAPL federation since I started, as
                it was more beginner friendly, but who knows? Maybe I'll switch to PA since it's more competitve there. Here are my current PRs:
            </p>
            <ul>
                <li>Squat: 606 lbs</li>
                <li>Bench: 402 lbs</li>
                <li>Deadlift: 772 lbs</li>
            </ul>
        </div>
    );
}

function APhiAContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>I crossed Alpha Phi Alpha Fraternity, Inc. through the Nu Mu Chapter seated in Georgia Institute of
                Technology in Spring 2023 as the Big 10 in a line of 13. Since then, I've made plenty of fantastic connections with other brothers or
                through other brothers. Crossing is definitely one of the best things I've done at Tech.
            </p>
        </div>
    );
}

function TechAndCodingContent() {
    return (
        <div className="subhead-1-large text-dark mb-5">
            <p>I remember getting my acceptance letter into Georgia Tech in January of 2020, and honestly, I didn't have an ounce of uncertainty. I told
                myself that if I didn't get into Stanford, that I will go to Georgia Tech, and look what happened. I initially came in as a Math major, but
                after taking my first coding class, I knew I wanted to be more involved in Software Engineering. I picked up a Computer Science minor from there
                and continued to prosper in the world of logical problem solving. From Tech, I've kept up with my dev skills, leveraging AI and focusing more on
                architecture, worked as a Data Engineer at Northside Hospital, and now work as a software engineer at VISA!
            </p>
        </div>
    );
}

const centerNode = {
    id: CENTER_NODE_ID,
    label: 'Michael Ani',
    image: about_mike,
    isCenter: true,
};

const aspectNodes = [
    {
        id: 'tech',
        label: 'Tech & Coding',
        image: ga_tech_logo,
        popupTitle: 'Tech & Coding',
        renderBody: () => <TechAndCodingContent />,
    },
    {
        id: 'powerlifting',
        label: 'Powerlifting',
        image: powerlifting,
        popupTitle: 'Powerlifting',
        renderBody: () => <PowerliftingContent />,
    },
    {
        id: 'fraternity',
        label: 'Alpha Phi Alpha',
        image: mike_alpha,
        popupTitle: 'Alpha Phi Alpha Fraternity, Inc.',
        renderBody: () => <APhiAContent />,
    },
    {
        id: 'sonic',
        label: 'Sonic',
        image: sonic,
        popupTitle: 'Sonic',
        renderBody: () => <SonicContent />,
    },
    {
        id: 'video_games',
        label: 'Video Games',
        image: video_game,
        popupTitle: 'Video Games',
        renderBody: () => <VideoGamesContent />,
    },
    {
        id: 'music',
        label: 'Music',
        image: saxophone,
        popupTitle: 'Music',
        renderBody: () => <MusicContent />,
    },
    {
        id: 'heritage',
        label: 'Nigerian Heritage & Family',
        image: nigeria,
        popupTitle: 'Nigerian Heritage & Family',
        renderBody: () => <NigeriaContent />,
    },
];

const graphData = {
    nodes: [centerNode, ...aspectNodes],
    links: aspectNodes.map((node) => ({ source: CENTER_NODE_ID, target: node.id })),
};

const aspectById = Object.fromEntries(aspectNodes.map((n) => [n.id, n]));

function makeCircularTexture(image, borderColor) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 0, 0, size, size);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const imageCache = new Map();
function loadImage(src) {
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
    });
    imageCache.set(src, promise);
    return promise;
}

const NetworkGraph = () => {
    const fgRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedAspect, setSelectedAspect] = useState(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const nodeThreeObject = useCallback((node) => {
        const px = node.isCenter ? CENTER_SPRITE_PX : SATELLITE_SPRITE_PX;
        const borderColor = node.isCenter ? COLOR_AMBER : COLOR_BLUE;

        const material = new THREE.SpriteMaterial({ transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(px, px, 1);

        loadImage(node.image).then((img) => {
            material.map = makeCircularTexture(img, borderColor);
            material.needsUpdate = true;
        });

        return sprite;
    }, []);

    const handleNodeClick = useCallback((node) => {
        if (node.isCenter) return;
        const aspect = aspectById[node.id];
        if (aspect) setSelectedAspect(aspect);
    }, []);

    useEffect(() => {
        const fg = fgRef.current;
        if (!fg || dimensions.width === 0) return;
        fg.d3Force('link').distance(280);
        fg.d3Force('charge').strength(-400);
        fg.cameraPosition({ x: 0, y: 0, z: 700 });
        const controls = fg.controls();
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        const stopAutoRotate = () => { controls.autoRotate = false; };
        controls.addEventListener('start', stopAutoRotate);
        return () => controls.removeEventListener('start', stopAutoRotate);
    }, [dimensions.width]);

    const handleEngineStop = useCallback(() => {
        fgRef.current?.pauseAnimation?.();
    }, []);

    useEffect(() => {
        return () => {
            fgRef.current?.pauseAnimation?.();
        };
    }, []);

    return (
        <div className="network-graph-section" data-aos="fade-up">
            <p className="display-3-large sonic-blue-text">Aspects of Me</p>
            <div className="topic-line sonic-red"></div>
            <p className="subhead-1-large text-dark network-graph-hint">
                Drag to orbit, scroll to zoom, click a node to learn more.
            </p>
            <div className="network-graph-container" ref={containerRef}>
                {dimensions.width > 0 && (
                    <ForceGraph3D
                        ref={fgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        backgroundColor="#ffdfa5"
                        nodeThreeObject={nodeThreeObject}
                        nodeThreeObjectExtend={false}
                        nodeLabel={(node) => node.label}
                        linkColor={() => '#da2528'}
                        linkWidth={1.5}
                        linkOpacity={0.6}
                        enableNodeDrag={false}
                        onNodeClick={handleNodeClick}
                        onEngineStop={handleEngineStop}
                        showNavInfo={false}
                    />
                )}
            </div>

            <Modal
                isOpen={!!selectedAspect}
                onClose={() => setSelectedAspect(null)}
                title={selectedAspect?.popupTitle}
            >
                {selectedAspect && selectedAspect.renderBody()}
            </Modal>
        </div>
    );
};

export default NetworkGraph;
