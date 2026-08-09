'use client';

import React from 'react';
import ExperienceItem from './experienceItem';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import { emptyItem, getCollectionConfig, toLines } from '@/lib/collections';
import './experience.css';

const config = getCollectionConfig('experience');

function Experience({ items = [], canEdit = false }) {
  const collection = useCollection('experience', items);

  return (
    <section className="experience-section">
      <div className="experience-content">
        <h2 className="experience-title hover-underline">Experience</h2>

        {canEdit && (
          <div className="cms-toolbar">
            <button
              type="button"
              className="cms-add"
              onClick={() => collection.startAdding()}
              disabled={Boolean(collection.addingTo)}
            >
              + Add role
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

        <div className="experience-list">
          {collection.items.map((row) =>
            canEdit && collection.editingId === row.id ? (
              <ItemForm
                key={row.id}
                fields={config.fields}
                initialValues={row}
                submitLabel="Save"
                onSubmit={(values) => collection.save(row.id, values)}
                onCancel={collection.cancel}
                onDelete={() => collection.remove(row.id)}
              />
            ) : (
              <EditableItem
                key={row.id}
                canEdit={canEdit}
                onEdit={() => collection.startEditing(row.id)}
              >
                <ExperienceItem
                  experience={{
                    title: row.title,
                    company: row.company,
                    location: row.location,
                    date: row.date_range,
                    thumbnail: row.thumbnail,
                    bullets: toLines(row.bullets),
                  }}
                />
              </EditableItem>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Experience;
