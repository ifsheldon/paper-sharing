# Orality Paper Sharing Slides

This is a web-based paper-sharing deck for **Orality: A Semantic Canvas for Externalizing and Clarifying Thoughts with Speech**. It keeps the paper-sharing template controls, speaker notes, keyboard navigation, and presentation workflow, but the slide content now follows a concrete Orality-first talk arc with three related papers summarized on separate ending slides.

## Getting Started

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using The Deck

- Use the left rail to jump between slides.
- Use `ArrowLeft`, `ArrowRight`, `N`, `P`, `Home`, and `End` for keyboard navigation.
- Speaker notes are hidden by default. Use the notes button to show or hide concise key points for the current slide.
- Use the Notes window button to open a separate `/speaker-notes` window and keep it synced with the active slide. Move that window to a second display for presenter notes.
- Use the fullscreen button only for the main deck.

## Editing The Template

The deck content lives in `src/app/deck-data.ts`. Each slide includes:

- the title, section, layout, and presenter move,
- the slide copy, cards, bullets, and speaker key points,
- optional figure metadata and paper metadata badges,

Figure assets used by the deck live in `public/figures`.

The interactive UI is in `src/app/page.tsx`, and the visual system is in `src/app/globals.css`.

## Checks

Use Bun for local commands:

```bash
bun run lint
bun run build
```
