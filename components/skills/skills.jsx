'use client';

import React from 'react';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import { emptyItem, getCollectionConfig, toLines } from '@/lib/collections';
import './skills.css';

const config = getCollectionConfig('skills');

function Skills({ items = [], canEdit = false }) {
  const collection = useCollection('skills', items);

  return (
    <section className="skills-section">
      <div className="skills-content">
        <h2 className="skills-title hover-underline">Technical Skills</h2>

        {canEdit && (
          <div className="cms-toolbar">
            <button
              type="button"
              className="cms-add"
              onClick={() => collection.startAdding()}
              disabled={Boolean(collection.addingTo)}
            >
              + Add category
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

        <div className="skills-list">
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
                <div className="skills-category">
                  <h3 className="skills-category-title">{row.category}</h3>
                  <div className="skills-items">
                    {toLines(row.items).map((skill) => (
                      <div key={skill} className="skill-item-wrapper">
                        <span className="skill-border skill-border-top"></span>
                        <span className="skill-border skill-border-right"></span>
                        <span className="skill-border skill-border-bottom"></span>
                        <span className="skill-border skill-border-left"></span>
                        <span className="skill-item">{skill}</span>
                      </div>
                    ))}
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

export default Skills;
