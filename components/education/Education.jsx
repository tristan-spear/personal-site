'use client';

import React from 'react';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import RichText from '@/components/richText/RichText';
import { emptyItem, getCollectionConfig } from '@/lib/collections';

const config = getCollectionConfig('education');

function Education({ items = [], canEdit = false }) {
  const collection = useCollection('education', items);

  return (
    <section className="education-section">
      <div className="education-content">
        <h2 className="education-title hover-underline">Education</h2>

        {canEdit && (
          <div className="cms-toolbar">
            <button
              type="button"
              className="cms-add"
              onClick={() => collection.startAdding()}
              disabled={Boolean(collection.addingTo)}
            >
              + Add degree
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

        <div className="education-list">
          {collection.items.map((item) =>
            canEdit && collection.editingId === item.id ? (
              <ItemForm
                key={item.id}
                fields={config.fields}
                initialValues={item}
                submitLabel="Save"
                onSubmit={(values) => collection.save(item.id, values)}
                onCancel={collection.cancel}
                onDelete={() => collection.remove(item.id)}
              />
            ) : (
              <EditableItem
                key={item.id}
                canEdit={canEdit}
                onEdit={() => collection.startEditing(item.id)}
              >
                <div className="education-item">
                  <img src={item.thumbnail} alt={item.school} className="education-thumbnail" />
                  <div className="education-info">
                    <div className="education-degree">{item.degree}</div>
                    <div className="education-school">{item.school}</div>
                    <div className="education-years">
                      <RichText text={item.years} />
                    </div>
                  </div>
                </div>
              </EditableItem>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Education;
