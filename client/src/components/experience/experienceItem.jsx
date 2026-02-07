import React from 'react';
import './experience.css';

function ExperienceItem({ experience }) {
  return (
    <div className="experience-item">
      <img src={experience.thumbnail} alt={experience.company} className="experience-thumbnail" />
      <div className="experience-info">
        <div className="experience-header">
          <div className="experience-title-company">
            <div className="experience-job-title">{experience.title}</div>
            <div className="experience-company">{experience.company}</div>
          </div>
          <div className="experience-date">{experience.date}</div>
        </div>
        <div className="experience-location">{experience.location}</div>
        <ul className="experience-bullets">
          {(experience.bullets || []).map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExperienceItem;
