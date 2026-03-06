import React from 'react';
import ProjectCard from '../../components/projectCard/ProjectCard';
import memoryAllocatorImage from '../../assets/memory_allocator.png';
import './portfolio.css';

const WEB_PROJECTS = [
  {
    id: 'web-1',
    title: 'Task Manager App',
    shortDescription: 'Full-stack task manager with drag-and-drop boards, due dates, and team sharing.',
    description: 'A full-stack task manager with drag-and-drop boards, due dates, and team sharing. Built as a learning project for React and Node.js.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    media: {
      type: 'image',
      src: 'https://placehold.co/640x400/1a1a2e/4a6fa5?text=Task+Manager',
    },
  },
  {
    id: 'web-2',
    title: 'Portfolio CMS',
    shortDescription: 'Content management dashboard for updating portfolio pieces and blog posts without touching code.',
    description: 'A small content management dashboard for updating portfolio pieces and blog posts without touching code.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
    media: {
      type: 'image',
      src: 'https://placehold.co/640x400/16213e/0f3460?text=Portfolio+CMS',
    },
  },
];

const EMBEDDED_PROJECTS = [
  {
    id: 'emb-1',
    title: 'Custom Memory Allocator & Deallocator (C, C++)',
    shortDescription: 'Custom malloc/free in C—doubly linked heap, best-fit, coalescing, and program break management.',
    description: 'A from-scratch implementation of dynamic memory allocation in C. Uses a doubly linked list heap with in-band metadata, best-fit allocation, block splitting and coalescing, and program break management. Includes an analyze() utility for heap inspection and a C++ version with simulated program break for testing on macOS.',
    technologies: ['C', 'C++', 'Systems Programming'],
    media: {
      type: 'image',
      src: memoryAllocatorImage,
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/tristan-spear/memory-allocator-deallocator' },
    ],
  },
  {
    id: 'emb-2',
    title: 'BLE Beacon Tracker',
    shortDescription: 'nRF52 firmware that broadcasts as iBeacon and logs proximity events for indoor positioning.',
    description: 'Custom firmware for nRF52 boards that broadcasts as iBeacon and logs proximity events to a local server for indoor positioning.',
    technologies: ['C', 'nRF52', 'Zephyr RTOS', 'Python'],
    media: {
      type: 'image',
      src: 'https://placehold.co/640x400/0f3460/e94560?text=BLE+Tracker',
    },
  },
];

function Portfolio() {
  return (
    <div className="portfolio">
      <header className="portfolio-hero">
        <h1 className="portfolio-hero-title hover-underline">Projects</h1>
        <p className="portfolio-hero-intro">
          Web applications and embedded systems I’ve built or contributed to.
        </p>
      </header>

      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Web Projects</h2>
        <div className="portfolio-grid">
          {WEB_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="portfolio-section">
        <h2 className="portfolio-section-title">Embedded Projects</h2>
        <div className="portfolio-grid">
          {EMBEDDED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
