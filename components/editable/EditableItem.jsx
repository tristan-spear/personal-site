'use client';

import React from 'react';
import './itemForm.css';

/**
 * Adds an Edit button to one rendered item in a collection.
 *
 * Returns its children untouched when editing is off, so the public markup is
 * exactly what the page had before the CMS existed.
 */
function EditableItem({ canEdit, onEdit, children }) {
  if (!canEdit) return children;

  return (
    <div className="cms-card">
      {children}
      <button type="button" className="cms-edit" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

export default EditableItem;
