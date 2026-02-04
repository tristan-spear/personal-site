import React, { useState } from 'react';
import learnByDoing from '../../assets/learn.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import stanfordLogo from '../../assets/stanford.png';
import udemyLogo from '../../assets/udemy.png';
import hack4impactLogo from '../../assets/hack4impact.png';
import './timeline.css';

function Timeline() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const events = [
    // {
    //   title: "Present",
    //   description: "Currently studying Software Engineering at Cal Poly SLO",
    //   date: "2025",
    //   thumbnail: learnByDoing,
    //   color: "#00D9FF", // Bright cyan
    //   icon: "🎓",
    // },
    {
      title: "Hired as a Web Developer at Cal Poly AIP",
      description: "Designing and developing websites for Cal Poly Academic Innovations & Programs",
      date: "January 2026",
      thumbnail: learnByDoing,
      color: "#5DFFBF", // Mint teal
      icon: "💼",
    },
    {
      title: "Joined Hack4Impact Cal Poly as Full Stack Developer",
      description: "Building full stack applications for non-profit organizations",
      date: "September 2025",
      thumbnail: hack4impactLogo,
      color: "#FF7BC4", // Pink
      icon: "🌍",
    },
    {
      title: "Transferred to Cal Poly - San Luis Obispo",
      description: "Graduated Cuesta College, and began studying Software Engineering at Cal Poly SLO",
      date: "July 2025",
      thumbnail: learnByDoing,
      color: "#7B75FF", // Lavender
      icon: "🚀",
    },
    // {
    //   title: "Graduated from Cuesta College",
    //   description: "Earned Associate of Science in Math & Computer Science",
    //   date: "July 2025",
    //   thumbnail: cuestaLogo,
    //   color: "#00FFD1", // Bright turquoise
    //   icon: "🎉",
    // },
    {
      title: "Completed Full Stack Web Development Course on Udemy",
      description: "Completed Angela Yu's Full Stack Web Development Course",
      date: "June 2025",
      thumbnail: udemyLogo,
      color: "#FFF066", // Yellow
      icon: "📚",
    },
    {
      title: "Robotics & Programming Instructor at iD Tech - Stanford",
      description: "Teaching robotics and programming to students ages 10-13",
      date: "June 2024",
      thumbnail: stanfordLogo,
      color: "#6BA8FF", // Sky blue
      icon: "🤖",
    },
    {
      title: "Joined AI Research Project at Cal Poly SLO",
      description: "Began working as an AI Researcher with other students at Cal Poly",
      date: "March 2024",
      thumbnail: learnByDoing,
      color: "#FF7BC4", // Pink
      icon: "🧠",
    },
    {
      title: "Got hired as a tutor at Cuesta College",
      description: "Tutoring students in computer science, mathematics, and physics",
      date: "January 2024",
      thumbnail: cuestaLogo,
      color: "#FFF066", // Yellow
      icon: "👨‍🏫",
    },
    {
      title: "Started studying Computer Science at Cuesta College",
      description: "Began pursuing Associates of Science in Math & Computer Science",
      date: "August 2022",
      thumbnail: cuestaLogo,
      color: "#7B75FF", // Lavender
      icon: "💻",
    },
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {events.map((event, index) => (
        <div 
          key={index} 
          className="timeline-item"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="timeline-node-wrapper">
            <div 
              className={`timeline-node ${hoveredIndex === index ? 'hovered' : ''}`}
              style={{ '--node-color': event.color }}
            >
              <div className="timeline-node-glow"></div>
            </div>
            <div 
              className={`timeline-thumbnail ${hoveredIndex === index ? 'hovered' : ''} ${event.title.includes('Udemy') ? 'udemy-thumbnail' : ''}`}
              style={{ '--node-color': event.color }}
            >
              <img src={event.thumbnail} alt={event.title} />
            </div>
          </div>
          <div className={`timeline-content ${hoveredIndex === index ? 'hovered' : ''}`}>
            {event.date && (
              <div className="timeline-date" style={{ color: event.color }}>
                {event.date}
              </div>
            )}
            <div className="timeline-title">{event.title}</div>
            <div className="timeline-description">{event.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;

