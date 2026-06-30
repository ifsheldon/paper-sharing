"use client";

import katex from "katex";
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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type SlidePoint,
  type SlideTemplate,
  type SlideVisual,
  sectionOrder,
  slideTemplates,
  templatePrinciples,
} from "./deck-data";
import {
  PRESENTER_NOTES_CHANNEL,
  PRESENTER_NOTES_STORAGE_KEY,
  type PresenterNotesState,
} from "./presenter-notes-state";

type NavigateSlide = (slideId: string) => void;

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

  const goToSlide = useCallback((slideId: string) => {
    const slideIndex = slideTemplates.findIndex(
      (slide) => slide.id === slideId,
    );
    if (slideIndex >= 0) {
      setActiveIndex(slideIndex);
    }
  }, []);

  const openPresenterNotes = () => {
    publishPresenterNotes(activeSlide, activeIndex, notesChannelRef);

    const existingWindow = notesWindowRef.current;
    const notesWindow =
      existingWindow && !existingWindow.closed
        ? existingWindow
        : window.open(
            "/speaker-notes",
            "qec-idea-eval-speaker-notes",
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
          <SlideBody onNavigateSlide={goToSlide} slide={activeSlide} />
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
        <span>{slide.section}</span>
      </div>
      <div className="slide-title-row">
        <h2>{slide.title}</h2>
        {slide.subtitle ? <p>{slide.subtitle}</p> : null}
      </div>
    </header>
  );
}

