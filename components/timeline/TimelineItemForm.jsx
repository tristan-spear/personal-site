'use client';

import React, { useState } from 'react';
import './timelineEdit.css';

/**
 * Generic add/edit form for one collection item. The inputs are driven by the
 * field definitions in lib/collections.js, so a new field appears here as soon
 * as it is added to the registry and the table.
 */
function TimelineItemForm({ fields, initialValues, submitLabel, onSubmit, onCancel, onDelete }) {
  // Built from the field list so values the API doesn't accept (id, position)
  // never end up in the request body.
  const [draft, setDraft] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, initialValues[field.name] ?? '']))
  );
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState(null);

  const setField = (name, value) => setDraft((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit(draft);
    } catch (err) {
      setError(err.message || 'Could not save.');
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setError(err.message || 'Could not delete.');
      setBusy(false);
    }
  };

  return (
    <form className="timeline-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="timeline-form-field" key={field.name}>
          <label className="timeline-form-label" htmlFor={`tl-${field.name}`}>
            {field.label}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={`tl-${field.name}`}
              className="timeline-form-input"
              value={draft[field.name] ?? ''}
              rows={3}
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              onChange={(e) => setField(field.name, e.target.value)}
              disabled={busy}
            />
          ) : field.type === 'color' ? (
            <div className="timeline-form-color">
              <input
                type="color"
                aria-label={`${field.label} swatch`}
                value={/^#[0-9a-f]{6}$/i.test(draft[field.name] || '') ? draft[field.name] : '#5dffbf'}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={busy}
              />
              <input
                id={`tl-${field.name}`}
                type="text"
                className="timeline-form-input"
                value={draft[field.name] ?? ''}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={busy}
              />
            </div>
          ) : (
            <input
              id={`tl-${field.name}`}
              type="text"
              className="timeline-form-input"
              value={draft[field.name] ?? ''}
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              onChange={(e) => setField(field.name, e.target.value)}
              disabled={busy}
            />
          )}

          {field.hint && <span className="timeline-form-hint">{field.hint}</span>}
        </div>
      ))}

      {error && (
        <p className="timeline-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="timeline-form-actions">
        <button type="submit" className="timeline-button timeline-button-primary" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="timeline-button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>

        {onDelete &&
          (confirmingDelete ? (
            <span className="timeline-form-confirm">
              <button
                type="button"
                className="timeline-button timeline-button-danger"
                onClick={handleDelete}
                disabled={busy}
              >
                Really delete
              </button>
              <button
                type="button"
                className="timeline-button"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
              >
                Keep
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="timeline-button timeline-button-danger"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
            >
              Delete
            </button>
          ))}
      </div>
    </form>
  );
}

export default TimelineItemForm;
