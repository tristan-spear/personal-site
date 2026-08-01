import React from 'react';
import Experience from '@/components/experience/experience';
import Skills from '@/components/skills/skills';
import ResumeDownloadButton from '@/components/resumeDownload/resumeDownloadButton';
import './resume.css';

const learnByDoing = '/assets/learn.png';
const cuestaLogo = '/assets/cuesta.jpeg';

function Resume() {
  return (
    <div className="resume">
      <section className="download-section">
        <div className="download-content">
          <ResumeDownloadButton />
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
