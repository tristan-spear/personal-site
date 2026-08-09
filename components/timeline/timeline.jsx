'use client';

import React, { useState } from 'react';
import { emptyItem, getCollectionConfig } from '@/lib/collections';
import TimelineItemForm from './TimelineItemForm';
import './timeline.css';

const calPolyThumbnail = '/assets/cp.png';
const config = getCollectionConfig('timeline');
const ENDPOINT = '/api/collection/timeline';

async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}

function Timeline({ events: initialEvents = [], canEdit = false }) {
  const [events, setEvents] = useState(initialEvents);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const startAdding = () => {
    setEditingId(null);
    setAdding(true);
  };

  const startEditing = (id) => {
    setAdding(false);
    setEditingId(id);
  };

  const addEntry = async (values) => {
    const { items } = await request(ENDPOINT, { method: 'POST', body: JSON.stringify(values) });
    setEvents(items);
    setAdding(false);
  };

  const saveEntry = async (id, values) => {
    const { items } = await request(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
    setEvents(items);
    setEditingId(null);
  };

  const deleteEntry = async (id) => {
    const { items } = await request(`${ENDPOINT}/${id}`, { method: 'DELETE' });
    setEvents(items);
    setEditingId(null);
  };

  return (
    <>
      {canEdit && (
        <div className="timeline-toolbar">
          <button type="button" className="timeline-add" onClick={startAdding} disabled={adding}>
            + Add entry
          </button>
        </div>
      )}

      {canEdit && adding && (
        <TimelineItemForm
          fields={config.fields}
          initialValues={emptyItem(config)}
          submitLabel="Add to top"
          onSubmit={addEntry}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="timeline-container">
        <div className="timeline-line"></div>
        {events.map((event, index) => {
          const isEditing = canEdit && editingId === event.id;
          return (
            <div
              key={event.id}
              className="timeline-item"
              onMouseEnter={() => !isEditing && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="timeline-node-wrapper">
                <div
                  className={`timeline-node ${hoveredIndex === index ? 'hovered' : ''}`}
                  style={{ '--node-color': event.color }}
                >
                  <div className="timeline-node-glow"></div>
                </div>
                <div
                  className={`timeline-thumbnail ${hoveredIndex === index ? 'hovered' : ''} ${event.title.includes('Udemy') ? 'udemy-thumbnail' : ''} ${event.thumbnail === calPolyThumbnail ? 'calpoly-thumbnail' : ''}`}
                  style={{ '--node-color': event.color }}
                >
                  <img src={event.thumbnail} alt={event.title} />
                </div>
              </div>
              <div className={`timeline-content ${hoveredIndex === index ? 'hovered' : ''}`}>
                {isEditing ? (
                  <TimelineItemForm
                    fields={config.fields}
                    initialValues={event}
                    submitLabel="Save"
                    onSubmit={(values) => saveEntry(event.id, values)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => deleteEntry(event.id)}
                  />
                ) : (
                  <>
                    {event.event_date && (
                      <div className="timeline-date" style={{ color: event.color }}>
                        {event.event_date}
                      </div>
                    )}
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.description}</div>
                    {canEdit && (
                      <button
                        type="button"
                        className="timeline-edit"
                        onClick={() => startEditing(event.id)}
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Timeline;
