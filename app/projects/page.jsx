import React from 'react';
import ProjectsBoard from '@/components/projects/ProjectsBoard';
import CursorDrivenParticleTypography from '@/components/particleTypography/CursorDrivenParticleTypography';
import GithubCalendar from '@/components/githubCalendar/GithubCalendar';
import { isEditor } from '@/lib/auth';
import { getCollectionItems } from '@/lib/content';
import './portfolio.css';

async function Portfolio() {
  const [projects, canEdit] = await Promise.all([
    getCollectionItems('projects'),
    isEditor(),
  ]);

  return (
    <div className="portfolio">
      <header className="portfolio-hero">
        <h1 className="portfolio-hero-title">
          <span className="portfolio-hero-title-label">Projects</span>
          <CursorDrivenParticleTypography
            text="Projects"
            fontSize={140}
            fontFamily="'Outfit', -apple-system, sans-serif"
            fontWeight="300"
            particleDensity={4}
            particleSize={1.4}
            dispersionStrength={20}
          />
        </h1>

        <div className="portfolio-hero-calendar">
          <GithubCalendar username="tristan-spear" />
        </div>
      </header>

      <ProjectsBoard projects={projects} canEdit={canEdit} />
    </div>
  );
}

export default Portfolio;
