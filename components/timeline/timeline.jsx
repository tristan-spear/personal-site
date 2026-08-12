'use client';

import React, { useState } from 'react';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import { mediaUrl } from '@/lib/media';
import { emptyItem, getCollectionConfig } from '@/lib/collections';
import './timeline.css';

const calPolyThumbnail = '/assets/cp.png';
const config = getCollectionConfig('timeline');

function Timeline({ events = [], canEdit = false }) {
  const collection = useCollection('timeline', events);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      {canEdit && (
        <div className="cms-toolbar">
          <button
            type="button"
            className="cms-add"
            onClick={() => collection.startAdding()}
            disabled={Boolean(collection.addingTo)}
          >
            + Add entry
          </button>
        </div>
      )}

      {canEdit && collection.addingTo && (
        <ItemForm
          fields={config.fields}
          initialValues={emptyItem(config)}
          submitLabel="Add to top"
          onSubmit={collection.add}
          onCancel={collection.cancel}
        />
      )}

      <div className="timeline-container">
        <div className="timeline-line"></div>
        {collection.items.map((event, index) => {
          const isEditing = canEdit && collection.editingId === event.id;
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
                  <img src={mediaUrl(event.thumbnail)} alt={event.title} />
                </div>
              </div>
              <div className={`timeline-content ${hoveredIndex === index ? 'hovered' : ''}`}>
                {isEditing ? (
                  <ItemForm
                    fields={config.fields}
                    initialValues={event}
                    submitLabel="Save"
                    onSubmit={(values) => collection.save(event.id, values)}
                    onCancel={collection.cancel}
                    onDelete={() => collection.remove(event.id)}
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
                        className="cms-edit"
                        onClick={() => collection.startEditing(event.id)}
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
