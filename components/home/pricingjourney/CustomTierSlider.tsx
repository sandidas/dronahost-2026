import { useCallback, useEffect, useRef, useState } from "react";

interface CustomTierSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  tierNames?: string[];
}

/* Half the thumb width — rail & everything is inset by this amount */
const INSET = 18; // px  (thumb is 36px wide)

const CustomTierSlider = ({
  value,
  min,
  max,
  onChange,
  tierNames,
}: CustomTierSliderProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  /* ── map clientX → step, within the inset rail ── */
  const resolveStep = useCallback(
    (clientX: number) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const railW = rect.width; // wrapRef IS the inset rail
      const x = Math.min(Math.max(clientX - rect.left, 0), railW);
      onChange(Math.round((x / railW) * (max - min)) + min);
    },
    [min, max, onChange]
  );

  /* ── mouse ── */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setDragging(true);
    resolveStep(e.clientX);
  };
  useEffect(() => {
    const mv = (e: MouseEvent) => { if (isDragging.current) resolveStep(e.clientX); };
    const up = () => { if (isDragging.current) { isDragging.current = false; setDragging(false); } };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [resolveStep]);

  /* ── touch ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setDragging(true);
    resolveStep(e.touches[0].clientX);
  };
  useEffect(() => {
    const mv = (e: TouchEvent) => { if (isDragging.current) resolveStep(e.touches[0].clientX); };
    const up = () => { isDragging.current = false; setDragging(false); };
    window.addEventListener("touchmove", mv, { passive: true });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, [resolveStep]);

  /* ── keyboard ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft"  && value > min) onChange(value - 1);
    if (e.key === "ArrowRight" && value < max) onChange(value + 1);
    if (e.key === "Home") onChange(min);
    if (e.key === "End")  onChange(max);
  };

  const tooltipLabel = tierNames?.[value - min] ?? `Tier ${value - min + 1}`;

  return (
    <div className="tsl-root">

      {/*
        OUTER WRAPPER — provides the vertical hit area and positions the thumb.
        Horizontally it matches the inset rail exactly (margin: 0 INSET px).
      */}
      <div className="tsl-hit" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>

        {/* THE RAIL — starts at first dot, ends at last dot */}
        <div ref={wrapRef} className="tsl-rail">

          {/* FILL */}
          <div className="tsl-fill" style={{ width: `${pct}%` }} />

          {/* DOTS */}
          {steps.map((step) => {
            const dotPct = max === min ? 0 : ((step - min) / (max - min)) * 100;
            return (
              <span
                key={step}
                className={[
                  "tsl-dot",
                  step <  value ? "tsl-dot--filled" : "",
                  step === value ? "tsl-dot--active" : "",
                ].filter(Boolean).join(" ")}
                style={{ left: `${dotPct}%` }}
              />
            );
          })}

          {/* THUMB — left:0% sits at first dot, left:100% at last dot */}
          <div
            className={`tsl-thumb${dragging ? " tsl-thumb--drag" : ""}`}
            style={{ left: `${pct}%` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label="Select tier"
          >
            {/* TOOLTIP */}
            <div className={`tsl-tooltip${dragging || hovered ? " tsl-tooltip--visible" : ""}`}>
              {tooltipLabel}
              <span className="tsl-tooltip-arrow" />
            </div>

            {/* CHEVRONS */}
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
              <path d="M5.5 1.5L2.5 4.5L5.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
              <path d="M3.5 1.5L6.5 4.5L3.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

        </div>{/* /tsl-rail */}
      </div>{/* /tsl-hit */}

      {/* LABELS — aligned to same inset */}
      {tierNames && (
        <div className="tsl-labels">
          {tierNames.map((name, i) => {
            const lPct = max === min ? 0 : (i / (max - min)) * 100;
            return (
              <span
                key={name}
                className={`tsl-label${i === value - min ? " tsl-label--active" : ""}`}
                style={{ left: `${lPct}%` }}
              >
                {name}
              </span>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .tsl-root {
          width: 100%;
          margin-top: 14px;
          user-select: none;
          -webkit-user-select: none;
        }

        /* Full-width hit area — vertical padding makes it easy to grab */
        .tsl-hit {
          width: 100%;
          padding: 14px 0;
          cursor: pointer;
          /* Shrink horizontally so the rail is inset */
          box-sizing: border-box;
          padding-left: ${INSET}px;
          padding-right: ${INSET}px;
        }

        /* THE RAIL — no extra caps, starts/ends at first/last dot */
        .tsl-rail {
          position: relative;
          width: 100%;
          height: 8px;
          background: #dbeafe;
          border-radius: 999px;
          overflow: visible;
        }

        /* FILL */
        .tsl-fill {
          position: absolute;
          left: 0; top: 0;
          height: 100%;
          background: #0d2137;
          border-radius: 999px;
          transition: width 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        /* DOTS */
        .tsl-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #bfdbfe;
          pointer-events: none;
          transition: background 0.18s ease;
          z-index: 1;
        }
        .tsl-dot--filled { background: #1e3a5f; }
        .tsl-dot--active { opacity: 0; }

        /* THUMB */
        .tsl-thumb {
          position: absolute;
          top: 50%;
          /* translate(-50%) centres thumb on the left% point */
          transform: translate(-50%, -50%);
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0d2137;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 1.5px #0d2137, 0 4px 12px rgba(13,33,55,.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1px;
          cursor: grab;
          transition:
            left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.15s ease,
            transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          outline: none;
          padding: 0;
        }
        .tsl-thumb:hover {
          box-shadow: 0 0 0 1.5px #0d2137, 0 6px 20px rgba(13,33,55,.45);
          transform: translate(-50%, -50%) scale(1.1);
        }
        .tsl-thumb--drag {
          cursor: grabbing;
          transition: box-shadow 0.1s ease, transform 0.1s ease;
          transform: translate(-50%, -50%) scale(1.16);
          box-shadow: 0 0 0 5px rgba(13,33,55,.1), 0 0 0 1.5px #0d2137, 0 8px 24px rgba(13,33,55,.5);
        }
        .tsl-thumb:focus-visible {
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px #0d2137;
        }

        /* TOOLTIP */
        .tsl-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: #0d2137;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tsl-tooltip--visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0px);
        }
        .tsl-tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px; height: 4px;
          background: #0d2137;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }

        /* LABELS */
        .tsl-labels {
          position: relative;
          height: 22px;
          margin-top: 8px;
          padding-left: ${INSET}px;
          padding-right: ${INSET}px;
          box-sizing: border-box;
        }
        .tsl-label {
          position: absolute;
          transform: translateX(-50%);
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          transition: color 0.18s ease, font-weight 0.18s ease;
          pointer-events: none;
          white-space: nowrap;
        }
        .tsl-label--active {
          color: #0d2137;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default CustomTierSlider;