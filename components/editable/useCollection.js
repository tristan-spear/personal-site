'use client';

import { useState } from 'react';

/**
 * Client-side state for one editable collection.
 *
 * Every mutating endpoint replies with the full, freshly ordered list, so the
 * client never has to re-sort or guess where a new item landed.
 */
export function useCollection(name, initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [addingTo, setAddingTo] = useState(null);

  const endpoint = `/api/collection/${name}`;

  const request = async (url, options) => {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Something went wrong.');
    }
    setItems(data.items);
    return data;
  };

  return {
    items,
    editingId,
    addingTo,
    /** `group` lets a page with several sections track which one is adding. */
    startAdding: (group = true) => {
      setEditingId(null);
      setAddingTo(group);
    },
    startEditing: (id) => {
      setAddingTo(null);
      setEditingId(id);
    },
    cancel: () => {
      setAddingTo(null);
      setEditingId(null);
    },
    add: async (values) => {
      await request(endpoint, { method: 'POST', body: JSON.stringify(values) });
      setAddingTo(null);
    },
    save: async (id, values) => {
      await request(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(values) });
      setEditingId(null);
    },
    remove: async (id) => {
      await request(`${endpoint}/${id}`, { method: 'DELETE' });
      setEditingId(null);
    },
  };
}

export default useCollection;
