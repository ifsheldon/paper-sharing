"use client";

import {
  ArrowLeft,
  ArrowRight,
  Expand,
  NotebookTabs,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import Image from "next/image";
import {
  type CSSProperties,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type SlideFigure,
  type SlidePoint,
  type SlideTemplate,
  sectionOrder,
  slideTemplates,
  templatePrinciples,
} from "./deck-data";
import {
  PRESENTER_NOTES_CHANNEL,
  PRESENTER_NOTES_STORAGE_KEY,
  type PresenterNotesState,
} from "./presenter-notes-state";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const activeSlide = slideTemplates[activeIndex];
  const notesWindowRef = useRef<Window | null>(null);
  const notesChannelRef = useRef<BroadcastChannel | null>(null);
  const progress = ((activeIndex + 1) / slideTemplates.length) * 100;

  const currentSectionPosition = useMemo(
    () => sectionOrder.indexOf(activeSlide.section),
    [activeSlide.section],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "n") {
        event.preventDefault();
        setActiveIndex((index) =>
          Math.min(index + 1, slideTemplates.length - 1),
        );
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }

      if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(slideTemplates.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    publishPresenterNotes(activeSlide, activeIndex, notesChannelRef);
  }, [activeIndex, activeSlide]);

  useEffect(
    () => () => {
      notesChannelRef.current?.close();
    },
    [],
  );

  const goPrevious = () => {
    setActiveIndex((index) => Math.max(index - 1, 0));
  };

  const goNext = () => {
    setActiveIndex((index) => Math.min(index + 1, slideTemplates.length - 1));
  };

  const openPresenterNotes = () => {
    publishPresenterNotes(activeSlide, activeIndex, notesChannelRef);

    const existingWindow = notesWindowRef.current;
    const notesWindow =
      existingWindow && !existingWindow.closed
        ? existingWindow
        : window.open(
            "/speaker-notes",
            "paper-sharing-speaker-notes",
            "popup,width=760,height=920",
          );

    if (!notesWindow) {
      return;
    }

    notesWindowRef.current = notesWindow;
    notesWindow.focus();
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
      return;
    }

    await document.exitFullscreen().catch(() => undefined);
  };

  return (
    <main className={notesOpen ? "deck-app" : "deck-app notes-collapsed"}>
      <aside className="deck-sidebar" aria-label="Slide navigator">
        <nav className="slide-list" aria-label="Slides">
          {slideTemplates.map((slide, index) => {
            const Icon = slide.icon;
            const isActive = activeIndex === index;

            return (
              <button
                aria-label={`${String(index + 1).padStart(2, "0")} ${slide.shortTitle ?? slide.title} ${slide.section}`}
                className="slide-tab"
                data-active={isActive}
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="slide-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon size={16} aria-hidden="true" />
                <span className="slide-tab-copy">
                  <span>{slide.shortTitle ?? slide.title}</span>
                  <small>{slide.section}</small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="deck-stage" aria-label="Active slide">
        <header className="deck-toolbar">
          <nav className="section-rail" aria-label="Deck sections">
            {sectionOrder.map((section, index) => (
              <span
                data-active={section === activeSlide.section}
                data-passed={index < currentSectionPosition}
                key={section}
              >
                {section}
              </span>
            ))}
          </nav>

          <div className="toolbar-actions">
            <button
              aria-label={
                notesOpen ? "Hide speaker notes" : "Show speaker notes"
              }
              className="icon-button"
              onClick={() => setNotesOpen((open) => !open)}
              title={notesOpen ? "Hide speaker notes" : "Show speaker notes"}
              type="button"
            >
              {notesOpen ? (
                <PanelRightClose size={18} aria-hidden="true" />
              ) : (
                <PanelRightOpen size={18} aria-hidden="true" />
              )}
            </button>
            <button
              aria-label="Open speaker notes in a new window"
              className="nav-button notes-window-button"
              onClick={openPresenterNotes}
              title="Open speaker notes in a new window"
              type="button"
            >
              <NotebookTabs size={16} aria-hidden="true" />
              Notes window
            </button>
            <button
              aria-label="Enter fullscreen"
              className="icon-button"
              onClick={toggleFullscreen}
              title="Enter fullscreen"
              type="button"
            >
              <Expand size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <article
          className={`slide-canvas tone-${activeSlide.tone} layout-${activeSlide.layout}`}
          data-slide-id={activeSlide.id}
        >
          <SlideHeader slide={activeSlide} index={activeIndex} />
          <SlideBody slide={activeSlide} />
        </article>

        <footer className="deck-controls">
          <div className="progress-shell" aria-hidden="true">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="control-cluster">
            <button
              className="nav-button"
              disabled={activeIndex === 0}
              onClick={goPrevious}
              type="button"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Previous
            </button>
            <button
              className="nav-button primary"
              disabled={activeIndex === slideTemplates.length - 1}
              onClick={goNext}
              type="button"
            >
              Next
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </section>

      {notesOpen ? <SpeakerNotes slide={activeSlide} /> : null}
    </main>
  );
}

function publishPresenterNotes(
  slide: SlideTemplate,
  index: number,
  notesChannelRef: RefObject<BroadcastChannel | null>,
) {
  const presenterNotes = buildPresenterNotesState(slide, index);

  window.localStorage.setItem(
    PRESENTER_NOTES_STORAGE_KEY,
    JSON.stringify(presenterNotes),
  );

  notesChannelRef.current ??= new BroadcastChannel(PRESENTER_NOTES_CHANNEL);
  notesChannelRef.current.postMessage(presenterNotes);
}

function buildPresenterNotesState(
  slide: SlideTemplate,
  index: number,
): PresenterNotesState {
  return {
    index,
    total: slideTemplates.length,
    section: slide.section,
    title: slide.title,
    subtitle: slide.subtitle ?? "",
    presenterMove: slide.presenterMove,
    slots: slide.slots,
    notes: slide.notes,
    principles: templatePrinciples,
  };
}

function SlideHeader({
  slide,
  index,
}: {
  slide: SlideTemplate;
  index: number;
}) {
  return (
    <header className="slide-header">
      <div className="slide-section">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="slide-title-row">
        <div>
          <h2>{slide.title}</h2>
          {slide.subtitle ? <p>{slide.subtitle}</p> : null}
          {slide.paperMeta ? (
            <div className="slide-paper-badges">
              <span className="paper-meta-badge">
                <span>Venue</span>
                <strong>{slide.paperMeta.venue}</strong>
              </span>
              <a
                className="paper-meta-badge paper-meta-link"
                href={slide.paperMeta.href}
                rel="noreferrer"
                target="_blank"
              >
                <span>Paper Link</span>
                <strong>ACM Digital Library</strong>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SlideBody({ slide }: { slide: SlideTemplate }) {
  if (slide.layout === "cover") {
    return <CoverSlide slide={slide} />;
  }

  if (slide.layout === "big-idea") {
    return <BigIdeaSlide slide={slide} />;
  }

  if (slide.layout === "cards") {
    return <CardsSlide slide={slide} />;
  }

  if (slide.layout === "funnel") {
    return <FunnelSlide slide={slide} />;
  }

  if (slide.layout === "comparison") {
    return <ComparisonSlide slide={slide} />;
  }

  if (slide.layout === "quadrant") {
    return <QuadrantSlide slide={slide} />;
  }

  if (slide.layout === "figure-focus") {
    return <FigureFocusSlide slide={slide} />;
  }

  if (slide.layout === "pipeline") {
    return <PipelineSlide slide={slide} />;
  }

  if (slide.layout === "evidence") {
    return <EvidenceSlide slide={slide} />;
  }

  if (slide.layout === "related") {
    return <RelatedSlide slide={slide} />;
  }

  return <TakeawaysSlide slide={slide} />;
}

function CoverSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-cover" data-slide-id={slide.id}>
      <section className="orality-cover-headline">
        <h3>{slide.headline}</h3>
        {slide.presenterLine ? <p>{slide.presenterLine}</p> : null}
      </section>
      <div className="orality-meta-grid">
        {slide.meta?.map((point) => (
          <PointCard key={point.title} point={point} compact />
        ))}
      </div>
      <FigurePanel figure={slide.figures?.[0]} priority />
    </div>
  );
}

function BigIdeaSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-big-idea" data-slide-id={slide.id}>
      <section className="orality-quote-panel">
        <h3>{slide.headline}</h3>
        <p>{slide.body}</p>
      </section>
      <PointGrid points={slide.points} />
    </div>
  );
}

function CardsSlide({ slide }: { slide: SlideTemplate }) {
  const hasBullets = Boolean(slide.bullets?.length);

  return (
    <div
      className={`orality-layout orality-cards-slide${hasBullets ? " orality-bullet-slide" : ""}`}
      data-slide-id={slide.id}
    >
      {hasBullets ? (
        <>
          <ul className="orality-motivation-bullets">
            {slide.bullets?.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <FigurePanel figure={slide.figures?.[0]} fitToFrame priority />
        </>
      ) : (
        <>
          <section className="orality-thesis">
            <h3>{slide.headline}</h3>
          </section>
          <PointGrid points={slide.points} />
        </>
      )}
    </div>
  );
}

function FunnelSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div
      className="orality-layout orality-funnel-slide"
      data-slide-id={slide.id}
    >
      <div className="orality-funnel">
        {slide.points?.map((point, index) => (
          <div
            className="orality-funnel-step"
            key={point.title}
            style={{ "--step": index } as CSSProperties}
          >
            <span>{point.label}</span>
            <strong>{point.title}</strong>
            <p>{point.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-comparison" data-slide-id={slide.id}>
      <section className="orality-copy-panel">
        <h3>{slide.headline}</h3>
        <p>{slide.body}</p>
        <PointGrid points={slide.points} compact />
      </section>
      <FigurePanel figure={slide.figures?.[0]} priority />
    </div>
  );
}

function QuadrantSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-quadrant-slide">
      <section className="orality-problem-panel">
        <span>New problem</span>
        <h3>{slide.headline}</h3>
        <p>{slide.body}</p>
      </section>
      <section className="orality-tech-panel">
        <span>Existing techniques used</span>
        <ul className="orality-tech-list">
          {slide.bullets?.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FigureFocusSlide({ slide }: { slide: SlideTemplate }) {
  const figureOnRight = [
    "system-overview",
    "conceptual-framework",
    "voice-restructuring",
    "embedded-scaffolds",
    "workflow-strategies",
    "related-orca",
    "related-ai-personality",
    "related-visual-metaphors",
  ].includes(slide.id);
  const copyPanel = (
    <section className="orality-copy-panel">
      {slide.headline ? <h3>{slide.headline}</h3> : null}
      {slide.body ? <p>{slide.body}</p> : null}
      {slide.points?.length ? (
        <PointGrid points={slide.points} compact />
      ) : null}
    </section>
  );
  const figurePanel = <FigurePanel figure={slide.figures?.[0]} priority />;

  return (
    <div
      className={`orality-layout orality-figure-focus${figureOnRight ? " figure-right" : ""}`}
      data-slide-id={slide.id}
    >
      {figureOnRight ? (
        <>
          {copyPanel}
          {figurePanel}
        </>
      ) : (
        <>
          {figurePanel}
          {copyPanel}
        </>
      )}
    </div>
  );
}

function PipelineSlide({ slide }: { slide: SlideTemplate }) {
  const copyStyle =
    slide.id === "implementation"
      ? ({ alignContent: "center" } as CSSProperties)
      : undefined;

  return (
    <div
      className="orality-layout orality-pipeline-slide"
      data-slide-id={slide.id}
    >
      <section className="orality-copy-panel" style={copyStyle}>
        {slide.headline ? <h3>{slide.headline}</h3> : null}
        <PointGrid points={slide.points} compact />
      </section>
      <FigurePanel figure={slide.figures?.[0]} priority />
    </div>
  );
}

function EvidenceSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-evidence-slide">
      <section className="orality-evidence-summary">
        <h3>{slide.headline}</h3>
        <PointGrid points={slide.points} compact />
      </section>
      <FigurePanel figure={slide.figures?.[0]} fitToFrame priority />
    </div>
  );
}

function TakeawaysSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-takeaways" data-slide-id={slide.id}>
      <section className="orality-thesis">
        <h3>{slide.headline}</h3>
      </section>
      <PointGrid points={slide.points} />
    </div>
  );
}

function RelatedSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="orality-layout orality-related-slide">
      <section className="orality-thesis">
        <h3>{slide.headline}</h3>
      </section>
      <div className="related-paper-grid">
        {slide.points?.map((point, index) => {
          const figure = slide.figures?.[index];
          const figureStyle = figure
            ? ({
                "--figure-aspect": `${figure.width} / ${figure.height}`,
              } as CSSProperties)
            : undefined;

          return (
            <article
              className="related-paper-card"
              key={point.title}
              style={figureStyle}
            >
              {figure ? (
                <div className="related-figure-shell">
                  <Image
                    alt={figure.alt}
                    height={figure.height}
                    sizes="(max-width: 820px) 90vw, 24vw"
                    src={figure.src}
                    width={figure.width}
                  />
                </div>
              ) : null}
              <div className="related-paper-copy">
                <span>{point.label}</span>
                <strong>{point.title}</strong>
                <p>{point.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PointGrid({
  points = [],
  compact = false,
}: {
  points?: SlidePoint[];
  compact?: boolean;
}) {
  return (
    <div className="orality-point-grid" data-compact={compact}>
      {points.map((point) => (
        <PointCard compact={compact} key={point.title} point={point} />
      ))}
    </div>
  );
}

function PointCard({
  point,
  compact = false,
}: {
  point: SlidePoint;
  compact?: boolean;
}) {
  return (
    <article
      className="orality-point-card"
      data-compact={compact}
      data-emphasis={point.emphasis}
    >
      <div>
        {point.label ? <span>{point.label}</span> : null}
        <strong>{point.title}</strong>
      </div>
      {point.href ? (
        <a href={point.href} rel="noreferrer" target="_blank">
          {point.body}
        </a>
      ) : point.bullets?.length ? (
        <>
          {point.showBodyWithBullets ? <p>{point.body}</p> : null}
          <ul>
            {point.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>{point.body}</p>
      )}
    </article>
  );
}

function FigurePanel({
  figure,
  fitToFrame = false,
  priority = false,
}: {
  figure?: SlideFigure;
  fitToFrame?: boolean;
  priority?: boolean;
}) {
  if (!figure) {
    return null;
  }

  const figureStyle = {
    "--figure-aspect": `${figure.width} / ${figure.height}`,
    "--figure-height": figure.height,
    "--figure-width": figure.width,
  } as CSSProperties;
  const imageStyle = fitToFrame
    ? ({
        height: "100%",
        objectFit: "contain",
        width: "100%",
      } as CSSProperties)
    : undefined;

  return (
    <figure className="orality-figure-panel" style={figureStyle}>
      <div className="paper-figure-shell">
        <Image
          alt={figure.alt}
          height={figure.height}
          priority={priority}
          sizes={
            fitToFrame
              ? "(max-width: 820px) 90vw, 78vw"
              : "(max-width: 820px) 90vw, 45vw"
          }
          src={figure.src}
          style={imageStyle}
          width={figure.width}
        />
      </div>
      <figcaption>
        <span>{figure.caption}</span>
      </figcaption>
      {figure.read ? (
        <aside className="figure-read-card">
          <span>My read</span>
          <strong>{figure.read}</strong>
        </aside>
      ) : null}
      {figure.idea ? (
        <aside className="figure-read-card">
          <span>My idea</span>
          <strong>{figure.idea}</strong>
        </aside>
      ) : null}
    </figure>
  );
}

function SpeakerNotes({ slide }: { slide: SlideTemplate }) {
  return (
    <aside className="speaker-notes" aria-label="Speaker notes">
      <div className="notes-header">
        <NotebookTabs size={20} aria-hidden="true" />
        <div>
          <strong>Speaker notes</strong>
          <span>{slide.section}</span>
        </div>
      </div>
      <section>
        <span className="field-label">Key points</span>
        <ul>
          {slide.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
