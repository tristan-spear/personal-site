import React from 'react';
import Header from '../../components/header/header';
import Timeline from '../../components/timeline/timeline';
import headshot from '../../assets/headshot.jpeg';
import calpolyLogo from '../../assets/calpoly.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import learnByDoing from '../../assets/learn.png';
import './home.css';

function Home() {
  return (
    <div className="home">
      <Header />
      <section className="hero-section">
        <div className="space-animation"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-name">Tristan Spear</h1>
            <p className="hero-subtitle">
              Hi, I'm Tristan, I am a Junior, studying Software Engineering at Cal Poly SLO 🐴
            </p>
          </div>
          <div className="hero-image-container">
            <img src={headshot} alt="Tristan Spear" className="hero-headshot" />
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="about-content">
          <h2 className="about-title">About</h2>
          <p className="about-text">
            Welcome to my personal website! I'm a Software Engineering student passionate about 
            creating innovative solutions and exploring the vast universe of technology. Through 
            my studies and projects, I'm constantly learning and growing in the field of software 
            development.
          </p>
        </div>
      </section>

      <section className="education-section">
        <div className="education-content">
          <h2 className="education-title">Education</h2>
          <div className="education-list">
            <div className="education-item">
              <img src={learnByDoing} alt="Cal Poly San Luis Obispo" className="education-thumbnail" />
              <div className="education-info">
                <div className="education-degree">Bachelor of Science in Software Engineering</div>
                <div className="education-school">Cal Poly - San Luis Obispo</div>
                <div className="education-years">2025 - 2027 <i>(Expected)</i></div>
              </div>
            </div>
            <div className="education-item">
              <img src={cuestaLogo} alt="Cuesta College" className="education-thumbnail" style={{ }} />
              <div className="education-info">
                <div className="education-degree">Associate of Science in Math & Computer Science</div>
                <div className="education-school">Cuesta College, San Luis Obispo</div>
                <div className="education-years">2022 - 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-content">
          <h2 className="journey-title">Developer Journey</h2>
          <Timeline />
        </div>
      </section>
    </div>
  );
}

export default Home;