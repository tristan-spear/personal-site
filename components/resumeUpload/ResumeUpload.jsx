'use client';

import { useState } from 'react';

function ResumeUpload() {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true); setStatus('Uploading…');
    const form = new FormData(); form.append('file', file); form.append('kind', 'pdf');
    try {
      const response = await fetch('/api/uploads', { method: 'POST', body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || 'Upload failed.');
      setStatus('Resume uploaded.');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  return <div className="cms-toolbar"><label className="cms-add">{busy ? 'Uploading…' : 'Upload resume PDF'}<input type="file" accept="application/pdf" onChange={upload} disabled={busy} hidden /></label>{status && <span className="cms-form-hint">{status}</span>}</div>;
}

export default ResumeUpload;
