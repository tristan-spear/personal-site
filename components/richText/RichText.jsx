import React from 'react';

/**
 * Renders the tiny markup the CMS supports: `**bold**`, `*italic*` and line
 * breaks.
 *
 * Deliberately not HTML — stored copy is rendered as React nodes, so nothing
 * typed into the editor can inject markup or script into the page.
 */
function RichText({ text }) {
  return String(text ?? '')
    .split('\n')
    .map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {formatLine(line)}
      </React.Fragment>
    ));
}

// Bold is matched first so the ** in **bold** is never read as an italic pair.
function formatLine(line) {
  return line.split(/\*\*(.+?)\*\*/g).map((chunk, index) =>
    index % 2 === 1 ? (
      <strong key={index}>{chunk}</strong>
    ) : (
      <React.Fragment key={index}>{italics(chunk)}</React.Fragment>
    )
  );
}

function italics(chunk) {
  return chunk
    .split(/\*(.+?)\*/g)
    .map((part, index) => (index % 2 === 1 ? <i key={index}>{part}</i> : part));
}

export default RichText;
