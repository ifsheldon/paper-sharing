# QEC Equation-To-Figure Idea Evaluation Slides

This is a web-based idea-evaluation deck for **From QEC Equations to Inspectable Code Geometry**. It reuses the existing Next.js presentation scaffold: slide navigation, keyboard controls, speaker notes, a separate notes window, fullscreen mode, and a 16:9 slide canvas.

The deck is written for a visualization and HCI research group with little quantum computing background. It foregrounds the visualization problem: compact QEC code equations can define a code precisely, but they may hide the geometry needed for expert intuition, communication, and implementation.

## Getting Started

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the deck.

## Using The Deck

- Use the left rail to jump between slides.
- Use `ArrowLeft`, `ArrowRight`, `N`, `P`, `Home`, and `End` for keyboard navigation.
- Speaker notes are hidden by default. Use the notes button to show or hide concise key points for the current slide.
- Use the Notes window button to open a separate `/speaker-notes` window and keep it synced with the active slide.
- Use the fullscreen button only for the main deck.

## Editing The Deck

The deck content lives in `src/app/deck-data.ts`. Each slide includes:

- the title, section, layout, visual type, and presenter move,
- the slide copy, point cards, and speaker notes,
- a `visual` field that selects one code-native diagram renderer.

The interactive UI is in `src/app/page.tsx`, and the visual system is in `src/app/globals.css`.
Equation blocks in custom diagrams use KaTeX through the local `MathBlock`
component in `src/app/page.tsx`; keep formulas as LaTeX strings there rather
than reverting to monospaced text.

## Checks

Use Bun for local commands:

```bash
bun run lint
bun run build
```
