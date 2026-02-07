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
      company: "—",
      location: "—",
      date: "—",
      thumbnail: learnByDoing,
      bullets: [],
    },
    {
      title: "Full Stack Developer",
      company: "Hack4Impact Cal Poly",
      location: "San Luis Obispo, CA",
      date: "Sep. 2025 - Present",
      thumbnail: hack4impactLogo,
      bullets: [
        "Implement full-stack features for nonprofit clients (Ecologistics, Habitat For Humanity) using React, Express, MongoDB, and Next.js, contributing to production code used by real organizations",
        "Build and integrate REST APIs to support frontend workflows and features, collaborating with designers to translate Figma designs into responsive UI components",
        "Coordinate development tasks within a 10-person engineering team, working closely with tech leads to scope features, review pull requests, and meet sprint deadlines",
        "Practice Agile development through sprint planning, stand-ups, and retrospectives, delivering assigned features within sprint timelines",
      ],
    },
    {
      title: "AI Researcher",
      company: "Cal Poly, San Luis Obispo",
      location: "San Luis Obispo, CA",
      date: "Jan. 2024 - Jun. 2024",
      thumbnail: learnByDoing,
      bullets: [
        "Built an AI-powered chatbot to answer student questions about Cal Poly staff, academics, and senior projects, working in a 5-person research team",
        "Designed and implemented a user interest survey to collect structured feedback and improve LLM responses through prompt tuning and data refinement",
        "Managed project milestones and deliverables independently, meeting weekly deadlines, while balancing coursework",
      ],
    },
    {
      title: "Computer Science Tutor",
      company: "M.E.S.A Program - Cuesta College",
      location: "San Luis Obispo, CA",
      date: "Jan. 2024 - May 2025",
      thumbnail: cuestaLogo,
      bullets: [
        "Provided one-on-one and small group tutoring for core CS classes, including Intro to Programming, Data Structures, Object-Oriented Programming, Computer Organization, and Discrete Math, supporting students across multiple semesters",
        "Assisted students with Java, Python, C/C++, and Assembly Language, helping debug code and clarify how code executes across different abstraction levels",
        "Served as lead tutor for the MESA program, completing 400+ tutoring hours, and supporting 30+ students, through sustained, semester-long academic improvement",
      ],
    },
    {
      title: "Programming & Robotics Instructor",
      company: "iD Tech Camps - Stanford University",
      location: "Stanford, CA",
      date: "May 2024 - Aug. 2024",
      thumbnail: stanfordLogo,
      bullets: [
        "Led and instructed week-long engineering courses in VEX robotics and programming, teaching Python and C++ to middle and high school students",
        "Independently managed classrooms of 10-14 students, adapting instruction to different skill levels while maintaining structured timelines",
        "Developed lesson plans and technical exercises to reinforce core programming concepts and problem-solving skills",
      ],
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
