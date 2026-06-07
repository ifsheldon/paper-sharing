export const PRESENTER_NOTES_CHANNEL = "paper-sharing-presenter-notes";

export const PRESENTER_NOTES_STORAGE_KEY = "paper-sharing-presenter-notes";

export type PresenterNotesState = {
  index: number;
  total: number;
  section: string;
  title: string;
  subtitle: string;
  presenterMove: string;
  slots: string[];
  notes: string[];
  principles: string[];
};
