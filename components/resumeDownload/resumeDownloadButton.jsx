'use client';

import React from 'react';

const resumePdf = '/assets/Tristan_Spear_Resume.pdf';

function ResumeDownloadButton() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'Tristan_Spear_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      className="download-button-3d"
      onClick={handleDownload}
      aria-label="Download resume PDF"
    >
      <span>Download My Resume</span>
      <span>Download My Resume</span>
      <span>Download My Resume</span>
      <span>Download My Resume</span>
    </button>
  );
}

export default ResumeDownloadButton;
