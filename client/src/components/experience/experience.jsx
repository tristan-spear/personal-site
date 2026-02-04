import React from 'react';
import ExperienceItem from './experienceItem';
import learnByDoing from '../../assets/learn.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import stanfordLogo from '../../assets/stanford.png';
import hack4impactLogo from '../../assets/hack4impact.png';
import './experience.css';

function Experience() {
  const experiences = [
    {
      title: "Web Developer",
      company: "Cal Poly Academic Innovations & Programs (AIP)",
      location: "San Luis Obispo, CA",
      date: "January 2026 - Present",
      thumbnail: learnByDoing,
    },
    {
      title: "Full Stack Developer",
      company: "Hack4Impact Cal Poly",
      location: "San Luis Obispo, CA",
      date: "September 2025 - Present",
      thumbnail: hack4impactLogo,
    },
    {
      title: "Robotics & Programming Instructor",
      company: "iD Tech - Stanford",
      location: "Stanford, CA",
      date: "June 2024 - August 2024",
      thumbnail: stanfordLogo,
    },
    {
      title: "AI Researcher",
      company: "Cal Poly SLO",
      location: "San Luis Obispo, CA",
      date: "March 2024 - Present",
      thumbnail: learnByDoing,
    },
    {
      title: "Tutor",
      company: "Cuesta College",
      location: "San Luis Obispo, CA",
      date: "January 2024 - July 2025",
      thumbnail: cuestaLogo,
    },
  ];

  return (
    <section className="experience-section">
      <div className="experience-content">
        <h2 className="experience-title hover-underline">Experience</h2>
        <div className="experience-list">
          {experiences.map((experience, index) => (
            <ExperienceItem key={index} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
