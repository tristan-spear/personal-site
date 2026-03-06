import React, { useState } from 'react';
import './contact.css';

const API_CONTACT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/contact`
  : '/api/contact';

function Contact() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(API_CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Something went wrong.' });
        return;
      }
      setStatus({ type: 'success', text: 'Message sent! I\'ll get back to you soon.' });
      setEmail('');
      setName('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus({ type: 'error', text: 'Could not send. Check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <section className="contact-hero">
        <h1 className="contact-hero-title hover-underline">Let's Get in Touch!</h1>
        <p className="contact-hero-intro">
          Have a question or want to work together? Feel free to reach out!
        </p>
      </section>
      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="contact-email">Your email</label>
                  <div className="contact-input-wrap">
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-name">Your name</label>
                  <div className="contact-input-wrap">
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
              </div>
              <div className="contact-field">
                <label htmlFor="contact-subject">Subject</label>
                <div className="contact-input-wrap">
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <div className="contact-input-wrap">
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={6}
                    required
                  />
                </div>
              </div>
              {status && (
                <p
                  className={
                    status.type === 'success'
                      ? 'contact-status contact-status-success'
                      : 'contact-status contact-status-error'
                  }
                  role="alert"
                >
                  {status.text}
                </p>
              )}
              <div className="contact-submit-wrap">
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={isSubmitting}
                >
                  <span className="contact-submit-text">
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <section className="contact-direct">
            <h2 className="contact-direct-title">Or contact me directly at :</h2>
            {/* <p className="contact-direct-intro">Reach out at my email below.</p> */}
            <a
              href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || ''}`}
              className="contact-direct-email"
            >
              {import.meta.env.VITE_CONTACT_EMAIL || 'your@email.com'}
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Contact;
