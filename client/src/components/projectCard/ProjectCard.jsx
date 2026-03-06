import React, { useState } from 'react';
import './projectCard.css';

function ProjectCard({ project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, shortDescription, technologies, media, links } = project;
  const cardDescription = shortDescription ?? description;
  const hasLinks = links?.length > 0;

  const mediaContent =
    media.type === 'iframe' ? (
      <iframe
        src={media.src}
        title={title}
        className="project-media-iframe"
      />
    ) : (
      <img src={media.src} alt={title} className="project-media-image" />
    );

  return (
    <>
      <button
        type="button"
        className="project-card gradient-border-wrapper"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="gradient-border gradient-border-left" />
        <span className="gradient-border gradient-border-top" />
        <span className="gradient-border gradient-border-right" />
        <span className="gradient-border gradient-border-bottom" />
        <div className="project-card-preview">
          {media.type === 'iframe' ? (
            <img
              src={media.previewImage || media.src}
              alt={title}
              className="project-media-image"
            />
          ) : (
            mediaContent
          )}
        </div>
        <div className="project-card-body">
          <h3 className="project-card-title">{title}</h3>
          <p className="project-card-description">{cardDescription}</p>
          <p className="project-card-tech">
            {technologies.join(' · ')}
          </p>
          {hasLinks && (
            <div className="project-card-links">
              {links.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </button>

      {isModalOpen && (
        <div
          className="project-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsModalOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Escape' && setIsModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="project-modal-title" className="project-modal-title">
              {title}
            </h2>
            <div className="project-modal-media">
              {mediaContent}
            </div>
            <p className="project-modal-description">{description}</p>
            <p className="project-modal-tech">{technologies.join(' · ')}</p>
            {hasLinks && (
              <div className="project-modal-links">
                {links.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-link"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectCard;
