import React from 'react';
import './skills.css';

function Skills() {
  const skillCategories = [
    {
      category: 'Languages',
      skills: ['Java', 'C', 'C++', 'JavaScript', 'HTML', 'CSS', 'Python', 'SQL']//['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'SQL']
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['React', 'Node.js', 'Express', 'Vite', 'Bootstrap']
    },
    {
      category: 'Tools & Technologies',
      skills: ['Git', 'GitHub', 'VS Code', 'IntelliJ', 'Zsh', 'PostgreSQL', 'MongoDB', 'REST APIs']
    }
  ];

  return (
    <section className="skills-section">
      <div className="skills-content">
        <h2 className="skills-title hover-underline">Technical Skills</h2>
        <div className="skills-list">
          {skillCategories.map((category, index) => (
            <div key={index} className="skills-category">
              <h3 className="skills-category-title">{category.category}</h3>
              <div className="skills-items">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item-wrapper">
                    <span className="skill-border skill-border-top"></span>
                    <span className="skill-border skill-border-right"></span>
                    <span className="skill-border skill-border-bottom"></span>
                    <span className="skill-border skill-border-left"></span>
                    <span className="skill-item">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
