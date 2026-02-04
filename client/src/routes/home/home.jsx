import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Timeline from '../../components/timeline/timeline';
import Links from '../../components/links/links';
import headshot from '../../assets/headshot.jpeg';
import calpolyLogo from '../../assets/calpoly.png';
import cuestaLogo from '../../assets/cuesta.jpeg';
import learnByDoing from '../../assets/learn.png';
import './home.css';

function Home() {
  const fullName = "Tristan Spear";
  const [displayedName, setDisplayedName] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullName.length) {
        setDisplayedName(fullName.slice(0, index + 1));
        index++;
      } else {
        setTypingComplete(true);
        clearInterval(typeInterval);
      }
    }, 112);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div className="home">
      <Header />
      <section className="hero-section">
        <div className="space-animation"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-name">
              {displayedName}
              <span className={`hero-cursor ${typingComplete ? 'hero-cursor-blink' : ''}`}>|</span>
            </h1>
            <p className={`hero-subtitle ${typingComplete ? 'hero-subtitle-visible' : ''}`}>
              Hi, I'm <strong>Tristan</strong>, I am a Junior, studying <br/><strong>Software Engineering</strong> at Cal Poly SLO 🐎
            </p>
          </div>
          <div className="hero-image-container">
            <img src={headshot} alt="Tristan Spear" className="hero-headshot" />
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="about-content">
          <h2 className="about-title hover-underline">About Me</h2>
          <p className="about-text">
          Welcome to my personal website! I’m a Software Engineering student 
          who enjoys building creative solutions and diving into new technologies. 
          I’m currently looking for internship or part-time opportunities in software 
          development, and I’m always learning through my studies and hands-on projects.
          </p>
          <br />
          <br />
          <p className="about-text">
            I grew up on the Central Coast, in Arroyo Grande, California.
            I spend my time studying, coding, reading, going to the gym, playing sports,
            and hanging out with my pets and family.
          </p>
          <br />
          <br />
          <p className="about-text">
            I'm always open to respond to messages
            or meet for a coffee chat. Feel free to reach out to me or connect! 
          </p>
        </div>
      </section>

      {/* <section className="education-section">
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
      </section> */}

      <section className="journey-section">
        <div className="journey-content">
          <h2 className="journey-title hover-underline">Professional Journey</h2>
          <Timeline />
        </div>
      </section>

      <Links />

      <Footer />
    </div>
  );
}

export default Home;