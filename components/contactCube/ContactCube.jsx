import React from 'react';
import './contactCube.css';

function ContactCube() {
  return (
    <div className="contact-cube-wrap">
      <div className="contact-cube-container">
        <div className="contact-cube">
          <div style={{ '--x': -1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 0, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
        </div>
        <div className="contact-cube">
          <div style={{ '--x': -1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 0, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
        </div>
        <div className="contact-cube">
          <div style={{ '--x': -1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 0, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
          <div style={{ '--x': 1, '--y': 0 }}>
            <span style={{ '--i': 3 }} />
            <span style={{ '--i': 2 }} />
            <span style={{ '--i': 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCube;
