import React from 'react';
import './Projects.css';
import {
    WebsiteCreationCardIcon,
    SpeedyRunnerCardIcon,
    TalesRpgCardIcon,
    DungeonCrawlerCardIcon,
    AmdocsCardIcon,
    BootstrapIcon,
    ReactIcon,
    HtmlIcon,
    CssIcon,
    UnityIcon,
    CSharpIcon,
    GodotIcon,
    AndroidStudioIcon,
    JavaIcon,
    ScrumIcon,
} from './projects/icons';

const projects = [
    {
        title: 'Website Creation',
        description: "Inspired by my work at Amdocs and multiple portfolios that I have seen, I decided to make a website portfolio of my own. Thus, successfully creating a simple but dynamic and Accessible website.",
        dateRange: 'APR 2024 - PRES',
        href: null,
        icon: <WebsiteCreationCardIcon />,
        skills: [
            { name: 'Bootstrap', icon: <BootstrapIcon /> },
            { name: 'React', icon: <ReactIcon /> },
            { name: 'HTML', icon: <HtmlIcon /> },
            { name: 'CSS', icon: <CssIcon /> },
        ],
    },
    {
        title: 'Speedy Runner',
        description: 'Teamed up with collegues to create a Unity game incorporating Game Feel, AI and physics where you run and jump through a level to reach the end.',
        dateRange: 'JAN 2024 - APR 2024',
        href: null,
        icon: <SpeedyRunnerCardIcon />,
        skills: [
            { name: 'Unity', icon: <UnityIcon /> },
            { name: 'C Sharp', icon: <CSharpIcon /> },
        ],
    },
    {
        title: 'Tales-Inspired RPG',
        description: 'Experimented with Godot to create an early demo of an action RPG, using Sonic as a player and a test enemy. This helped me learn more about designing video games and refreshed my abilities in object oriented programming.',
        dateRange: 'DEC 2023 - FEB 2024',
        href: 'https://github.com/Smashthehedgehog/Action_RPG_Project',
        icon: <TalesRpgCardIcon />,
        skills: [
            { name: 'Godot', icon: <GodotIcon /> },
            { name: 'C Sharp', icon: <CSharpIcon /> },
        ],
    },
    {
        title: 'Dungeon Crawler',
        description: "Learned how to create an application in Andriod Studio and worked with a team to create a dynamic application. In it, you get to choose your character, create your own name, choose your difficulty, and navigate through a dungeon with enemies to get to the finish. We also implemented a design pattern such as the singleton design pattern.",
        dateRange: 'SEP 2023 - DEC 2023',
        href: 'https://github.com/MichaelJafojo/DungeonCrawler2',
        icon: <DungeonCrawlerCardIcon />,
        skills: [
            { name: 'Android Studio', icon: <AndroidStudioIcon /> },
            { name: 'Java', icon: <JavaIcon /> },
        ],
    },
    {
        title: 'Amdocs Internship',
        description: "In my internship, I collaborated with coworkers to delegate our responsibilities between Frontend development and Backend development. I ended up in Frontend development, creating UI/UX components for use by Cricket. I also acquired the know-how of operating under the framework of Scrum, and operated as a Scrum Master for aportion of the internship's duration",
        dateRange: 'JUN 2023 - AUG 2023',
        href: 'https://www.amdocs.com/careers/home',
        icon: <AmdocsCardIcon />,
        skills: [
            { name: 'Bootstrap', icon: <BootstrapIcon /> },
            { name: 'HTML', icon: <HtmlIcon /> },
            { name: 'CSS', icon: <CssIcon /> },
            { name: 'Scrum', icon: <ScrumIcon /> },
        ],
    },
];

function ProjectCard({ title, description, dateRange, href, icon, skills }) {
    const body = (
        <div className='row'>
            <div className='col-2'>
                {icon}
            </div>
            <div className='col-md-8 col-7'>
                <div className='d-flex flex-column'>
                    <div className='headline-3-large'>{title}</div>
                    <p className='body-1-large'>{description}</p>
                </div>
                <div className='d-flex flex-wrap gap-4 subhead-1-large align-items-center mb-1'>
                    {skills.map(skill => (
                        <div className='skill-pill' key={skill.name}>
                            {skill.name}
                            {skill.icon}
                        </div>
                    ))}
                </div>
            </div>
            <div className='col-md-2 col-3'>
                <p className='legal-1-demi font-italic text-dark'><i>{dateRange}</i></p>
            </div>
        </div>
    );

    return href
        ? <a className='sonic-card mb-4 no-decoration text-dark' href={href} target='_bkank'>{body}</a>
        : <div className='sonic-card-no-link mb-4'>{body}</div>;
}

const Projects = () => {
  return (
    <div className="App-content-stuff d-flex flex-column">
        <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Projects and Experience</p>
        <div data-aos="fade-left" className='topic-line sonic-red'></div>
        <div data-aos="fade-left" className='subhead-1-large text-dark mb-4'>
            <p>Here is where I put any custom artifacts or works that aren't particularly towards
            my experience in Software Engineering and Computer Science, alongside projects I do just
            for fun.</p>
        </div>
        <div data-aos="fade-left" className='d-flex flex-column mb-5'>
            {projects.map(project => <ProjectCard key={project.title} {...project} />)}
        </div>
    </div>
  );
};

export default Projects;
