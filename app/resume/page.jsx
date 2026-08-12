import React from 'react';
import Education from '@/components/education/Education';
import Experience from '@/components/experience/experience';
import Skills from '@/components/skills/skills';
import ResumeDownloadButton from '@/components/resumeDownload/resumeDownloadButton';
import ResumeUpload from '@/components/resumeUpload/ResumeUpload';
import { isEditor } from '@/lib/auth';
import { getCollectionItems } from '@/lib/content';
import './resume.css';

async function Resume() {
  const [education, experience, skills, canEdit] = await Promise.all([
    getCollectionItems('education'),
    getCollectionItems('experience'),
    getCollectionItems('skills'),
    isEditor(),
  ]);

  return (
    <div className="resume">
      <section className="download-section">
        {canEdit && <ResumeUpload />}
        <div className="download-content">
          <ResumeDownloadButton />
        </div>
      </section>
      <Education items={education} canEdit={canEdit} />
      <Experience items={experience} canEdit={canEdit} />
      <Skills items={skills} canEdit={canEdit} />
    </div>
  );
}

export default Resume;
