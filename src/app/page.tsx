"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Expand,
  Eye,
  GalleryVerticalEnd,
  NotebookTabs,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
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
  const [notesOpen, setNotesOpen] = useState(true);
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
                aria-label={`${String(index + 1).padStart(2, "0")} ${slide.title} ${slide.section}`}
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
                  <span>{slide.title}</span>
                  <small>{slide.section}</small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="deck-stage" aria-label="Active slide">
        <header className="deck-toolbar">
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

        <article className={`slide-canvas tone-${activeSlide.tone}`}>
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
            <span className="keyboard-hint">Arrow keys, N/P, Home/End</span>
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
    subtitle: slide.subtitle,
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
        <ChevronRight size={14} aria-hidden="true" />
        <span>{slide.section}</span>
      </div>
      <div className="slide-title-row">
        <div>
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>
        </div>
      </div>
    </header>
  );
}

function SlideBody({ slide }: { slide: SlideTemplate }) {
  if (slide.id === "paper-card") {
    return <PaperCardSlide slide={slide} />;
  }

  if (slide.id === "why-this-paper") {
    return <WhySlide slide={slide} />;
  }

  if (slide.id === "background-funnel") {
    return <FunnelSlide slide={slide} />;
  }

  if (slide.id === "problem-position") {
    return <ProblemPositionSlide slide={slide} />;
  }

  if (slide.id === "novelty-quadrant") {
    return <QuadrantSlide slide={slide} />;
  }

  if (slide.id === "author-contributions") {
    return <ContributionLedgerSlide slide={slide} authorView />;
  }

  if (slide.id === "presenter-contributions") {
    return <ContributionLedgerSlide slide={slide} />;
  }

  if (slide.id === "related-work") {
    return <RelatedWorkSlide slide={slide} />;
  }

  if (slide.id === "methods") {
    return <MethodSlide slide={slide} />;
  }

  if (slide.id === "results-evaluation") {
    return <EvaluationSlide slide={slide} />;
  }

  if (slide.id === "critical-thinking") {
    return <CriticalSlide slide={slide} />;
  }

  if (slide.id === "take-home") {
    return <TakeHomeSlide slide={slide} />;
  }

  if (slide.id === "talk-architecture") {
    return <TalkArchitectureSlide slide={slide} />;
  }

  if (slide.id === "interaction-tricks") {
    return <InteractionSlide slide={slide} />;
  }

  return <DiscussionSlide slide={slide} />;
}

function PaperCardSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="slide-grid title-layout">
      <div className="paper-card-main">
        <span className="field-label">Paper title</span>
        <div className="paper-title-placeholder">
          Replace with the exact paper title
        </div>
        <div className="paper-meta-grid">
          {slide.slots.slice(1, 4).map((slot) => (
            <div key={slot}>
              <span>{slot}</span>
              <strong>Fill in</strong>
            </div>
          ))}
        </div>
        <p>{slide.question}</p>
      </div>
      <div className="figure-frame">
        <div className="figure-ruler">
          <span />
          <span />
          <span />
        </div>
        <div className="figure-placeholder">
          <Eye size={34} aria-hidden="true" />
          <strong>Primary figure or result crop</strong>
          <span>{slide.visualCue}</span>
        </div>
      </div>
    </div>
  );
}

function WhySlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="slide-grid evidence-layout">
      <PromptPanel slide={slide} />
      <div className="evidence-stack">
        {slide.slots.map((slot, index) => (
          <div className="evidence-card" key={slot}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{slot}</strong>
            <p>{evidenceCopy[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="slide-grid funnel-layout">
      <PromptPanel slide={slide} />
      <div className="funnel">
        {slide.slots.map((slot, index) => (
          <div className="funnel-step" data-step={index} key={slot}>
            <span>{slot}</span>
            <p>{funnelCopy[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemPositionSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="slide-grid position-layout">
      <PromptPanel slide={slide} />
      <div className="paired-lanes">
        <ArgumentLane
          title="New problem"
          points={["Why now?", "What changed?", "Who is newly affected?"]}
        />
        <ArgumentLane
          title="Old problem"
          points={[
            "Strongest current answer",
            "Where it breaks",
            "Why the gap remains",
          ]}
        />
      </div>
    </div>
  );
}

function QuadrantSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="slide-grid quadrant-layout">
      <div className="quadrant">
        {slide.slots.map((slot, index) => (
          <div className="quadrant-cell" data-selected={index === 0} key={slot}>
            <strong>{slot}</strong>
            <span>
              {index === 0
                ? "Mark selected cell"
                : "Alternative classification"}
            </span>
          </div>
        ))}
      </div>
      <PromptPanel slide={slide} compact />
    </div>
  );
}

function ContributionLedgerSlide({
  slide,
  authorView = false,
}: {
  slide: SlideTemplate;
  authorView?: boolean;
}) {
  const rows = authorView ? authorContributionRows : presenterContributionRows;

  return (
    <div className="ledger-layout">
      <PromptPanel slide={slide} compact />
      <div className="ledger">
        <div className="ledger-row ledger-head">
          <span>Claim</span>
          <span>Evidence</span>
          <span>Reading</span>
        </div>
        {rows.map((row) => (
          <div className="ledger-row" key={row.claim}>
            <strong>{row.claim}</strong>
            <span>{row.evidence}</span>
            <span>{row.reading}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedWorkSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="related-layout">
      <PromptPanel slide={slide} compact />
      <div className="critique-table">
        <div className="critique-row critique-head">
          <span>Work</span>
          <span>Role</span>
          <span>Weakness</span>
          <span>Paper response</span>
        </div>
        {relatedRows.map((row) => (
          <div className="critique-row" key={`${row.role}-${row.response}`}>
            <strong>{row.work}</strong>
            <span>{row.role}</span>
            <span>{row.weakness}</span>
            <span>{row.response}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="method-layout">
      <PromptPanel slide={slide} compact />
      <div className="method-flow">
        {methodCards.map((card) => (
          <div className="method-card" key={card.title}>
            <span>{card.step}</span>
            <strong>{card.title}</strong>
            <p>{card.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvaluationSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="evaluation-layout">
      <PromptPanel slide={slide} compact />
      <div className="scoreboard">
        {evaluationRows.map((row) => (
          <div className="score-card" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            <p>{row.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CriticalSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="critical-layout">
      <PromptPanel slide={slide} compact />
      <div className="opportunity-map">
        {slide.slots.map((slot, index) => (
          <div className="opportunity-node" key={slot}>
            <span>{slot}</span>
            <p>{criticalCopy[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TakeHomeSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="take-home-layout">
      {slide.slots.map((slot, index) => (
        <div className="takeaway-card" key={slot}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{slot}</strong>
          <p>{takeawayCopy[index]}</p>
        </div>
      ))}
    </div>
  );
}

function TalkArchitectureSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="architecture-layout">
      <PromptPanel slide={slide} compact />
      <div className="arc">
        {slide.slots.map((slot, index) => (
          <div className="arc-step" key={slot}>
            <span>{slot}</span>
            <strong>{arcCopy[index]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function InteractionSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="interaction-layout">
      <PromptPanel slide={slide} compact />
      <div className="move-library">
        {slide.slots.map((slot, index) => (
          <div className="move-card" key={slot}>
            <Check size={16} aria-hidden="true" />
            <strong>{slot}</strong>
            <p>{interactionCopy[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscussionSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div className="discussion-layout">
      <PromptPanel slide={slide} compact />
      <div className="launchpad">
        {slide.slots.map((slot, index) => (
          <div className="launch-card" key={slot}>
            <span>{slot}</span>
            <strong>{discussionCopy[index]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromptPanel({
  slide,
  compact = false,
}: {
  slide: SlideTemplate;
  compact?: boolean;
}) {
  return (
    <section className="prompt-panel" data-compact={compact}>
      <span className="field-label">Core question</span>
      <h3>{slide.question}</h3>
      <div className="prompt-meta">
        <div>
          <strong>Artifact</strong>
          <span>{slide.artifact}</span>
        </div>
        <div>
          <strong>Visual cue</strong>
          <span>{slide.visualCue}</span>
        </div>
      </div>
    </section>
  );
}

function ArgumentLane({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="argument-lane">
      <strong>{title}</strong>
      {points.map((point) => (
        <span key={point}>{point}</span>
      ))}
    </div>
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
        <span className="field-label">Presenter move</span>
        <p>{slide.presenterMove}</p>
      </section>
      <section>
        <span className="field-label">Template slots</span>
        <ul>
          {slide.slots.map((slot) => (
            <li key={slot}>{slot}</li>
          ))}
        </ul>
      </section>
      <section>
        <span className="field-label">Quality checks</span>
        <ul>
          {slide.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
      <section className="principles">
        <div>
          <GalleryVerticalEnd size={18} aria-hidden="true" />
          <strong>Deck principles</strong>
        </div>
        {templatePrinciples.map((principle) => (
          <p key={principle}>{principle}</p>
        ))}
      </section>
    </aside>
  );
}

const evidenceCopy = [
  "Show the signal that made you notice the paper.",
  "Connect the paper to the group's current questions.",
  "Name the method, figure, dataset, or critique worth reusing.",
  "State what the room should challenge during the talk.",
];

const funnelCopy = [
  "What field context must the audience know?",
  "What pain point or opportunity makes the work necessary?",
  "What exact problem does the paper address?",
  "What is outside the scope of the paper?",
];

const authorContributionRows = [
  {
    claim: "Author claim 1",
    evidence: "Paper section, figure, theorem, or study",
    reading: "Method, system, theory, data, or finding",
  },
  {
    claim: "Author claim 2",
    evidence: "Exact artifact supporting the claim",
    reading: "Dependency or assumption",
  },
  {
    claim: "Author claim 3",
    evidence: "Evaluation or demonstration",
    reading: "Strength of evidence",
  },
];

const presenterContributionRows = [
  {
    claim: "I accept",
    evidence: "What convinced me",
    reading: "Keep this claim",
  },
  {
    claim: "I qualify",
    evidence: "Where the claim is narrower",
    reading: "Use with care",
  },
  {
    claim: "I contest",
    evidence: "Missing evidence or weak assumption",
    reading: "Open discussion",
  },
  {
    claim: "I transfer",
    evidence: "Reusable method or framing",
    reading: "Group opportunity",
  },
];

const relatedRows = [
  {
    work: "Author, Year, Venue",
    role: "Compared against",
    weakness: "What it cannot do",
    response: "How this paper improves",
  },
  {
    work: "Author, Year, Venue",
    role: "Built on",
    weakness: "What had to be adapted",
    response: "Borrowed algorithm or representation",
  },
  {
    work: "Author, Year, Venue",
    role: "Evaluation baseline",
    weakness: "Metric or workflow gap",
    response: "New comparison or task",
  },
];

const methodCards = [
  {
    step: "01",
    title: "Representation",
    copy: "What is encoded, modeled, or transformed?",
  },
  {
    step: "02",
    title: "Task",
    copy: "What analytical action does it support?",
  },
  {
    step: "03",
    title: "Cue",
    copy: "What should the audience observe in the figure?",
  },
  {
    step: "04",
    title: "Interaction",
    copy: "What does the user do to solve the task?",
  },
  {
    step: "05",
    title: "Rationale",
    copy: "Why is this better than plausible alternatives?",
  },
];

const evaluationRows = [
  {
    label: "Capability",
    value: "New",
    copy: "Show the result that was not previously achievable.",
  },
  {
    label: "Comparison",
    value: "Better",
    copy: "Identify efficiency, intuitiveness, accuracy, or coverage gains.",
  },
  {
    label: "Evidence",
    value: "Tested",
    copy: "Name the case study, metric, user study, ablation, or proof.",
  },
  {
    label: "Limit",
    value: "Bounded",
    copy: "State what the evaluation does not establish.",
  },
];

const criticalCopy = [
  "A precise weakness in method, evidence, scope, or assumptions.",
  "What could go wrong if the idea is reused uncritically.",
  "A principle or heuristic you learned from the paper.",
  "A concrete way this could help a current group project.",
];

const takeawayCopy = [
  "The problem or framing the audience should remember.",
  "The method, figure, or technique worth borrowing.",
  "The open question or limitation worth discussing.",
];

const arcCopy = [
  "Start from a pain point",
  "Make the answer non-obvious",
  "Show the weaker path",
  "Reveal the paper's path",
  "Return to the original question",
];

const interactionCopy = [
  "Use when the audience can predict before you reveal.",
  "Use when a figure contains an insight they can discover.",
  "Use when the advantage is clearest through contrast.",
  "Use when the data has a visible mystery.",
  "Use when an encoding needs visual, textual, and oral reinforcement.",
];

const discussionCopy = [
  "What should we debate?",
  "Where could this fit our work?",
  "What failure should we test first?",
  "What is the smallest follow-up experiment?",
];
