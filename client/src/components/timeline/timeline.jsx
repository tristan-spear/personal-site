import React, { useState } from 'react';
import learnByDoing from '../../assets/learn.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import stanfordLogo from '../../assets/stanford.png';
import './timeline.css';

function Timeline() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const events = [
    {
      title: "Present",
      description: "Currently studying Software Engineering at Cal Poly SLO",
      date: "2025",
      thumbnail: learnByDoing,
      color: "#00D9FF", // Bright cyan
      icon: "🎓",
    },
    {
      title: "Robotics & Programming Instructor at iD Tech - Stanford",
      description: "Teaching robotics and programming to students at Stanford University",
      date: "June 2024",
      thumbnail: stanfordLogo,
      color: "#FF6B00", // Bright orange
      icon: "🤖",
    },
    {
      title: "Got hired as a tutor at Cuesta College",
      description: "Tutoring students in computer science and mathematics",
      date: "January 2024",
      thumbnail: cuestaLogo,
      color: "#FF00E5", // Bright magenta
      icon: "👨‍🏫",
    },
    {
      title: "Started studying Computer Science at Cuesta College",
      description: "Began pursuing Associate of Science in Math & Computer Science",
      date: "August 2022",
      thumbnail: cuestaLogo,
      color: "#00FF88", // Bright green
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
              className={`timeline-thumbnail ${hoveredIndex === index ? 'hovered' : ''}`}
              style={{ '--node-color': event.color }}
            >
              <img src={event.thumbnail} alt={event.title} />
              <div className="thumbnail-icon">{event.icon}</div>
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

