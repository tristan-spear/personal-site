'use client';

import React, { useEffect, useState } from 'react';
import Timeline from '@/components/timeline/timeline';
import PixelSnow from '@/components/pixelSnow/PixelSnow';
import EditableBlock from '@/components/editable/EditableBlock';
import RichText from '@/components/richText/RichText';

const headshot = '/assets/headshot.jpeg';
const cuestaLogo = '/assets/cuesta.jpeg';
const learnByDoing = '/assets/cp.png';

function HomeContent({ content: initialContent, canEdit }) {
  const [content, setContent] = useState(initialContent);
  const [displayedName, setDisplayedName] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  const fullName = content.name;

  // Retypes whenever the name is saved, so an edit shows the same intro animation.
  useEffect(() => {
    let typeInterval = null;
    const startDelay = setTimeout(() => {
      setDisplayedName('');
      setTypingComplete(false);

      let index = 0;
      typeInterval = setInterval(() => {
        if (index < fullName.length) {
          setDisplayedName(fullName.slice(0, index + 1));
          index++;
        } else {
          setTypingComplete(true);
          clearInterval(typeInterval);
        }
      }, 112);
    }, 50);

    return () => {
      clearTimeout(startDelay);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [fullName]);

  const saveField = async (field, value) => {
    const res = await fetch('/api/content/home', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Could not save changes.');
    }
    setContent(data.content);
  };

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-background">
          <PixelSnow
            color="#ffffff"
            flakeSize={0.007}
            minFlakeSize={2}
            pixelResolution={350}
            speed={0.3}
            density={1}
            direction={360}
            brightness={1.6}
            depthFade={5}
            farPlane={15}
            variant="round"
          />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <EditableBlock
              canEdit={canEdit}
              label="Name"
              value={content.name}
              rows={1}
              onSave={(value) => saveField('name', value)}
            >
              <h1 className="hero-name">
                {displayedName}
                <span className={`hero-cursor ${typingComplete ? 'hero-cursor-blink' : ''}`}>|</span>
              </h1>
            </EditableBlock>
            <EditableBlock
              canEdit={canEdit}
              label="Intro"
              value={content.intro}
              rows={3}
              onSave={(value) => saveField('intro', value)}
            >
              <p className={`hero-subtitle ${typingComplete ? 'hero-subtitle-visible' : ''}`}>
                <RichText text={content.intro} />
              </p>
            </EditableBlock>
          </div>
          <div className="hero-image-container">
            <img src={headshot} alt={content.name} className="hero-headshot" />
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2 className="about-title hover-underline">About Me</h2>
          <EditableBlock
            canEdit={canEdit}
            label="About Me"
            value={content.about}
            rows={14}
            onSave={(value) => saveField('about', value)}
          >
            {/* A blank line starts a new paragraph; a single newline is a line
                break inside the current one. */}
            {content.about
              .split(/\n\s*\n/)
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                  <p className="about-text">
                    <RichText text={paragraph} />
                  </p>
                </React.Fragment>
              ))}
          </EditableBlock>
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
    </div>
  );
}

export default HomeContent;
