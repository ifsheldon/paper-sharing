"use client";

import { useEffect, useState } from "react";
import { slideTemplates, templatePrinciples } from "../deck-data";
import {
  PRESENTER_NOTES_CHANNEL,
  PRESENTER_NOTES_STORAGE_KEY,
  type PresenterNotesState,
} from "../presenter-notes-state";

const firstSlide = slideTemplates[0];

const defaultNotes: PresenterNotesState = {
  index: 0,
  total: slideTemplates.length,
  section: firstSlide.section,
  title: firstSlide.title,
  subtitle: firstSlide.subtitle ?? "",
  presenterMove: firstSlide.presenterMove,
  slots: firstSlide.slots,
  notes: firstSlide.notes,
  principles: templatePrinciples,
};

export default function SpeakerNotesPage() {
  const [notes, setNotes] = useState<PresenterNotesState>(defaultNotes);

  useEffect(() => {
    setNotes(readPresenterNotes());

    const channel = new BroadcastChannel(PRESENTER_NOTES_CHANNEL);
    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (isPresenterNotesState(event.data)) {
        setNotes(event.data);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== PRESENTER_NOTES_STORAGE_KEY || !event.newValue) {
        return;
      }

      const parsed = parsePresenterNotes(event.newValue);
      if (parsed) {
        setNotes(parsed);
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      channel.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <main className="presenter-notes-page">
      <header className="presenter-notes-hero">
        <span className="presenter-notes-index">
          {String(notes.index + 1).padStart(2, "0")} / {notes.total} -{" "}
          {notes.section}
        </span>
        <h1>{notes.title}</h1>
        {notes.subtitle ? <p>{notes.subtitle}</p> : null}
      </header>

      <section className="presenter-notes-card">
        <span className="presenter-notes-label">Key points</span>
        <ul>
          {notes.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function readPresenterNotes() {
  const stored = window.localStorage.getItem(PRESENTER_NOTES_STORAGE_KEY);
  if (!stored) {
    return defaultNotes;
  }

  return parsePresenterNotes(stored) ?? defaultNotes;
}

function parsePresenterNotes(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return isPresenterNotesState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isPresenterNotesState(value: unknown): value is PresenterNotesState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PresenterNotesState>;
  return (
    typeof candidate.index === "number" &&
    typeof candidate.total === "number" &&
    typeof candidate.section === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.subtitle === "string" &&
    typeof candidate.presenterMove === "string" &&
    Array.isArray(candidate.slots) &&
    Array.isArray(candidate.notes) &&
    Array.isArray(candidate.principles)
  );
}
