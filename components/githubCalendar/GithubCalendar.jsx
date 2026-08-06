'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import './githubCalendar.css';

const GLOW_COLORS = {
  green: '#39d353',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  gray: '#ffffff'
};

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

function formatDate(date) {
  return DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`));
}

// The API returns a flat list of days; GitHub renders one column per week with
// rows running Sunday to Saturday, so pad the partial first and last weeks.
function groupIntoWeeks(days) {
  const weeks = [];
  let week = new Array(7).fill(null);

  days.forEach((day) => {
    const dayOfWeek = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    week[dayOfWeek] = day;
    if (dayOfWeek === 6) {
      weeks.push(week);
      week = new Array(7).fill(null);
    }
  });

  if (week.some(Boolean)) weeks.push(week);
  return weeks;
}

export default function GithubCalendar({
  username,
  variant = 'default',
  shape = 'rounded',
  glowIntensity = 5,
  className = '',
  showTotal = true,
  colorSchema = 'green'
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Failed to fetch GitHub data');
        setData(await response.json());
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [username]);

  const weeks = useMemo(() => groupIntoWeeks(data?.contributions || []), [data]);

  if (error) {
    return (
      <div className={`github-calendar-error ${className}`.trim()}>
        Could not load GitHub contributions: {error}
      </div>
    );
  }

  if (loading) {
    return <div className={`github-calendar-skeleton ${className}`.trim()} />;
  }

  const total = data?.total?.lastYear ?? 0;

  const handleEnter = (day, event) => {
    const cell = event.currentTarget;
    setHovered({
      date: day.date,
      count: day.count,
      x: cell.offsetLeft + cell.offsetWidth / 2,
      y: cell.offsetTop
    });
  };

  return (
    <div
      className={`github-calendar github-calendar-${colorSchema} github-calendar-${variant} ${className}`.trim()}
    >
      {showTotal && (
        <div className="github-calendar-header">
          <a
            className="github-calendar-user"
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span>@{username}</span>
          </a>
          <span className="github-calendar-total">
            {total.toLocaleString()} contributions in the last year
          </span>
        </div>
      )}

      <div className="github-calendar-scroll">
        <div
          ref={gridRef}
          className={`github-calendar-grid github-calendar-shape-${shape}`}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered && (
            <div
              className="github-calendar-tooltip"
              style={{ left: `${hovered.x}px`, top: `${hovered.y}px` }}
            >
              <strong>{hovered.count}</strong> contribution{hovered.count === 1 ? '' : 's'} on{' '}
              {formatDate(hovered.date)}
            </div>
          )}

          {weeks.map((week, weekIndex) => (
            <div key={week.find(Boolean)?.date || weekIndex} className="github-calendar-week">
              {week.map((day, dayIndex) =>
                day ? (
                  <div
                    key={day.date}
                    className={`github-calendar-day github-calendar-level-${day.level}`}
                    style={{
                      animationDelay: `${(weekIndex + dayIndex) * 10}ms`,
                      boxShadow:
                        variant === 'city-lights' && day.level > 0
                          ? `0 0 ${day.count > 3 ? glowIntensity * 1.5 : glowIntensity}px ${
                              GLOW_COLORS[colorSchema] || GLOW_COLORS.green
                            }`
                          : undefined
                    }}
                    onMouseEnter={(event) => handleEnter(day, event)}
                  />
                ) : (
                  <div key={`empty-${dayIndex}`} className="github-calendar-day-empty" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
