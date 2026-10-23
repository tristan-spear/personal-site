'use client';

import * as React from 'react';
import './card-deck-carousel.css';

export function wrap(i, n) {
  return n ? ((i % n) + n) % n : 0;
}

/** Resting pose of a card `depth` places down the pile. Only the top four show. */
export function deckPose(depth, tilt, reduce = false) {
  const d = Math.min(depth, 3);
  return {
    y: d ? -d * 16 : 0,
    scale: 1 - d * 0.055,
    rot: depth === 0 || reduce ? 0 : tilt,
    opacity: depth > 3 ? 0 : 1,
    shade: 1 - d * 0.07,
  };
}

/** A stable, slightly random tilt per card, in [-max, max] degrees. */
export function tiltFor(i, max) {
  const u = (((i + 1) * 2654435761) >>> 0) / 4294967296;
  return (u * 2 - 1) * max;
}

/** Did the drag end as a throw? dx in px, vx in px/ms, w = card width. */
export function isThrow(dx, vx, w) {
  return Math.abs(dx) > w * 0.28 || (Math.abs(vx) > 0.55 && Math.abs(dx) > 24);
}

function CardDeckCarousel({
  slides = [],
  cardWidth = '100%',
  aspect = '3 / 2',
  scatter = 8,
  autoplay = 0,
  onChange,
  onSelect,
  className,
  style,
  ariaLabel = 'Image carousel',
}) {
  const n = slides.length;
  const [top, setTop] = React.useState(0);
  const [over, setOver] = React.useState(null);
  const rootRef = React.useRef(null);
  const deckRef = React.useRef(null);
  const busy = React.useRef(false);
  const lastTouch = React.useRef(0);
  const topRef = React.useRef(0);
  topRef.current = top;
  const reduce = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const later = (fn, ms) => window.setTimeout(fn, ms);

  const throwTop = React.useCallback(
    (dirX, fromX = 0, fromY = 0, dirY = 0) => {
      const w = deckRef.current?.offsetWidth || 400;
      if (busy.current || n < 2) return;
      busy.current = true;
      const i = topRef.current;
      const sx = dirX >= 0 ? 1 : -1;
      setOver({ i, x: fromX + sx * w * 1.25, y: fromY + dirY * 0.4 - 40, r: sx * 16, mode: 'fly' });
      later(() => {
        setOver(null);
        setTop((t) => wrap(t + 1, n));
        busy.current = false;
      }, reduce ? 200 : 430);
    },
    [n, reduce],
  );

  const pullBack = React.useCallback(() => {
    const w = deckRef.current?.offsetWidth || 400;
    if (busy.current || n < 2) return;
    busy.current = true;
    const i = wrap(topRef.current - 1, n);
    setOver({ i, x: -w * 1.25, y: -40, r: -16, mode: 'snap' });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setOver({ i, x: 0, y: 0, r: 0, mode: 'fly' });
        later(() => {
          setOver(null);
          setTop(i);
          busy.current = false;
        }, reduce ? 200 : 450);
      }),
    );
  }, [n, reduce]);

  React.useEffect(() => {
    onChange?.(top);
  }, [top, onChange]);

  React.useEffect(() => {
    if (!autoplay || n < 2) return undefined;
    const root = rootRef.current;
    let seen = true;
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
    });
    if (root) io.observe(root);
    const t = window.setInterval(() => {
      if (!seen || document.hidden || performance.now() - lastTouch.current < autoplay) return;
      throwTop(1);
    }, autoplay);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [autoplay, n, throwTop]);

  const drag = React.useRef(null);
  const moved = React.useRef(false);

  const onDown = (e) => {
    lastTouch.current = performance.now();
    if (busy.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers reject capture on synthetic events.
    }
    moved.current = false;
    drag.current = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: e.timeStamp, vx: 0 };
  };

  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.vx = 0.8 * ((e.clientX - d.lx) / dt) + 0.2 * d.vx;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 8) moved.current = true;
    setOver({ i: topRef.current, x: dx, y: dy, r: reduce ? 0 : dx * 0.05, mode: 'drag' });
  };

  const onUp = (e) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const w = deckRef.current?.offsetWidth || 400;
    if (isThrow(dx, d.vx, w)) {
      throwTop(dx, dx, dy, dy);
      return;
    }
    setOver(null);
  };

  const onActivate = () => {
    if (busy.current || moved.current) return;
    const slide = slides[topRef.current];
    if (slide?.image) {
      onSelect?.({
        src: slide.image,
        alt: slide.alt || slide.title || '',
        index: topRef.current,
      });
    }
  };

  const onKey = (e) => {
    lastTouch.current = performance.now();
    if (e.key === 'ArrowRight') throwTop(1);
    else if (e.key === 'ArrowLeft') pullBack();
    else return;
    e.preventDefault();
  };

  const current = slides[top] || {};

  if (n === 0) return null;

  return (
    <div
      ref={rootRef}
      className={['cd-root', className].filter(Boolean).join(' ')}
      style={{
        '--cd-w': cardWidth,
        '--cd-aspect': aspect,
        ...style,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="cd-stage">
        {n > 1 && (
          <button
            type="button"
            className="cd-btn cd-btn-prev"
            aria-label="Previous photo"
            onClick={() => {
              lastTouch.current = performance.now();
              pullBack();
            }}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
        )}
        <div ref={deckRef} className="cd-deck">
          {slides.map((slide, i) => {
            const depth = wrap(i - top, n);
            const pose = deckPose(depth, tiltFor(i, scatter), reduce);
            const o = over && over.i === i ? over : null;
            const isTop = depth === 0;
            const transform = o
              ? `translate(${o.x}px, ${o.y}px) rotate(${o.r}deg)`
              : `translateY(${pose.y}px) scale(${pose.scale}) rotate(${pose.rot.toFixed(2)}deg)`;

            return (
              <div
                key={slide.image || i}
                className="cd-card"
                data-top={isTop ? '1' : '0'}
                data-drag={o?.mode === 'drag' ? '1' : '0'}
                data-fly={o?.mode === 'fly' ? '1' : '0'}
                data-snap={o?.mode === 'snap' ? '1' : '0'}
                style={{
                  transform,
                  zIndex: o ? n + 1 : n - depth,
                  opacity: o ? 1 : pose.opacity,
                  filter: o || isTop ? 'none' : `brightness(${pose.shade})`,
                }}
                aria-hidden={isTop ? undefined : true}
                onPointerDown={isTop ? onDown : undefined}
                onPointerMove={isTop ? onMove : undefined}
                onPointerUp={isTop ? onUp : undefined}
                onPointerCancel={isTop ? onUp : undefined}
                onClick={isTop ? onActivate : undefined}
              >
                {slide.image ? (
                  <img src={slide.image} alt={isTop ? slide.alt || slide.title || '' : ''} draggable={false} />
                ) : null}
              </div>
            );
          })}
        </div>

        {n > 1 && (
          <button
            type="button"
            className="cd-btn cd-btn-next"
            aria-label="Next photo"
            onClick={() => {
              lastTouch.current = performance.now();
              throwTop(1);
            }}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="cd-sr" aria-live="polite">
        {`Photo ${top + 1} of ${n}${current.alt || current.title ? `: ${current.alt || current.title}` : ''}`}
      </div>
    </div>
  );
}

export default CardDeckCarousel;
