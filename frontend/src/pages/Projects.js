import React from 'react';
import './Projects.css';
import { projects } from './projects/projects-data';

function ProjectCover({ title, accent, image }) {
    if (image) {
        return (
            <div className='project-cover'>
                <img src={image} alt='' className='project-cover-image' />
            </div>
        );
    }

    const initials = title
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();

    return (
        <div className={`project-cover project-cover-${accent}`}>
            <span className='project-cover-initials'>{initials}</span>
        </div>
    );
}

function ProjectCard({ project, index }) {
    const { title, subtitle, description, techStack, githubUrl, liveUrl, attribution, accent, image } = project;
    const reversed = index % 2 === 1;

    return (
        <div className={`project-card mb-4${reversed ? ' project-card-reverse' : ''}`}>
            <div className='project-card-media'>
                <ProjectCover title={title} accent={accent} image={image} />
            </div>
            <div className='project-card-body d-flex flex-column'>
                <div className='headline-3-large'>{title}</div>
                <div className='subhead-1-large project-card-subtitle'>{subtitle}</div>
                {attribution && (
                    <p className='legal-1-demi font-italic project-card-attribution'><i>{attribution}</i></p>
                )}
                <p className='body-1-large'>{description}</p>
                <div className='d-flex flex-wrap gap-4 subhead-1-large align-items-center mb-3'>
                    {techStack.map(skill => (
                        <div className='skill-pill' key={skill}>{skill}</div>
                    ))}
                </div>
                <div className='d-flex flex-wrap project-card-links'>
                    {liveUrl && (
                        <a className='project-link no-decoration' href={liveUrl} target='_blank' rel='noreferrer'>Live App</a>
                    )}
                    <a className='project-link project-link-github no-decoration' href={githubUrl} target='_blank' rel='noreferrer'>View on GitHub</a>
                </div>
            </div>
        </div>
    );
}

const Projects = () => {
  return (
    <div className="App-content-stuff d-flex flex-column">
        <p data-aos="fade-left" className='display-3-large sonic-blue-text'>Projects</p>
        <div data-aos="fade-left" className='topic-line sonic-red'></div>
        <div data-aos="fade-left" className='subhead-1-large text-dark mb-4'>
            <p>Here's a collection of things I've built — from a Python trading bot and a self-drawn
            Godot RPG to full-stack apps and freelance client work. Every card links to the source on
            GitHub, and to a live demo wherever one exists.</p>
        </div>
        <div data-aos="fade-left" className='d-flex flex-column mb-5'>
            {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
            ))}
        </div>
    </div>
  );
};

export default Projects;
