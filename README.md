# Paper Sharing Slides

This is a web-based paper-sharing template for research group presentations. It turns the original PDF prompt list into an interactive Next.js deck with structured slide templates, speaker notes, keyboard navigation, and presentation controls.

## Getting Started

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using The Deck

- Use the left rail to jump between slide templates.
- Use `ArrowLeft`, `ArrowRight`, `N`, `P`, `Home`, and `End` for keyboard navigation.
- Use the notes button to show or hide speaker notes.
- Use the Notes window button to open a separate `/speaker-notes` window and keep it synced with the active slide. Move that window to a second display for presenter notes.
- Use the fullscreen button only for the main deck.

## Editing The Template

The deck content lives in `src/app/deck-data.ts`. Each slide includes:

- the main question to answer,
- the artifact the presenter should prepare,
- the visual cue for the slide design,
- the presenter move,
- speaker-note quality checks.

The interactive UI is in `src/app/page.tsx`, and the visual system is in `src/app/globals.css`.

## Checks

Use Bun for local commands:

```bash
bun run lint
bun run build
```
