'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './user.css';

function UserPanel({ signedIn, configured }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not sign in.');
        return;
      }
      setPassword('');
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (signedIn) {
    return (
      <div className="user-panel">
        <p className="user-note">
          You&apos;re signed in. Open a page and use the <strong>Edit</strong> buttons to
          change its text.
        </p>
        <div className="user-actions">
          <Link href="/" className="user-button user-button-primary">
            Go to home page
          </Link>
          <button
            type="button"
            className="user-button"
            onClick={handleSignOut}
            disabled={busy}
          >
            {busy ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="user-panel" onSubmit={handleSubmit}>
      {!configured && (
        <p className="user-status user-status-error" role="alert">
          Editing is not configured on this server yet.
        </p>
      )}

      <div className="user-field">
        <label htmlFor="user-password">Password</label>
        <input
          id="user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <p className="user-status user-status-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="user-button user-button-primary" disabled={busy}>
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default UserPanel;
