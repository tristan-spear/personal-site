import React, { useState } from 'react';
import './contact.css';

function Contact() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Functionality to be implemented later
  };

  return (
    <div className="contact">
      <section className="contact-section">
        <div className="contact-content">
          <p className="contact-label">Contact</p>
          <h1 className="contact-title hover-underline">Get in Touch</h1>
          <p className="contact-intro">
            Have a question or want to work together? Send me a message.
          </p>
          <div className="contact-form-wrapper gradient-border-wrapper">
            <span className="gradient-border gradient-border-top"></span>
            <span className="gradient-border gradient-border-right"></span>
            <span className="gradient-border gradient-border-bottom"></span>
            <span className="gradient-border gradient-border-left"></span>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="contact-email">Your email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={6}
                  required
                />
              </div>
              <div className="contact-submit-wrap">
                <button type="submit" className="contact-submit gradient-border-wrapper">
                  <span className="gradient-border gradient-border-top"></span>
                  <span className="gradient-border gradient-border-right"></span>
                  <span className="gradient-border gradient-border-bottom"></span>
                  <span className="gradient-border gradient-border-left"></span>
                  <span className="contact-submit-text">Send message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
