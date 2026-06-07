import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  BookOpenText,
  Brain,
  ChartNoAxesCombined,
  ClipboardCheck,
  Crosshair,
  Flag,
  Grid2X2,
  MessageSquareQuote,
  Milestone,
  Network,
  Presentation,
  Scale,
  SearchCheck,
  Workflow,
} from "lucide-react";

export type Tone = "ink" | "green" | "blue" | "amber" | "coral" | "violet";

export type SlideTemplate = {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  intent: string;
  question: string;
  artifact: string;
  presenterMove: string;
  visualCue: string;
  icon: LucideIcon;
  tone: Tone;
  slots: string[];
  notes: string[];
};

export const slideTemplates: SlideTemplate[] = [
  {
    id: "paper-card",
    section: "Setup",
    title: "Paper Card",
    subtitle: "Open with the paper as an object worth inspecting.",
    intent:
      "Replace a plain title slide with a compact research card that tells the audience what they are about to spend attention on.",
    question:
      "What is the paper, who made it, where did it appear, and why should this room care today?",
    artifact:
      "Paper title, authors, venue, presenter, date, and one visual anchor from the paper.",
    presenterMove:
      "Name the paper, then give the one-sentence reason for choosing it before any background.",
    visualCue:
      "Use a cropped figure, task diagram, or result panel instead of a logo or decorative image.",
    icon: Presentation,
    tone: "ink",
    slots: [
      "Paper title",
      "Authors and affiliations",
      "Venue and year",
      "Presenter and date",
      "One-line selection rationale",
    ],
    notes: [
      "Keep the first slide specific. Do not spend the opening on generic field history.",
      "The paper figure should be legible enough to point at during the first minute.",
    ],
  },
  {
    id: "why-this-paper",
    section: "Motivation",
    title: "Why This Paper",
    subtitle: "Justify the seminar time before introducing technical detail.",
    intent:
      "Make the selection criterion explicit: influence, controversy, relevance, award status, adoption, or a strong connection to the group agenda.",
    question:
      "Among thousands of papers, what makes this one worth 20 minutes of 30 researchers' attention?",
    artifact:
      "Citation signal, award or review signal, project relevance, or concrete gap this paper exposes.",
    presenterMove:
      "State the attention cost, then show two or three evidence signals that make the cost worthwhile.",
    visualCue: "Use an evidence stack rather than a bullet list.",
    icon: SearchCheck,
    tone: "green",
    slots: [
      "Field signal",
      "Group relevance",
      "What we can reuse",
      "What we should challenge",
    ],
    notes: [
      "Useful signals include citations, downloads, awards, reviews, media coverage, or direct relevance to current projects.",
      "If the paper is obscure, the rationale can be novelty or a useful failure mode.",
    ],
  },
  {
    id: "background-funnel",
    section: "Problem",
    title: "Background Funnel",
    subtitle: "Move from broad context to a narrow problem in three steps.",
    intent:
      "Prevent the introduction from staying vague. The audience should know the exact problem before the method appears.",
    question:
      "What general context matters, what motivates the work, and what specific problem does the paper solve?",
    artifact:
      "A three-level funnel: background, motivation, and specific problem in two or three sentences.",
    presenterMove:
      "Compress the field background, then slow down at the problem statement until it is precise.",
    visualCue: "Use a funnel with decreasing width and increasing specificity.",
    icon: Crosshair,
    tone: "blue",
    slots: [
      "General background",
      "Work motivation",
      "Specific problem",
      "Boundary of scope",
    ],
    notes: [
      "The specific problem should be explainable without reading the paper.",
      "If the problem statement needs many caveats, split scope and non-scope explicitly.",
    ],
  },
  {
    id: "problem-position",
    section: "Problem",
    title: "Problem Position",
    subtitle:
      "Classify the problem as new or old, then defend the classification.",
    intent:
      "Separate importance from novelty. A new problem needs a why-now argument; an old problem needs a why-current-solutions-fail argument.",
    question:
      "Is this a new problem or an old problem, and what makes the paper's positioning credible?",
    artifact:
      "A two-lane argument: new-problem justification versus old-problem gap analysis.",
    presenterMove:
      "Choose one lane decisively. Avoid pretending every paper is both completely new and historically grounded.",
    visualCue:
      "Use paired lanes with current evidence, weakness, and implication.",
    icon: Scale,
    tone: "amber",
    slots: [
      "If new: why now",
      "If old: current solutions",
      "Failure mode",
      "Why the gap matters",
    ],
    notes: [
      "For old problems, name the strongest existing solution before criticizing it.",
      "For new problems, show the external change that made it important.",
    ],
  },
  {
    id: "novelty-quadrant",
    section: "Novelty",
    title: "Novelty Quadrant",
    subtitle: "Locate the paper in the problem-technique space.",
    intent:
      "Make novelty concrete by classifying the paper as one of four combinations: new or old problem, new or old technique.",
    question: "Where does this paper sit in the problem by technique matrix?",
    artifact:
      "A 2x2 quadrant with the selected cell and evidence for the classification.",
    presenterMove:
      "Put the paper in one cell, then explain what evidence would move it to a different cell.",
    visualCue: "Use a quadrant and highlight the selected cell.",
    icon: Grid2X2,
    tone: "violet",
    slots: [
      "New problem, new technique",
      "New problem, old technique",
      "Old problem, new technique",
      "Old problem, old technique",
    ],
    notes: [
      "The matrix is a forcing function. It helps expose weak novelty claims.",
      "A paper can still be valuable in an old-old cell if it changes evidence, scale, usability, or synthesis.",
    ],
  },
  {
    id: "author-contributions",
    section: "Contributions",
    title: "Author Contributions",
    subtitle:
      "Report what the paper claims before adding your own interpretation.",
    intent:
      "Give the authors' contribution list fairly, but structure it so the audience can track claim, evidence, and dependency.",
    question: "What major contributions do the authors claim in the paper?",
    artifact:
      "A contribution ledger copied or closely paraphrased from the paper.",
    presenterMove:
      "Mark each author claim as method, system, theory, dataset, study, or empirical finding.",
    visualCue: "Use a ledger with claim type, paper evidence, and dependency.",
    icon: ClipboardCheck,
    tone: "green",
    slots: [
      "Contribution 1",
      "Contribution 2",
      "Contribution 3",
      "Evidence location",
    ],
    notes: [
      "This is the one place where faithful author wording matters most.",
      "If you paraphrase, keep the original meaning and cite the paper section or figure.",
    ],
  },
  {
    id: "presenter-contributions",
    section: "Contributions",
    title: "Your Contribution Read",
    subtitle: "Show what you think the real value is.",
    intent:
      "Make room for the presenter's judgment. Your contribution list can differ from the authors' list if you explain why.",
    question:
      "From your point of view, what does this paper actually contribute to the field or to our group?",
    artifact:
      "Accepted claims, contested claims, transferable ideas, and a strongest-use case.",
    presenterMove:
      "Be explicit about the difference between author claims and your reading of the paper's value.",
    visualCue:
      "Use a four-cell reading board: accept, qualify, contest, transfer.",
    icon: Brain,
    tone: "blue",
    slots: ["I accept", "I qualify", "I contest", "I would transfer"],
    notes: [
      "This slide is where the talk becomes yours, not a summary of the PDF.",
      "A useful disagreement is better than a generic praise paragraph.",
    ],
  },
  {
    id: "related-work",
    section: "Context",
    title: "Related Work Critique",
    subtitle: "Compare and critique, not just list.",
    intent:
      "Identify the works this paper compares against and the works it builds on. Each entry needs a reason, not just a citation.",
    question:
      "Which prior works matter, what are their weaknesses, and how does this paper depend on them?",
    artifact:
      "A critique matrix with author, year, venue, role, limitation, and paper response.",
    presenterMove:
      "Group prior work by function: competitors, building blocks, datasets, algorithms, or evaluation baselines.",
    visualCue: "Use a matrix with critique columns and a dependency rail.",
    icon: Network,
    tone: "amber",
    slots: [
      "Compared against",
      "Built on",
      "Known weakness",
      "How this paper responds",
    ],
    notes: [
      "Do not list related work without critique.",
      "For borrowed methods, explain the source field and what had to change for this problem.",
    ],
  },
  {
    id: "methods",
    section: "Method",
    title: "Method Walkthrough",
    subtitle: "Explain encodings, tasks, procedures, and rationale together.",
    intent:
      "Turn methods into a usable walkthrough. For visualization papers, connect visual encoding to analytical task and user action.",
    question:
      "For each major method component, what does it encode, what task does it support, and why is it preferable to alternatives?",
    artifact:
      "Encoding cards, task procedure, visual cues, interactions, rationale, and rejected alternatives.",
    presenterMove:
      "Use figures. Ask the audience to follow the procedure rather than only hearing a description.",
    visualCue: "Use linked method cards and an interaction path.",
    icon: Workflow,
    tone: "green",
    slots: [
      "Encoding scheme",
      "Target analytical task",
      "Procedure and visual cue",
      "Interaction",
      "Design rationale",
      "Rejected alternatives",
    ],
    notes: [
      "For non-visualization papers, reinterpret encoding as the main technical representation or modeling choice.",
      "Explain why the chosen scheme is better than plausible alternatives.",
    ],
  },
  {
    id: "results-evaluation",
    section: "Evidence",
    title: "Results and Evaluation",
    subtitle: "Separate result novelty from evaluation strength.",
    intent:
      "Show what the method can do, what it improves over, and how the authors tested those claims.",
    question:
      "What results were not achievable before, what improved over prior methods, and how was the evidence evaluated?",
    artifact:
      "Result demonstration, baseline comparison, metric, user study, ablation, case study, or limitation.",
    presenterMove:
      "Lead with the strongest result, then test how strong the evidence actually is.",
    visualCue:
      "Use an evidence board with result, comparison, and evaluation method.",
    icon: ChartNoAxesCombined,
    tone: "blue",
    slots: [
      "New capability",
      "Efficiency or intuitiveness gain",
      "Evaluation method",
      "Evidence strength",
    ],
    notes: [
      "A beautiful result is not automatically a strong evaluation.",
      "When evaluation is weak, distinguish missing evidence from a fatal flaw.",
    ],
  },
  {
    id: "critical-thinking",
    section: "Critique",
    title: "Critical Reading",
    subtitle: "Make the limitations useful for future work.",
    intent:
      "Move beyond a weakness list. Convert limitations into lessons, risks, and research opportunities for the group.",
    question:
      "What are the paper's weaknesses, what did you learn, and how can our group benefit from it?",
    artifact:
      "Limitation map, learned principle, group application, and follow-up experiment.",
    presenterMove:
      "Use precise criticism. Say what would have convinced you, not only what is missing.",
    visualCue: "Use a critique-to-opportunity map.",
    icon: MessageSquareQuote,
    tone: "coral",
    slots: ["Limitation", "Risk", "Lesson", "Group opportunity"],
    notes: [
      "Avoid vague criticism like 'needs more evaluation' unless you name the missing evidence.",
      "A limitation can still teach a design principle or a useful boundary condition.",
    ],
  },
  {
    id: "take-home",
    section: "Synthesis",
    title: "Take-Home Messages",
    subtitle: "End with three ideas the audience can remember.",
    intent:
      "Choose up to three messages: a problem, method, figure, argument, evaluation lesson, or group-relevant action.",
    question:
      "What are the three things the audience should remember after the talk?",
    artifact: "Three concise memory cards, each with one claim and one reason.",
    presenterMove: "Phrase each takeaway as a sentence, not a topic label.",
    visualCue:
      "Use three large cards with different roles: remember, use, question.",
    icon: Flag,
    tone: "green",
    slots: ["Remember", "Use", "Question"],
    notes: [
      "A good take-home message survives without the slide deck.",
      "Do not cram every contribution into the conclusion.",
    ],
  },
  {
    id: "talk-architecture",
    section: "Delivery",
    title: "Talk Architecture",
    subtitle: "Design audience attention, suspense, and contrast.",
    intent:
      "Plan how the talk will feel, not only what it contains. The template asks for interest, suspense, and a foil-versus-answer story.",
    question:
      "How will you stimulate interest, make the solution less obvious, and create a clear contrast with alternatives?",
    artifact:
      "Opening hook, suspense question, foil method, answer method, and reveal point.",
    presenterMove:
      "Build tension before the method. Let the audience feel why naive solutions fail.",
    visualCue: "Use a narrative arc with a marked reveal moment.",
    icon: Milestone,
    tone: "amber",
    slots: ["Interest hook", "Suspense question", "Foil", "Answer", "Reveal"],
    notes: [
      "The contrast can be method versus baseline, old workflow versus new workflow, or confusing evidence versus clarified evidence.",
      "Do not over-dramatize. The goal is attention, not theatrics.",
    ],
  },
  {
    id: "interaction-tricks",
    section: "Delivery",
    title: "Interaction Moves",
    subtitle: "Use the audience as readers, not passive listeners.",
    intent:
      "Translate the template's trick list into deliberate interaction patterns that can be placed inside the talk.",
    question:
      "Where will the audience observe, compare, predict, or solve a mystery with you?",
    artifact:
      "Question prompt, figure observation, side-by-side comparison, data mystery, and redundant explanation.",
    presenterMove:
      "Choose one or two interaction moves. Too many interruptions weaken the flow.",
    visualCue: "Use a move library with when-to-use guidance.",
    icon: AudioLines,
    tone: "blue",
    slots: [
      "Ask a question",
      "Observe a visualization",
      "Compare side by side",
      "Pose a data mystery",
      "Explain through visual, text, and voice",
    ],
    notes: [
      "Interaction works best when the answer is visible but not immediately obvious.",
      "For visual encodings, repeat meaning through the figure, a short label, and spoken explanation.",
    ],
  },
  {
    id: "discussion",
    section: "Discussion",
    title: "Discussion Launchpad",
    subtitle: "Turn the paper-sharing session into research action.",
    intent:
      "Close with specific questions that invite the group to connect the paper to projects, methods, and future work.",
    question: "What should the group discuss, test, or borrow after the talk?",
    artifact: "Three discussion prompts and one small next-step experiment.",
    presenterMove:
      "End by handing the room a decision or experiment, not only a thank-you slide.",
    visualCue: "Use a launchpad with prompts, owners, and next action.",
    icon: BookOpenText,
    tone: "ink",
    slots: [
      "Discussion question",
      "Potential project fit",
      "Risk to test",
      "Next experiment",
    ],
    notes: [
      "This is not in the original PDF as a separate slide, but it makes the web template actionable.",
      "Use it for Q&A or delete it if the session format has a fixed ending.",
    ],
  },
];

export const templatePrinciples = [
  "Every slide asks for evidence, not decoration.",
  "Visual structure changes with the argument.",
  "Presenter notes tell you how to use the slide.",
];

export const sectionOrder = [
  "Setup",
  "Motivation",
  "Problem",
  "Novelty",
  "Contributions",
  "Context",
  "Method",
  "Evidence",
  "Critique",
  "Synthesis",
  "Delivery",
  "Discussion",
];
