'use client';

import React, { useState } from 'react';
import './itemForm.css';

/**
 * Add/edit form for one collection item, shared by every editable list.
 *
 * The inputs are driven by the field definitions in lib/collections.js, so a
 * new field shows up here as soon as it is added to the registry and the table.
 */
function ItemForm({ fields, initialValues, submitLabel, onSubmit, onCancel, onDelete }) {
  // Built from the field list so values the API doesn't accept (id, position)
  // never end up in the request body.
  const [draft, setDraft] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, initialValues[field.name] ?? '']))
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState(null);

  const setField = (name, value) => setDraft((current) => ({ ...current, [name]: value }));

  const uploadFile = async (field, file) => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('kind', field.upload);
    const res = await fetch('/api/uploads', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error || 'Could not upload the file.');
    setField(field.name, data.url);
  };

  const uploadImages = async (field, fileList) => {
    const files = [...(fileList ?? [])];
    if (!files.length) return;
    setUploading(true);
    setError(null);
    const uploaded = [];
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        form.append('kind', 'image');
        const res = await fetch('/api/uploads', { method: 'POST', body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.error || 'Could not upload the photo.');
        uploaded.push(data.url);
      }
    } catch (err) {
      setError(err.message || 'Could not upload the photo.');
    } finally {
      if (uploaded.length) {
        setDraft((current) => {
          const existing = String(current[field.name] ?? '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          return { ...current, [field.name]: [...existing, ...uploaded].join('\n') };
        });
      }
      setUploading(false);
    }
  };

  const removeImage = (field, url) => {
    setDraft((current) => ({
      ...current,
      [field.name]: String(current[field.name] ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && line !== url)
        .join('\n'),
    }));
  };

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

  const renderInput = (field, id) => {
    const value = draft[field.name] ?? '';
    const common = {
      id,
      className: 'cms-form-input',
      value,
      maxLength: field.maxLength,
      placeholder: field.placeholder,
      disabled: busy || uploading,
      onChange: (e) => setField(field.name, e.target.value),
    };

    if (field.type === 'select') {
      return (
        <select {...common} maxLength={undefined} className="cms-form-input cms-form-select">
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea' || field.type === 'lines') {
      return <textarea {...common} rows={field.rows || (field.type === 'lines' ? 6 : 3)} />;
    }

    if (field.type === 'date') {
      return <input {...common} type="date" />;
    }

    if (field.type === 'images') {
      const urls = String(value)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      return (
        <div className="cms-form-photos">
          {urls.length > 0 && (
            <div className="cms-form-photo-grid">
              {urls.map((url) => (
                <div className="cms-form-photo" key={url}>
                  <img src={url} alt="" />
                  <button
                    type="button"
                    className="cms-form-photo-remove"
                    onClick={() => removeImage(field, url)}
                    disabled={busy || uploading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            id={id}
            className="cms-form-file"
            type="file"
            accept="image/*"
            multiple
            disabled={busy || uploading}
            onChange={async (e) => {
              await uploadImages(field, e.target.files);
              e.target.value = '';
            }}
          />
          {uploading && <span className="cms-form-hint">Uploading...</span>}
        </div>
      );
    }

    if (field.type === 'color') {
      return (
        <div className="cms-form-color">
          <input
            type="color"
            aria-label={`${field.label} swatch`}
            value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#5dffbf'}
            disabled={busy || uploading}
            onChange={(e) => setField(field.name, e.target.value)}
          />
          <input {...common} type="text" />
        </div>
      );
    }

    return (
      <>
        <input {...common} type="text" />
        {field.upload && <input className="cms-form-file" type="file" accept={field.upload === 'pdf' ? 'application/pdf' : 'image/*'} disabled={busy || uploading} onChange={async (e) => { try { await uploadFile(field, e.target.files?.[0]); } catch (err) { setError(err.message); } e.target.value = ''; }} />}
      </>
    );
  };

  return (
    <form className="cms-form" onSubmit={handleSubmit}>
      {fields.filter((field) => !field.hidden).map((field) => {
        const id = `cms-${field.name}`;
        const hint = field.hint || (field.type === 'lines' ? 'One per line.' : null);
        return (
          <div className="cms-form-field" key={field.name}>
            <label className="cms-form-label" htmlFor={id}>
              {field.label}
            </label>
            {renderInput(field, id)}
            {hint && <span className="cms-form-hint">{hint}</span>}
          </div>
        );
      })}

      {error && (
        <p className="cms-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="cms-form-actions">
        <button type="submit" className="cms-button cms-button-primary" disabled={busy || uploading}>
          {busy ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="cms-button" onClick={onCancel} disabled={busy || uploading}>
          Cancel
        </button>

        {onDelete &&
          (confirmingDelete ? (
            <span className="cms-form-confirm">
              <button
                type="button"
                className="cms-button cms-button-danger"
                onClick={handleDelete}
                disabled={busy}
              >
                Really delete
              </button>
              <button
                type="button"
                className="cms-button"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
              >
                Keep
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="cms-button cms-button-danger"
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

export default ItemForm;
