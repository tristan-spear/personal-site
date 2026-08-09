'use client';

import React from 'react';
import ProjectCard from '@/components/projectCard/ProjectCard';
import EditableItem from '@/components/editable/EditableItem';
import ItemForm from '@/components/editable/ItemForm';
import useCollection from '@/components/editable/useCollection';
import { emptyItem, getCollectionConfig, toProjectCard } from '@/lib/collections';

const config = getCollectionConfig('projects');
const SECTIONS = config.fields.find((field) => field.name === 'category').options;

function ProjectsBoard({ projects = [], canEdit = false }) {
  const collection = useCollection('projects', projects);

  return (
    <>
      {SECTIONS.map((section) => (
        <section className="portfolio-section" key={section.value}>
          <h2 className="portfolio-section-title">{section.label}</h2>

          {canEdit && (
            <div className="cms-toolbar">
              <button
                type="button"
                className="cms-add"
                onClick={() => collection.startAdding(section.value)}
                disabled={collection.addingTo === section.value}
              >
                + Add project
              </button>
            </div>
          )}

          {canEdit && collection.addingTo === section.value && (
            <ItemForm
              fields={config.fields}
              initialValues={{ ...emptyItem(config), category: section.value }}
              submitLabel="Add to top"
              onSubmit={collection.add}
              onCancel={collection.cancel}
            />
          )}

          <div className="portfolio-grid">
            {collection.items
              .filter((project) => project.category === section.value)
              .map((project) =>
                canEdit && collection.editingId === project.id ? (
                  <ItemForm
                    key={project.id}
                    fields={config.fields}
                    initialValues={project}
                    submitLabel="Save"
                    onSubmit={(values) => collection.save(project.id, values)}
                    onCancel={collection.cancel}
                    onDelete={() => collection.remove(project.id)}
                  />
                ) : (
                  <EditableItem
                    key={project.id}
                    canEdit={canEdit}
                    onEdit={() => collection.startEditing(project.id)}
                  >
                    <ProjectCard project={toProjectCard(project)} />
                  </EditableItem>
                )
              )}
          </div>
        </section>
      ))}
    </>
  );
}

export default ProjectsBoard;
