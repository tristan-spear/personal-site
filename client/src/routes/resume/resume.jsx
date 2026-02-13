import React from 'react';
import Experience from '../../components/experience/experience';
import Skills from '../../components/skills/skills';
import learnByDoing from '../../assets/learn.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import resumePdf from '../../assets/Spear, Tristan - Digital Resume - Feb 2026.pdf';
import './resume.css';

function Resume() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'Tristan_Spear_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resume">
      <section className="download-section">
        <div className="download-content">
          <button
            type="button"
            className="download-button-3d"
            onClick={handleDownload}
            aria-label="Download resume PDF"
          >
            <span>Download My Resume</span>
            <span>Download My Resume</span>
            <span>Download My Resume</span>
            <span>Download My Resume</span>
          </button>
        </div>
      </section>
      <section className="education-section">
        <div className="education-content">
          <h2 className="education-title hover-underline">Education</h2>
          <div className="education-list">
            <div className="education-item">
              <img src={learnByDoing} alt="Cal Poly San Luis Obispo" className="education-thumbnail" />
              <div className="education-info">
                <div className="education-degree">B.S. Software Engineering</div>
                <div className="education-school">Cal Poly - San Luis Obispo</div>
                <div className="education-years">2025 - 2027 <i>(Expected)</i></div>
              </div>
            </div>
            <div className="education-item">
              <img src={cuestaLogo} alt="Cuesta College" className="education-thumbnail" />
              <div className="education-info">
                <div className="education-degree">A.S. Math,  A.S. Computer Science</div>
                <div className="education-school">Cuesta College, San Luis Obispo</div>
                <div className="education-years">2022 - 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Experience />
      <Skills />
    </div>
  );
}

export default Resume;
