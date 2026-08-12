'use client';

import React, { useId, useState } from 'react';
import './editable.css';

/**
 * Wraps one block of page copy with an Edit affordance.
 *
 * When `canEdit` is false it renders its children untouched — logged-out
 * visitors get exactly the markup the page had before the CMS existed. The
 * server decides `canEdit`; this component is only ever a convenience.
 */
function EditableBlock({ canEdit, label, value, onSave, rows = 4, children, upload }) {
  const inputId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!canEdit) return children;

  const startEditing = () => {
    setDraft(value);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('kind', upload);
      const res = await fetch('/api/uploads', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not upload the file.');
      setDraft(data.url);
    } catch (err) {
      setError(err.message || 'Could not upload the file.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    }
  };

  if (!editing) {
    return (
      <div className="editable">
        {children}
        <button type="button" className="editable-edit" onClick={startEditing}>
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="editable editable-open">
      <label className="editable-label" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className="editable-input"
        value={draft}
        rows={rows}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={saving}
        autoFocus
      />
      {upload && (
        <input
          className="editable-file"
          type="file"
          accept="image/*"
          onChange={(e) => { uploadFile(e.target.files?.[0]); e.target.value = ''; }}
          disabled={saving}
        />
      )}
      <p className="editable-hint">
        **bold** is kept. Enter starts a new line, a blank line starts a new
        paragraph. Esc cancels, ⌘/Ctrl + Enter saves.
      </p>
      {error && (
        <p className="editable-error" role="alert">
          {error}
        </p>
      )}
      <div className="editable-actions">
        <button
          type="button"
          className="editable-button editable-button-primary"
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="editable-button"
          onClick={cancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditableBlock;