function SlideBody({
  onNavigateSlide,
  slide,
}: {
  onNavigateSlide: NavigateSlide;
  slide: SlideTemplate;
}) {
  if (slide.layout === "cover") {
    return <CoverSlide onNavigateSlide={onNavigateSlide} slide={slide} />;
  }

  if (slide.layout === "cards") {
    return <CardsSlide slide={slide} />;
  }

  if (slide.layout === "takeaways") {
    return <TakeawaysSlide onNavigateSlide={onNavigateSlide} slide={slide} />;
  }

  if (slide.layout === "backup") {
    return <BackupSlide onNavigateSlide={onNavigateSlide} slide={slide} />;
  }

  return <DiagramSlide onNavigateSlide={onNavigateSlide} slide={slide} />;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({
  terms = [],
  text,
}: {
  terms?: string[];
  text: string;
}) {
  if (terms.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const normalizedTerms = new Set(terms.map((term) => term.toLowerCase()));
  const segments: Array<{
    highlighted: boolean;
    start: number;
    text: string;
  }> = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const matchText = match[0];
    const start = match.index ?? cursor;

    if (start > cursor) {
      segments.push({
        highlighted: false,
        start: cursor,
        text: text.slice(cursor, start),
      });
    }

    segments.push({
      highlighted: normalizedTerms.has(matchText.toLowerCase()),
      start,
      text: matchText,
    });
    cursor = start + matchText.length;
  }

  if (cursor < text.length) {
    segments.push({
      highlighted: false,
      start: cursor,
      text: text.slice(cursor),
    });
  }

  return segments.map((segment) =>
    segment.highlighted ? (
      <strong
        className="slide-text-highlight"
        key={`highlight-${segment.start}-${segment.text}`}
      >
        {segment.text}
      </strong>
    ) : (
      segment.text
    ),
  );
}

function CoverSlide({
  onNavigateSlide,
  slide,
}: {
  onNavigateSlide: NavigateSlide;
  slide: SlideTemplate;
}) {
  return (
    <div
      className="slide-layout cover-layout"
      data-has-visual={Boolean(slide.visual)}
    >
      <section className="hero-copy">
        {slide.id === "title" ? (
          <p className="cover-lead">
            <span className="lead-emphasis">QEC codes</span> support quantum
            error correction in quantum computers. Modern codes can be specified
            through{" "}
            <span className="lead-emphasis">equations and matrices</span>, but
            useful figures are often manually crafted for{" "}
            <span className="lead-emphasis">
              intuition, communication, and implementation
            </span>
            .
          </p>
        ) : (
          <>
            {slide.headline ? <h3>{slide.headline}</h3> : null}
            {slide.id === "formal-definitions" ? (
              <p className="process-lead">
                A useful workflow cannot jump directly from formula to picture.
                It needs <span>expanded code structure</span>,{" "}
                <span>validation</span>, <span>provenance</span>,{" "}
                <span>alternatives</span>, and <span>expert correction</span>.
              </p>
            ) : slide.body ? (
              <p>
                <HighlightedText
                  terms={slide.bodyHighlights}
                  text={slide.body}
                />
              </p>
            ) : null}
          </>
        )}
        {slide.presenterLine ? (
          <span className="presenter-line">{slide.presenterLine}</span>
        ) : null}
      </section>
      {slide.visual ? (
        <>
          <SlideVisualRenderer
            onNavigateSlide={onNavigateSlide}
            points={slide.points}
            visual={slide.visual}
          />
          <PointGrid points={slide.points} compact />
        </>
      ) : (
        <>
          <PointGrid points={slide.points} compact />
          <SlideVisualRenderer
            onNavigateSlide={onNavigateSlide}
            points={slide.points}
            visual={slide.visual}
          />
        </>
      )}
    </div>
  );
}

function DiagramSlide({
  onNavigateSlide,
  slide,
}: {
  onNavigateSlide: NavigateSlide;
  slide: SlideTemplate;
}) {
  const hasCopy = Boolean(
    slide.headline || slide.bullets?.length || slide.body,
  );

  return (
    <div
      className="slide-layout diagram-layout"
      data-has-copy={hasCopy}
      data-slide-id={slide.id}
    >
      {hasCopy ? (
        <section className="slide-copy">
          {slide.headline ? <h3>{slide.headline}</h3> : null}
          {slide.bullets?.length ? (
            <ul className="slide-bullets">
              {slide.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {slide.body ? (
            <p>
              <HighlightedText terms={slide.bodyHighlights} text={slide.body} />
            </p>
          ) : null}
        </section>
      ) : null}
      <SlideVisualRenderer
        onNavigateSlide={onNavigateSlide}
        points={slide.points}
        visual={slide.visual}
      />
    </div>
  );
}

function CardsSlide({ slide }: { slide: SlideTemplate }) {
  return (
    <div
      className="slide-layout cards-layout"
      data-section={slide.section}
      data-slide-id={slide.id}
    >
      {slide.headline ? (
        <section className="slide-thesis">
          <h3>{slide.headline}</h3>
        </section>
      ) : null}
      <PointGrid points={slide.points} />
    </div>
  );
}

function TakeawaysSlide({
  onNavigateSlide,
  slide,
}: {
  onNavigateSlide: NavigateSlide;
  slide: SlideTemplate;
}) {
  return (
    <div
      className="slide-layout takeaways-layout"
      data-has-visual={Boolean(slide.visual)}
      data-slide-id={slide.id}
    >
      {slide.headline ? (
        <section className="slide-thesis">
          <h3>{slide.headline}</h3>
        </section>
      ) : null}
      <SlideVisualRenderer
        onNavigateSlide={onNavigateSlide}
        points={slide.points}
        visual={slide.visual}
      />
      <PointGrid points={slide.points} />
    </div>
  );
}

function BackupSlide({
  onNavigateSlide,
  slide,
}: {
  onNavigateSlide: NavigateSlide;
  slide: SlideTemplate;
}) {
  return (
    <div className="slide-layout backup-layout">
      <section className="backup-intro">
        <button
          className="backup-return-button"
          onClick={() => onNavigateSlide("method")}
          type="button"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Method
        </button>
        {slide.headline ? <h3>{slide.headline}</h3> : null}
        {slide.body ? (
          <p>
            <HighlightedText terms={slide.bodyHighlights} text={slide.body} />
          </p>
        ) : null}
        {slide.bullets?.length ? (
          <ul className="slide-bullets">
            {slide.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </section>
      {slide.points?.length ? (
        <section className="backup-detail-stack">
          {slide.points.map((point) => (
            <article className="backup-detail-card" key={point.title}>
              <div>
                {point.label ? <span>{point.label}</span> : null}
                <strong>{point.title}</strong>
              </div>
              <p>{point.body}</p>
              {point.code ? <pre>{point.code}</pre> : null}
              {point.bullets?.length ? (
                <ul>
                  {point.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function SlideVisualRenderer({
  onNavigateSlide,
  visual,
  points = [],
}: {
  onNavigateSlide?: NavigateSlide;
  visual?: SlideVisual;
  points?: SlidePoint[];
}) {
  if (!visual) {
    return null;
  }

  if (visual.kind === "triptych") {
    return <TriptychVisual />;
  }

  if (visual.kind === "latent-geometry") {
    return <LatentGeometryVisual />;
  }

  if (visual.kind === "matrix-graph") {
    return <MatrixGraphVisual />;
  }

  if (visual.kind === "code-gap") {
    return <CodeGapVisual />;
  }

  if (visual.kind === "contribution-stack") {
    return <ContributionStackVisual points={points} />;
  }

  if (visual.kind === "related-map") {
    return <RelatedMapVisual />;
  }

  if (visual.kind === "semantic-pipeline") {
    return <SemanticPipelineVisual onNavigateSlide={onNavigateSlide} />;
  }

  if (visual.kind === "output-columns") {
    return <OutputColumnsVisual points={points} />;
  }

  if (visual.kind === "equation-to-visualization") {
    return <EquationToVisualizationVisual />;
  }

  if (visual.kind === "question-map") {
    return <QuestionMapVisual />;
  }

  return <RoadmapVisual />;
}

function TriptychVisual() {
  return (
    <section
      className="visual-panel triptych-panel"
      aria-label="Formal specification to inspectable geometry example"
    >
      {[
        {
          label: "Formal specification",
          title: "Code equations",
          body: (
            <div className="equation-stack">
              <MathBlock expression="A(x,y)=x+y^0+y^2" />
              <MathBlock expression="B(x,y)=y+x^0+x^2" />
              <MathBlock expression={String.raw`H_X=[A\mid B]`} />
            </div>
          ),
        },
        {
          label: "Expanded code structure",
          title: "Concrete check matrix",
          body: (
            <Image
              alt="Expanded binary check matrix for the bivariate bicycle code"
              className="example-image matrix-example"
              height={501}
              src="/qec-example/expanded-code-structure.jpg"
              width={592}
            />
          ),
        },
        {
          label: "Inspectable geometry",
          title: "Toric layout",
          body: (
            <Image
              alt="Tanner graph of the bivariate bicycle code embedded on a torus"
              className="example-image geometry-example"
              height={245}
              src="/qec-example/inspectable-geometry.jpg"
              width={470}
            />
          ),
        },
      ].map((step, index) => (
        <div className="triptych-step" key={step.title}>
          <span>{step.label}</span>
          <strong>{step.title}</strong>
          <div className="triptych-content">{step.body}</div>
          {index < 2 ? <div className="flow-arrow" aria-hidden="true" /> : null}
        </div>
      ))}
      <div
        className="direct-geometry-arrow"
        aria-label="Overall transformation from formal specification to inspectable geometry"
        role="img"
      >
        <span aria-hidden="true">Geometry Implications</span>
      </div>
    </section>
  );
}

function MathBlock({ expression }: { expression: string }) {
  const mathRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mathRef.current) {
      return;
    }

    katex.render(expression, mathRef.current, {
      displayMode: true,
      throwOnError: false,
      strict: false,
    });
  }, [expression]);

  return (
    <div
      aria-label={expression}
      className="math-block"
      ref={mathRef}
      role="img"
    />
  );
}

function EquationToVisualizationVisual() {
  return (
    <section
      aria-label="Equation to visualization illustration"
      className="equation-visualization-panel"
    >
      <article className="equation-visualization-card">
        <span>Equation</span>
        <MathBlock
          expression={String.raw`\begin{aligned}
A(x,y)&=x+y^0+y^2\\
B(x,y)&=y+x^0+x^2\\
H_X&=[A\mid B]
\end{aligned}`}
        />
      </article>
      <div aria-hidden="true" className="equation-visualization-arrow" />
      <article className="equation-visualization-card">
        <span>Visualization</span>
        <Image
          alt="Toric layout visualization of the code geometry"
          className="example-image equation-visualization-image"
          height={245}
          src="/qec-example/inspectable-geometry.jpg"
          width={470}
        />
      </article>
    </section>
  );
}

function LatentGeometryVisual() {
  return (
    <section
      className="visual-panel latent-panel"
      aria-label="Formal definition and latent geometry"
    >
      <div className="math-card large">
        <span>formal definition</span>
        <MathBlock expression={String.raw`H_X = [A \mid B]`} />
        <MathBlock expression={String.raw`H_Z = [B^T \mid A^T]`} />
        <MathBlock expression="A(x,y) = x + I + y^2" />
      </div>
      <div className="latent-connector">
        <span>precise</span>
        <span>but not inspectable</span>
      </div>
      <div
        aria-label="Latent geometric structure"
        className="latent-graph"
        role="img"
      >
        {["q1", "q2", "q3", "q4", "q5", "q6"].map((node, index) => (
          <span
            className="graph-node qubit-node"
            key={node}
            style={{ "--node-index": index } as CSSProperties}
          >
            {node}
          </span>
        ))}
        {["X1", "Z1", "X2"].map((node, index) => (
          <span
            className="graph-node check-node"
            key={node}
            style={{ "--check-index": index } as CSSProperties}
          >
            {node}
          </span>
        ))}
        <div className="latent-edge edge-a" />
        <div className="latent-edge edge-b" />
        <div className="latent-edge edge-c" />
        <div className="latent-edge edge-d" />
      </div>
    </section>
  );
}

function MatrixGraphVisual() {
  const checkNodes = [
    { id: "c1", label: "C1", x: 14, y: 22 },
    { id: "c2", label: "C2", x: 38, y: 22 },
    { id: "c3", label: "C3", x: 62, y: 22 },
    { id: "c4", label: "C4", x: 86, y: 22 },
  ];
  const qubitNodes = [
    { id: "q1", label: "Q1", x: 14, y: 78 },
    { id: "q2", label: "Q2", x: 38, y: 78 },
    { id: "q3", label: "Q3", x: 62, y: 78 },
    { id: "q4", label: "Q4", x: 86, y: 78 },
  ];
  const matrix = [
    [
      { id: "r1c1", value: "1" },
      { id: "r1c2", value: "1" },
      { id: "r1c3", value: "0" },
      { id: "r1c4", value: "0" },
    ],
    [
      { id: "r2c1", value: "0" },
      { id: "r2c2", value: "1" },
      { id: "r2c3", value: "1" },
      { id: "r2c4", value: "0" },
    ],
    [
      { id: "r3c1", value: "0" },
      { id: "r3c2", value: "0" },
      { id: "r3c3", value: "1" },
      { id: "r3c4", value: "1" },
    ],
    [
      { id: "r4c1", value: "1" },
      { id: "r4c2", value: "0" },
      { id: "r4c3", value: "0" },
      { id: "r4c4", value: "1" },
    ],
  ];
  const geometryQubits = [
    { id: "q1", label: "Q1", x: 28, y: 28 },
    { id: "q2", label: "Q2", x: 72, y: 28 },
    { id: "q3", label: "Q3", x: 72, y: 72 },
    { id: "q4", label: "Q4", x: 28, y: 72 },
  ];
  const geometryChecks = [
    { id: "c1", label: "C1", x: 50, y: 18, qubits: ["q1", "q2"] },
    { id: "c2", label: "C2", x: 82, y: 50, qubits: ["q2", "q3"] },
    { id: "c3", label: "C3", x: 50, y: 82, qubits: ["q3", "q4"] },
    { id: "c4", label: "C4", x: 18, y: 50, qubits: ["q4", "q1"] },
  ];
  const geometryQubitById = new Map(
    geometryQubits.map((qubit) => [qubit.id, qubit]),
  );
  const connectors = matrix.flatMap((row, rowIndex) =>
    row.flatMap((entry, columnIndex) => {
      if (entry.value !== "1") {
        return [];
      }

      const check = checkNodes[rowIndex];
      const qubit = qubitNodes[columnIndex];

      return [
        {
          id: `${check.id}-${qubit.id}`,
          check,
          qubit,
        },
      ];
    }),
  );
  const matrixGridStyle: CSSProperties = {
    border: "1px solid #d8dee9",
    borderRadius: 8,
    display: "grid",
    gridTemplateColumns: "34px repeat(4, minmax(0, 1fr))",
    overflow: "hidden",
  };
  const matrixHeaderStyle: CSSProperties = {
    background: "#f8fbff",
    borderBottom: "1px solid #d8dee9",
    borderRight: "1px solid #d8dee9",
    color: "#2459a6",
    display: "grid",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: 850,
    minHeight: 22,
    placeItems: "center",
  };
  const matrixCellStyle = (active: boolean): CSSProperties => ({
    background: active ? "#2459a6" : "white",
    borderBottom: "1px solid #d8dee9",
    borderRight: "1px solid #d8dee9",
    color: active ? "white" : "#5e6778",
    display: "grid",
    fontFamily: "monospace",
    fontWeight: 800,
    minHeight: 30,
    placeItems: "center",
  });
  const supportGraphStyle: CSSProperties = {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    minHeight: 118,
  };
  const matrixGraphPanelStyle: CSSProperties = {
    alignItems: "stretch",
    background: "transparent",
    display: "grid",
    gap: 16,
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "auto minmax(0, 1fr)",
    minHeight: 0,
    minWidth: 0,
  };
  const supportPanelStyle: CSSProperties = {
    alignContent: "start",
    background: "rgba(255, 255, 255, 0.88)",
    border: "1px solid #d8dee9",
    borderRadius: 8,
    display: "grid",
    gap: 6,
    minHeight: 0,
    minWidth: 0,
    padding: 12,
  };
  const supportSvgStyle: CSSProperties = {
    display: "block",
    height: "100%",
    minHeight: 108,
    overflow: "visible",
    width: "100%",
  };

  return (
    <section
      className="matrix-graph-panel"
      aria-label="Check matrix to semantic graph support"
      style={matrixGraphPanelStyle}
    >
      <div
        className="matrix-card"
        style={{
          justifySelf: "center",
          padding: 12,
          width: "min(100%, 360px)",
        }}
      >
        <div className="cell-title-row">
          <span>Example check matrix</span>
          <b className="cell-index">1</b>
        </div>
        <div className="matrix-grid labeled-matrix" style={matrixGridStyle}>
          <div
            className="matrix-header corner"
            aria-hidden="true"
            style={{ ...matrixHeaderStyle, background: "white" }}
          />
          {qubitNodes.map((node) => (
            <div
              className="matrix-header column"
              key={node.id}
              style={matrixHeaderStyle}
            >
              {node.label}
            </div>
          ))}
          {matrix.flatMap((row, rowIndex) => [
            <div
              className="matrix-header row"
              key={checkNodes[rowIndex].id}
              style={{ ...matrixHeaderStyle, minHeight: 30 }}
            >
              {checkNodes[rowIndex].label}
            </div>,
            ...row.map((entry) => (
              <div
                className="matrix-cell"
                data-active={entry.value === "1"}
                key={entry.id}
                style={matrixCellStyle(entry.value === "1")}
              >
                {entry.value}
              </div>
            )),
          ])}
        </div>
      </div>
      <div className="support-graph" style={supportGraphStyle}>
        <div className="support-panel" style={supportPanelStyle}>
          <div className="cell-title-row">
            <span>Graph connectivity</span>
            <b className="cell-index">2</b>
          </div>
          <svg
            aria-label="Abstract graph support derived from the toy check matrix"
            className="support-svg"
            role="img"
            style={supportSvgStyle}
            viewBox="0 0 100 100"
          >
            {connectors.map((connector) => (
              <line
                className="support-link"
                key={connector.id}
                stroke="#8aa4cf"
                strokeLinecap="round"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
                x1={connector.check.x}
                x2={connector.qubit.x}
                y1={connector.check.y}
                y2={connector.qubit.y}
              />
            ))}
            {[...checkNodes, ...qubitNodes].map((node) => (
              <g
                className={`support-svg-node ${node.id.startsWith("c") ? "check" : "qubit"}`}
                key={node.id}
                transform={`translate(${node.x} ${node.y})`}
              >
                <circle
                  fill="white"
                  r="6.6"
                  stroke={node.id.startsWith("c") ? "#2d5da8" : "#0f766e"}
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  dy="0.36em"
                  fill="#2d5da8"
                  fontFamily="monospace"
                  fontSize="5"
                  fontWeight="850"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="support-panel" style={supportPanelStyle}>
          <div className="cell-title-row">
            <span>Geometry</span>
            <b className="cell-index">3</b>
          </div>
          <svg
            aria-label="Square geometry embedding of four qubits and four checks"
            className="support-svg"
            role="img"
            style={supportSvgStyle}
            viewBox="0 0 100 100"
          >
            {geometryChecks.flatMap((check) =>
              check.qubits.map((qubitId) => {
                const qubit = geometryQubitById.get(qubitId);
                if (!qubit) {
                  return null;
                }

                return (
                  <line
                    className="support-link"
                    key={`${check.id}-${qubit.id}`}
                    stroke="#8aa4cf"
                    strokeLinecap="round"
                    strokeWidth="1.25"
                    vectorEffect="non-scaling-stroke"
                    x1={check.x}
                    x2={qubit.x}
                    y1={check.y}
                    y2={qubit.y}
                  />
                );
              }),
            )}
            {geometryChecks.map((check) => (
              <g key={check.id} transform={`translate(${check.x} ${check.y})`}>
                <rect
                  fill="white"
                  height="12"
                  rx="3"
                  stroke="#2d5da8"
                  strokeWidth="2.2"
                  vectorEffect="non-scaling-stroke"
                  width="16"
                  x="-8"
                  y="-6"
                />
                <text
                  dy="0.36em"
                  fill="#2d5da8"
                  fontFamily="monospace"
                  fontSize="5"
                  fontWeight="850"
                  textAnchor="middle"
                >
                  {check.label}
                </text>
              </g>
            ))}
            {geometryQubits.map((qubit) => (
              <g key={qubit.id} transform={`translate(${qubit.x} ${qubit.y})`}>
                <circle
                  fill="white"
                  r="7"
                  stroke="#0f766e"
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  dy="0.36em"
                  fill="#2d5da8"
                  fontFamily="monospace"
                  fontSize="5"
                  fontWeight="850"
                  textAnchor="middle"
                >
                  {qubit.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function CodeGapVisual() {
  const geometryExamples = [
    {
      body: "A planar patch gives immediate spatial intuition.",
      images: [
        {
          alt: "Surface code patch with logical operators",
          height: 540,
          src: "/surface-code.png",
          width: 556,
        },
      ],
      label: "01 flat patch",
      title: "Surface code geometry",
    },
    {
      body: "The lattice, torus, and code-on-torus figure are different views of one periodic geometry.",
      images: [
        {
          alt: "9 by 9 periodic lattice",
          height: 321,
          src: "/9-by-9-lattice.svg",
          width: 296,
        },
        {
          alt: "Torus showing periodic topology",
          height: 254,
          src: "/torus.svg",
          width: 321,
        },
        {
          alt: "Code structure drawn on a toric layout",
          height: 245,
          src: "/qec-example/inspectable-geometry.jpg",
          width: 470,
        },
      ],
      label: "02 periodic / toric",
      title: "Toric geometry",
    },
    {
      body: "Glued or twisted boundaries create cylindrical and Mobius code geometries.",
      images: [
        {
          alt: "Surface, cylindrical, and Mobius code geometries from a quantum code paper",
          height: 460,
          src: "/qec-example/cylindrical-mobius-geometry.png",
          width: 1040,
        },
      ],
      label: "03 cylindrical / mobius",
      source: "Valentini et al. 2025, Fig. 2",
      title: "Boundary geometry",
    },
  ];

  return (
    <section
      className="visual-panel code-gap-panel"
      aria-label="Examples of why QEC code geometry gets hard"
    >
      {geometryExamples.map((example) => (
        <article className="code-geometry-card" key={example.label}>
          <div
            className="code-geometry-image-grid"
            data-count={example.images.length}
          >
            {example.images.map((image) => (
              <div className="code-geometry-image" key={image.src}>
                <Image
                  alt={image.alt}
                  className="code-geometry-img"
                  height={image.height}
                  sizes="(max-width: 900px) 82vw, 24vw"
                  src={image.src}
                  unoptimized={image.src.endsWith(".svg")}
                  width={image.width}
                />
              </div>
            ))}
          </div>
          <div className="code-geometry-copy">
            <span>{example.label}</span>
            <strong>{example.title}</strong>
            <p>{example.body}</p>
            {example.source ? <em>{example.source}</em> : null}
          </div>
        </article>
      ))}
    </section>
  );
}

function ContributionStackVisual({ points }: { points: SlidePoint[] }) {
  return (
    <section
      className="visual-panel contribution-panel"
      aria-label="Proposed contributions"
    >
      {points.map((point) => (
        <article className="contribution-card" key={point.title}>
          <span>{point.label}</span>
          <strong>{point.title}</strong>
          <p>{point.body}</p>
        </article>
      ))}
    </section>
  );
}

function RelatedMapVisual() {
  const clusters = [
    "QEC visualization and tooling",
    "Mathematical notation to diagrams",
    "Semantic authoring and provenance",
    "Graph and sparse matrix layouts",
  ];

  return (
    <section
      className="visual-panel related-map-panel"
      aria-label="Related work clusters"
    >
      <div className="related-center">
        <span>gap</span>
        <strong>Validated QEC code-geometry authoring</strong>
      </div>
      {clusters.map((cluster, index) => (
        <article
          className="related-cluster"
          key={cluster}
          style={{ "--cluster-index": index } as CSSProperties}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{cluster}</strong>
        </article>
      ))}
    </section>
  );
}

type PipelineDetail = {
  linkText?: string;
  suffix?: string;
  targetId?: string;
  text: string;
};

function PipelineDetailText({
  detail,
  onNavigateSlide,
}: {
  detail: PipelineDetail;
  onNavigateSlide?: NavigateSlide;
}) {
  if (!detail.linkText || !detail.targetId) {
    return detail.text;
  }

  return (
    <>
      {detail.text}
      <a
        aria-label={`Open backup slide for ${detail.linkText}`}
        className="pipeline-inline-link"
        href={`#${detail.targetId}`}
        onClick={(event) => {
          if (!onNavigateSlide || !detail.targetId) {
            return;
          }

          event.preventDefault();
          onNavigateSlide(detail.targetId);
        }}
      >
        {detail.linkText}
      </a>
      {detail.suffix}
    </>
  );
}

function SemanticPipelineVisual({
  onNavigateSlide,
}: {
  onNavigateSlide?: NavigateSlide;
}) {
  const steps = [
    {
      details: [
        { text: "Extract equations + context" },
        { text: "Interpret construction" },
        {
          linkText: "spec",
          targetId: "backup-clean-spec-example",
          text: "Draft candidate ",
        },
        { text: "Provenance + uncertainty" },
        { text: "Expert confirms / edits" },
      ],
      title: "PDF / LaTeX -> Clean Spec",
    },
    {
      details: [
        {
          linkText: "code objects",
          targetId: "backup-code-object-example",
          text: "Identify ",
        },
        { text: "Normalize notation" },
        { text: "Link objects to source" },
        { text: "Record assumptions / ambiguity" },
      ],
      title: "Semantic Code Model",
    },
    {
      details: [
        {
          linkText: "constructors",
          targetId: "backup-constructor-example",
          text: "Expand ",
        },
        { text: "Build matrices" },
        { text: "Extract connections" },
        {
          linkText: "generated objects",
          targetId: "backup-generated-objects-example",
          text: "Track ",
        },
      ],
      title: "Expanded Code Structure",
    },
    {
      details: [
        { text: "Check dimensions" },
        { text: "Check commutation" },
        { text: "Check sparsity / degree" },
        { text: "Report failures" },
      ],
      title: "Validation",
    },
    {
      details: [
        { text: "Generate layouts" },
        { text: "Show alternatives" },
        { text: "Mark layout choices" },
        { text: "Compare options" },
        { text: "User selects" },
      ],
      title: "Geometry Alternatives",
    },
    {
      details: [
        { text: "Export editable figure" },
        { text: "Preserve semantic links" },
        { text: "Support Agent-assisted edits" },
        { text: "Record provenance" },
      ],
      title: "Editable Figure",
    },
  ];

  return (
    <section
      className="semantic-pipeline-panel"
      aria-label="Semantic figure generation pipeline"
    >
      {steps.map((step, index) => (
        <article
          className="pipeline-step"
          data-gate={index === 3}
          data-has-details={Boolean(step.details?.length)}
          key={step.title}
          style={{ "--step-index": index } as CSSProperties}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step.title}</strong>
          {step.details?.length ? (
            <ol className="pipeline-substeps">
              {step.details.map((detail) => (
                <li key={`${detail.text}-${detail.linkText ?? ""}`}>
                  <PipelineDetailText
                    detail={detail}
                    onNavigateSlide={onNavigateSlide}
                  />
                </li>
              ))}
            </ol>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function OutputColumnsVisual({ points }: { points: SlidePoint[] }) {
  return (
    <section
      className="visual-panel output-columns-panel"
      aria-label="Expected outputs"
    >
      {points.map((point, index) => (
        <article className="output-column" key={point.title}>
          <span className="output-column-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{point.label}</span>
          <strong>{point.title}</strong>
          <p className="output-column-body">{point.body}</p>
          {point.bullets?.length ? (
            <ul>
              {point.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function QuestionMapVisual() {
  const questions = [
    "Automation",
    "Ambiguity",
    "Trust",
    "Interaction",
    "Evaluation",
    "First figure type",
  ];

  return (
    <section
      className="visual-panel question-map-panel"
      aria-label="Open VIS/HCI questions"
    >
      <div className="question-center">
        <strong>Trustworthy generated geometry?</strong>
      </div>
      {questions.map((question, index) => (
        <span
          className="question-node"
          key={question}
          style={{ "--question-index": index } as CSSProperties}
        >
          {question}
        </span>
      ))}
    </section>
  );
}

function RoadmapVisual() {
  const steps = [
    "Corpus",
    "Target family",
    "Clean spec",
    "Expansion",
    "Validation",
    "Layouts",
    "Expert feedback",
  ];

  return (
    <section
      className="visual-panel roadmap-panel"
      aria-label="Remaining tasks roadmap"
    >
      {steps.map((step, index) => (
        <article className="roadmap-step" key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
        </article>
      ))}
    </section>
  );
}

function PointGrid({
  points = [],
  compact = false,
}: {
  points?: SlidePoint[];
  compact?: boolean;
}) {
  if (!points.length) {
    return null;
  }

  return (
    <div className="point-grid" data-compact={compact}>
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
      className="point-card"
      data-compact={compact}
      data-emphasis={point.emphasis}
    >
      <div>
        {point.label ? <span>{point.label}</span> : null}
        <strong>{point.title}</strong>
      </div>
      {point.bullets?.length ? (
        <ul>
          {point.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : (
        <p>{point.body}</p>
      )}
      {point.links?.length ? (
        <nav
          aria-label={`References for ${point.title}`}
          className="reference-links"
        >
          {point.links.map((link) => (
            <a
              href={link.href}
              key={`${link.label}-${link.href}`}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </article>
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
