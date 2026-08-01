'use client';

import React, { useState } from 'react';
import './contact.css';

const API_CONTACT = '/api/contact';
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

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
      <main className="contact-main">
        <h1 className="contact-title">Contact Me</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-row">
            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
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

          <button type="submit" className="contact-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>

        {CONTACT_EMAIL && (
          <p className="contact-direct">
            Or email me at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-direct-email">
              {CONTACT_EMAIL}
            </a>
          </p>
        )}
      </main>
    </div>
  );
}

export default Contact;
