import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  BookOpenText,
  Brain,
  ChartNoAxesCombined,
  Crosshair,
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

export type SlideLayout =
  | "cover"
  | "big-idea"
  | "cards"
  | "funnel"
  | "comparison"
  | "quadrant"
  | "figure-focus"
  | "pipeline"
  | "evidence"
  | "takeaways"
  | "related";

export type SlidePoint = {
  label?: string;
  title: string;
  body: string;
  bullets?: string[];
  emphasis?: boolean;
  href?: string;
  selected?: boolean;
  showBodyWithBullets?: boolean;
};

export type SlideFigure = {
  src: string;
  alt: string;
  caption: string;
  read?: string;
  idea?: string;
  width: number;
  height: number;
};

export type PaperMeta = {
  venue: string;
  href: string;
};

export type SlideTemplate = {
  id: string;
  section: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  headline?: string;
  presenterLine?: string;
  body?: string;
  bullets?: string[];
  layout: SlideLayout;
  presenterMove: string;
  icon: LucideIcon;
  tone: Tone;
  slots: string[];
  notes: string[];
  points?: SlidePoint[];
  figures?: SlideFigure[];
  meta?: SlidePoint[];
  paperMeta?: PaperMeta;
};

const oralityFigureBase = "/figures/orality";
const relatedFigureBase = "/figures/related";

export const slideTemplates: SlideTemplate[] = [
  {
    id: "paper-card",
    section: "Setup",
    title:
      "Orality: A Semantic Canvas for Externalizing and Clarifying Thoughts with Speech",
    shortTitle: "Orality",
    subtitle: "",
    headline:
      "Speech becomes editable spatial material, not a transcript to clean up later.",
    presenterLine: "Presented by Feng Liang, June 8th",
    body: "Wengxi Li, Jingze Tian, and Can Liu (劉燦). CHI 2026. The paper asks how AI can scaffold unclear thinking while preserving user agency.",
    layout: "cover",
    presenterMove:
      "Name the paper, then frame it as an interface question about thinking with speech instead of a transcription paper.",
    icon: Presentation,
    tone: "ink",
    slots: [
      "Exact title and venue",
      "Main interface as opening visual",
      "One-sentence reason for this paper",
    ],
    notes: [
      "Orality is a CHI 2026 paper by Wengxi Li, Jingze Tian, and Can Liu.",
      "The core idea is that speech should become editable spatial material, not a transcript to clean up later.",
      "This matters because voice interfaces need structure while preserving user agency.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure01_main_interface.png`,
        alt: "Orality main interface",
        caption:
          "Figure 1: semantic canvas, speech input, AI stimulation, history, and export.",
        width: 2940,
        height: 1818,
      },
    ],
    meta: [
      {
        label: "Venue",
        title: "CHI 2026",
        body: "ACM Digital Library Link",
        href: "https://dl.acm.org/doi/full/10.1145/3772318.3791713",
      },
      {
        label: "Authors",
        title: "City University of Hong Kong",
        body: "Wengxi Li, Jingze Tian, Can Liu (劉燦).",
      },
      {
        label: "Why care",
        title: "LLM voice needs structure",
        body: "Voice is increasingly important, but current voice/chat artifacts stay too linear for sensemaking.",
        bullets: [
          "Voice is important in meetings.",
          "Voice is becoming important in vibe coding.",
          "Current voice/chat artifacts stay too linear for sensemaking.",
        ],
      },
      {
        label: "Novelty/Contribution",
        title: "Speech becomes a semantic canvas",
        body: "The system turns spoken thought into editable spatial objects with embedded AI scaffolds.",
      },
    ],
  },
  {
    id: "transcript-trap",
    section: "Hook",
    title: "The Transcript Trap",
    subtitle:
      "Speech is low friction, but transcripts are poor thinking media.",
    headline:
      "You talk for ten minutes to clarify an idea, and now the artifact is a transcript you do not want to read.",
    body: "Orality starts from this mismatch: spoken thinking is fast, personal, and non-linear; speech-to-text output is linear, verbose, and hard to reorganize.",
    layout: "big-idea",
    presenterMove:
      "Make the audience feel the failure before naming the system solution.",
    icon: AudioLines,
    tone: "coral",
    slots: [
      "Relatable failure case",
      "Speech is useful for externalization",
      "Linear output breaks sensemaking",
    ],
    notes: [
      "Speech is a low-friction way to externalize messy thoughts.",
      "A transcript preserves words but loses relationships, priorities, conflicts, and revisions.",
      "Orality starts from this mismatch between easy speech input and hard-to-use transcript output.",
    ],
    points: [
      {
        label: "Input",
        title: "Speech is natural",
        body: "People can externalize messy thoughts quickly without stopping to edit.",
      },
      {
        label: "Artifact",
        title: "Transcript is linear",
        body: "The output preserves words, but not relationships, priorities, or evolving structure.",
      },
      {
        label: "Consequence",
        title: "The user repairs structure",
        body: "The cognitive work moves from thinking to cleaning, scanning, and reorganizing text.",
      },
    ],
  },
  {
    id: "why-this-paper",
    section: "Motivation",
    title: "Why This Paper",
    subtitle:
      "The paper is useful because speech is becoming a serious interaction modality.",
    layout: "cards",
    presenterMove:
      "Frame this as a group-relevance slide before moving into the paper's problem statement.",
    icon: SearchCheck,
    tone: "green",
    slots: [
      "Voice in meetings and lectures",
      "Voice in vibe coding",
      "Voice for vibe design and visualization",
    ],
    notes: [
      "Voice matters for meetings, lecture notes, planning, and other workflows where people think aloud.",
      "Voice is becoming important in vibe coding, where developers increasingly speak instructions instead of typing every step.",
      "For our group, the interesting extension is voice for vibe design and vibe visualization.",
    ],
    bullets: [
      "Voice matters in many scenarios, such as meetings. With slight extensions, this paper could support discussing action plans in a meeting, taking notes in a lecture, and similar workflows.",
      "Voice is becoming a major modality in vibe coding. Many developers no longer type every instruction manually.",
      "Voice may also be useful in vibe design and vibe visualization, which is the focus of our group.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/claude-design.png`,
        alt: "Claude design interface with an interactive globe project",
        caption:
          "Example: Claude Design shows how voice and chat-driven design work increasingly produces visual, interactive artifacts.",
        width: 1219,
        height: 717,
      },
    ],
  },
  {
    id: "background-funnel",
    section: "Problem",
    title: "Background",
    subtitle:
      "The paper connects external cognition, speech, and LLM voice interfaces.",
    layout: "funnel",
    presenterMove:
      "Compress background quickly, then slow down at the exact problem statement.",
    icon: Crosshair,
    tone: "blue",
    slots: [
      "External representations support thinking",
      "Speech captures thought cheaply",
      "Chat and transcripts are hard to manipulate",
      "Target: personal thought clarification",
    ],
    notes: [
      "External representations help thinking because they make partial ideas visible and revisable.",
      "Speech is fast externalization, but it usually disappears or becomes a linear transcript.",
      "The paper targets individual, ambiguous, evolving thought clarification, not meeting capture or automatic generation.",
    ],
    points: [
      {
        label: "General",
        title: "Thinking uses external representations",
        body: "Notes, sketches, whiteboards, and diagrams make partial ideas visible. They let people compare, regroup, and return to thoughts that are not finished yet.",
      },
      {
        label: "Motivation",
        title: "Speech is fast externalization",
        body: "Speech is useful when thoughts are still forming because it does not force immediate editing. The problem is that spoken thinking usually disappears or becomes plain transcript text.",
      },
      {
        label: "Problem",
        title: "LLM voice inherits the chat log",
        body: "Current voice/chat interfaces keep a chronological conversation history. Topics, relationships, conflicts, and revisions remain implicit, so users must reconstruct structure afterward.",
      },
      {
        label: "Scope",
        title: "Clarify personal thoughts",
        body: "Orality targets individual, ambiguous, evolving thought clarification. AI helps turn speech into editable objects while the user keeps control over meaning and organization.",
      },
    ],
  },
  {
    id: "novelty-claim",
    section: "Novelty",
    title: "New Problem, Existing Techniques",
    subtitle: "",
    headline:
      "Spoken thought is fast and non-linear, but today's voice interfaces mostly produce linear artifacts that are tedious to read and hard to manipulate.",
    body: "The new problem is turning voice into an editable thinking artifact while keeping relationships, conflicts, revisions, and user agency visible.",
    layout: "quadrant",
    presenterMove:
      "Classify novelty decisively, then explain why existing ingredients can still produce a valuable interaction contribution.",
    icon: Grid2X2,
    tone: "violet",
    slots: [
      "Speech-to-text",
      "LLM semantic extraction",
      "Node-link canvas",
      "Embedding and PCA layout",
    ],
    notes: [
      "The new problem is turning voice into an editable thinking artifact.",
      "The technical ingredients are familiar: speech-to-text, LLM chunking, embeddings, PCA, and node-link canvases.",
      "The contribution is how these pieces are coupled around visible structure and user agency.",
    ],
    bullets: [
      "Speech-to-text transcription",
      "LLM semantic chunking and topic extraction",
      "Node-link diagrams and concept-map style canvases",
      "Sentence embeddings",
      "PCA projection for semantic placement",
      "Similarity-based layout refinement",
      "Prompted LLM questions, conflict detection, and memo export",
    ],
  },
  {
    id: "author-contributions",
    section: "Contributions",
    title: "Contributions",
    headline:
      "The authors claim a design process, a system artifact, and an empirical study.",
    layout: "cards",
    presenterMove:
      "List the claims first, then state that the strongest contribution is the interaction pattern.",
    icon: Milestone,
    tone: "amber",
    slots: [
      "Adapted framework and formative study",
      "Orality system artifact",
      "Within-subject evaluation",
      "Your contribution read",
    ],
    notes: [
      "The authors claim three contributions: design process, system artifact, and empirical study.",
      "The strongest contribution is the interaction pattern: speech input plus a malleable semantic canvas.",
      "The evidence supports the design needs and qualitative usefulness more strongly than broad performance superiority.",
    ],
    points: [
      {
        label: "Author claim 01",
        title: "Design process and framework",
        body: "Iterative design of Orality, grounded in an adapted framework for self thought clarification and a formative study on iterative verbalization.",
      },
      {
        label: "Author claim 02",
        title: "System artifact",
        body: "An AI-assisted speech-to-text canvas that extracts spoken gist into a manipulable node-link diagram and asks in-place thought-provoking questions.",
      },
      {
        label: "Author claim 03",
        title: "Empirical study",
        body: "A within-subject lab study with 12 participants comparing a multimodal canvas AI interface with a chat-based AI baseline.",
      },
      {
        label: "My read",
        title: "Interaction pattern",
        body: "The most convincing contribution is speech input plus a malleable semantic canvas:",
        bullets: [
          "It gives users something to inspect and manipulate between verbalization rounds.",
          "It is well supported by the formative study needs and the qualitative evaluation.",
        ],
        emphasis: true,
        showBodyWithBullets: true,
      },
    ],
  },
  {
    id: "formative-design-goals",
    section: "Contributions",
    title: "Formative Study to Design Goals",
    subtitle:
      "8 participants exposed what speech-based thought tools must support.",
    headline:
      "Users need speech to become an editable, evolving semantic structure, with AI scaffolding the thinking process without taking control.",
    layout: "cards",
    presenterMove:
      "Use this slide to show that the system features are grounded in observed breakdowns, not just interface invention.",
    icon: SearchCheck,
    tone: "green",
    slots: [
      "Non-linear thought representation",
      "Flexible, hierarchical structures",
      "Iterative thought evolution",
      "Non-intrusive AI assistance",
    ],
    notes: [
      "The formative study involved 8 participants using speech for self-proposed planning, writing, and problem-solving tasks.",
      "Participants needed semantic inspection, flexible restructuring, visible evolution, and agency-preserving AI.",
      "These needs become the design goals that explain the Orality interface.",
    ],
    points: [
      {
        label: "DG1",
        title: "Semantic inspection",
        body: "Transform sequential speech into a 2D representation so users can inspect topics, relationships, and the shape of an argument.",
      },
      {
        label: "DG2",
        title: "Flexible restructuring",
        body: "Let users define and revise task-specific schemas, from timelines to story blueprints to project outlines.",
      },
      {
        label: "DG3",
        title: "Visible evolution",
        body: "Make retelling, revision, and reorganization visible so users can compare versions and monitor their own logic.",
      },
      {
        label: "DG4",
        title: "Agency-preserving AI",
        body: "Provide questions, gaps, and conflicts on demand, while avoiding rigid over-interpretation or control takeover.",
      },
    ],
  },
  {
    id: "system-overview",
    section: "System",
    title: "System Overview",
    subtitle: "The canvas turns speech into inspectable, editable structure.",
    layout: "figure-focus",
    presenterMove:
      "Use Figure 1 as an observation exercise before explaining every component.",
    icon: Workflow,
    tone: "green",
    slots: [
      "Speech input",
      "Topic and content nodes",
      "Verbal instruction panel",
      "AI questions and conflicts",
      "Thought evolution and export",
    ],
    notes: [
      "Speech creates topic and content nodes on a semantic canvas.",
      "AI questions and conflicts appear as local objects near the thoughts they refer to.",
      "The user keeps steering through speech, selection, manual edits, history, and export.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure01_main_interface.png`,
        alt: "Orality interface overview",
        caption:
          "Figure 1: full interface with canvas, verbal controls, AI stimulation, history, and export.",
        width: 2940,
        height: 1818,
      },
    ],
    points: [
      {
        label: "Canvas",
        title: "Thoughts become nodes",
        body: "Topic and content nodes preserve a non-linear structure that can be moved, selected, and revised.",
      },
      {
        label: "AI",
        title: "Support appears locally",
        body: "Questions and conflicts sit near the thoughts they are meant to develop.",
      },
      {
        label: "User",
        title: "Agency remains visible",
        body: "The user keeps steering through speech, selection, canvas edits, history, and export choices.",
      },
    ],
  },
  {
    id: "conceptual-framework",
    section: "System",
    title: "Conceptual Framework",
    body: "The authors adapt Pirolli and Card's sensemaking model to speech-driven personal thought clarification.",
    layout: "figure-focus",
    presenterMove:
      "Use the framework to show that the features are not just a feature list.",
    icon: Brain,
    tone: "blue",
    slots: [
      "Thought externalization",
      "Structuring and schematizing",
      "Elaboration and deepening",
      "Reflection and presentation",
    ],
    notes: [
      "The authors adapt a sensemaking loop to personal thought clarification.",
      "The four phases are externalization, structuring, elaboration, and reflection or presentation.",
      "Orality's features correspond to these phases instead of being an arbitrary feature list.",
    ],
    points: [
      {
        label: "01",
        title: "Thought Externalization",
        body: "Speech turns messy internal thoughts into external material.",
      },
      {
        label: "02",
        title: "Structuring and Schematizing",
        body: "The semantic canvas organizes those thoughts into editable nodes and topics.",
      },
      {
        label: "03",
        title: "Elaboration and Deepening",
        body: "AI asks questions and detects conflicts to push thinking further.",
      },
      {
        label: "04",
        title: "Reflection and Presentation",
        body: "Users review thought evolution and export a memo.",
      },
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure02_conceptual_framework.png`,
        alt: "Conceptual framework for thought clarification",
        caption:
          "Figure 2: four layers of self thought clarification grounded in sensemaking theory.",
        width: 1390,
        height: 600,
      },
    ],
  },
  {
    id: "voice-restructuring",
    section: "Interaction",
    title: "Voice Restructures the Canvas",
    subtitle: "Speech is both content input and structural command.",
    headline:
      "The core interaction shift: users speak thoughts into the canvas, then speak commands to reorganize the canvas.",
    layout: "figure-focus",
    presenterMove:
      "Emphasize local versus global verbal restructuring as the first interaction novelty.",
    icon: AudioLines,
    tone: "amber",
    slots: [
      "Content dictation",
      "Local instruction on selected topics",
      "Global instruction over the whole canvas",
      "Merge, split, create, restructure",
    ],
    notes: [
      "Speech is both content input and structural command.",
      "Local commands operate on selected thoughts; global commands reorganize the whole canvas.",
      "The key difference from a transcript is that speech can refer to and restructure visible objects.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure03_verbal_restructuring.png`,
        alt: "Verbal restructuring commands in Orality",
        caption:
          "Figure 3: local and global verbal instructions restructure selected topics or the whole canvas.",
        width: 1450,
        height: 850,
      },
    ],
    points: [
      {
        label: "Local",
        title: "Operate on selected thoughts",
        body: "A user can focus AI restructuring on a chosen topic instead of the whole conversation.",
      },
      {
        label: "Global",
        title: "Change the whole schema",
        body: "The canvas can be reorganized around a new structure when the user's framing changes.",
      },
    ],
  },
  {
    id: "embedded-scaffolds",
    section: "Interaction",
    title: "AI Questions and Conflict Checks",
    subtitle: "AI questions and conflicts become visible objects.",
    headline:
      "The best transferable pattern: AI support should attach to specific user-authored objects.",
    layout: "figure-focus",
    presenterMove:
      "Name this pattern clearly because it is the idea that travels beyond Orality.",
    icon: MessageSquareQuote,
    tone: "green",
    slots: [
      "Ask Me Questions",
      "Show Me Conflicts",
      "Question nodes",
      "Conflict edges",
      "Scaffold rather than replacement",
    ],
    notes: [
      "AI support is spatial and inspectable, not just another chat response.",
      "Question nodes help deepen underdeveloped parts of the canvas.",
      "Conflict edges make contradictions visible so the user can accept, ignore, or repair them.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure04_ai_suggestions_conflicts.png`,
        alt: "AI question nodes and conflict edges",
        caption:
          "Figure 4: question nodes and conflict edges embedded in the user's semantic canvas.",
        width: 6342,
        height: 3550,
      },
    ],
    points: [
      {
        label: "Question nodes",
        title: "Deepen underdeveloped areas",
        body: "AI asks targeted questions where the canvas lacks detail.",
      },
      {
        label: "Conflict edges",
        title: "Make tension inspectable",
        body: "Detected contradictions become labeled relationships the user can accept, ignore, or repair.",
      },
    ],
  },
  {
    id: "implementation",
    section: "Method",
    title: "Implementation Details",
    subtitle: "",
    layout: "pipeline",
    presenterMove:
      "Keep this slide short. The audience needs the pipeline and fragility points, not implementation trivia.",
    icon: Network,
    tone: "blue",
    slots: [
      "AssemblyAI transcription",
      "GPT-5 chunking and entity extraction",
      "Sentence embeddings",
      "PCA placement",
      "Dynamic layout refinement",
    ],
    notes: [
      "The pipeline is transcription, LLM chunking/entity extraction, embedding, PCA placement, and layout refinement.",
      "The implementation explains both what is possible and where errors can enter.",
      "Misclassification, poor chunking, or bad layout can affect clarity and user agency.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure07_system_architecture.png`,
        alt: "Orality system architecture",
        caption:
          "Figure 7: transcription, LLM extraction, embeddings, PCA layout, and dynamic refinement.",
        width: 1120,
        height: 760,
      },
    ],
    points: [
      {
        label: "01",
        title: "Transcribe",
        body: "Speech is captured in real time and sent to the backend.",
      },
      {
        label: "02",
        title: "Chunk",
        body: "LLM prompts extract short content nodes and topic entities.",
      },
      {
        label: "03",
        title: "Place",
        body: "Embeddings and PCA position topics by semantic distance.",
      },
      {
        label: "04",
        title: "Refine",
        body: "Similarity-based forces pull related nodes closer over time.",
      },
    ],
  },
  {
    id: "evaluation-task",
    section: "Evidence",
    title: "Evaluation Task",
    subtitle: "",
    headline:
      "Participants clarified their own messy topics, not a fixed benchmark problem.",
    layout: "cards",
    presenterMove:
      "Explain the task before the baseline and result slides, because the open-ended design explains why the quantitative result is bounded.",
    icon: SearchCheck,
    tone: "coral",
    slots: [
      "Thought Clarification task",
      "Two participant-proposed topics",
      "20-minute recommended sessions",
      "Organize, do not outsource content",
    ],
    notes: [
      "Participants clarified their own messy topics rather than solving a fixed benchmark task.",
      "Each person used Orality for one topic and the ChatGPT baseline for another, with order counterbalanced.",
      "The task was organization and clarification, not asking the system to generate the content.",
    ],
    points: [
      {
        label: "Task",
        title: "Thought clarification",
        body: "Participants verbalized, externalized, organized, and refined their own thinking around a messy topic.",
      },
      {
        label: "Topic",
        title: "Self-proposed problems",
        body: "Each person brought two personal topics, such as project planning, strategy making, or comparative decisions.",
        bullets: [
          "UX researcher internship self-introduction",
          "Research classification framework planning",
          "Career or city-choice comparisons",
        ],
        showBodyWithBullets: true,
      },
      {
        label: "Condition",
        title: "One topic per tool",
        body: "Each participant used Orality for one topic and the ChatGPT baseline for the other, with order counterbalanced.",
      },
      {
        label: "Constraint",
        title: "Clarify, not generate",
        body: 'Participants were told to treat the system as an organizer and avoid prompts like "help me generate a plan."',
      },
    ],
  },
  {
    id: "problem-position",
    section: "Evidence",
    title: "Evaluation Baseline",
    subtitle:
      "The comparison is against speech + ChatGPT outline + text mindmap.",
    headline:
      "The baseline is not a blank page. It is dictation plus ChatGPT outline plus text mindmap.",
    body: "Orality's claim depends on a contrast: chat can summarize and suggest, but it does not give the user a persistent, directly manipulable thought object.",
    layout: "comparison",
    presenterMove:
      "Introduce the baseline as part of the evaluation before showing the quantitative result.",
    icon: Scale,
    tone: "amber",
    slots: [
      "Baseline: speech plus ChatGPT outline",
      "Generated text mindmap",
      "Failure: structure belongs to the chat",
      "Evaluation contrast before results",
    ],
    notes: [
      "The baseline is speech + ChatGPT outline + text mindmap.",
      "ChatGPT can summarize and organize speech, so this is not a weak baseline.",
      "The key contrast is manipulability: Orality gives the user a persistent thought object, while chat gives generated text.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure08_baseline_interface.png`,
        alt: "ChatGPT baseline interface",
        caption:
          "Figure 8: speech-to-text baseline with ChatGPT outline and text mindmap.",
        width: 1280,
        height: 1158,
      },
    ],
    points: [
      {
        label: "Strong current answer",
        title: "ChatGPT can organize speech",
        body: "It can turn a spoken dump into an outline or generated mindmap.",
      },
      {
        label: "Failure mode",
        title: "Reading long transcripts is tedious",
        body: "The user must parse generated text and conversation history instead of shaping the object directly.",
      },
    ],
  },
  {
    id: "evaluation",
    section: "Evidence",
    title: "Evaluation Results",
    subtitle: "The evidence is strongest as qualitative interaction insight.",
    headline:
      "8 / 12 preferred Orality for thinking, but clarity gains were not statistically significant.",
    layout: "evidence",
    presenterMove:
      "Lead with the honest result. The paper is stronger when you do not oversell the chart.",
    icon: ChartNoAxesCombined,
    tone: "coral",
    slots: [
      "Within-subject study with 12 participants",
      "ChatGPT baseline",
      "Higher descriptive clarity rating",
      "No significant clarity or workload difference",
      "Qualitative workflow differences",
    ],
    notes: [
      "8 of 12 participants preferred Orality for thinking.",
      "The quantitative clarity differences were not statistically significant.",
      "The result is best read as promising qualitative evidence, not proof that Orality beats ChatGPT across the board.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure10_thought_clarity_ratings.png`,
        alt: "Thought clarity ratings",
        caption:
          "Figure 10: descriptive clarity advantage, with no statistically significant difference.",
        width: 1513,
        height: 593,
      },
    ],
    points: [
      {
        label: "Setup",
        title: "Within-subject comparison",
        body: "Participants used Orality and a speech-to-ChatGPT baseline on self-proposed clarification tasks.",
      },
      {
        label: "Result",
        title: "Promising but bounded",
        body: "Orality trends higher and receives stronger thinking-process preference, but the quantitative claim is limited.",
      },
      {
        label: "Interpretation",
        title: "Look at workflows",
        body: "The interesting result is how people appropriated the tool, not just the mean score.",
      },
    ],
  },
  {
    id: "workflow-strategies",
    section: "Evidence",
    title: "What Users Actually Did",
    layout: "figure-focus",
    presenterMove:
      "Use this slide as the evaluation reveal: the system supports different styles of thinking.",
    icon: Milestone,
    tone: "green",
    slots: [
      "Master Commanders",
      "Hands-on Mapmakers",
      "Lazy Talkers",
      "Different balances of speech, manual control, and AI",
    ],
    notes: [
      "The qualitative finding is that users appropriated the tool in different ways.",
      "Master Commanders steered mostly through detailed voice instructions.",
      "Hands-on Mapmakers used manual canvas arrangement as part of thinking, while Lazy Talkers dumped speech first and structured later.",
    ],
    figures: [
      {
        src: `${oralityFigureBase}/figure13_workflow_strategies.png`,
        alt: "Three workflow strategies in Orality",
        caption:
          "Figure 13: Master Commanders, Hands-on Mapmakers, and Lazy Talkers.",
        width: 760,
        height: 430,
      },
    ],
    points: [
      {
        label: "Master Commanders",
        title: "Use voice as steering",
        body: "Some users relied on detailed verbal instructions and low manual movement.",
      },
      {
        label: "Hands-on Mapmakers",
        title: "Use canvas as workspace",
        body: "Some users used manual spatial arrangement as part of thinking.",
      },
      {
        label: "Lazy Talkers",
        title: "Use AI as organizer",
        body: "Some users spoke a lot first and used high-level structuring later.",
      },
    ],
  },
  {
    id: "critical-read",
    section: "Critique",
    title: "Critical Read and Takeaways",
    subtitle: "",
    headline:
      "The question is not whether the canvas is always better. It is when visible scaffolding is worth the extra work.",
    layout: "takeaways",
    presenterMove:
      "Give a fair read: accept the interaction pattern, qualify the evidence, contest overgeneralization, transfer the design principle.",
    icon: Brain,
    tone: "amber",
    slots: [
      "Accept: visual scaffolds",
      "Qualify: small study and non-significant measures",
      "Contest: extra metacognitive workload",
      "Transfer: attach AI to user-authored objects",
    ],
    notes: [
      "The strong part is visible AI scaffolding inside a user-controlled representation.",
      "The evidence is still early: small study, variable tasks, qualitative strength, and no significant clarity difference.",
      "The main risk is extra workload from repairing chunks, categories, conflicts, and visual overload.",
      "The transferable idea is object-scoped AI for user-authored artifacts.",
    ],
    points: [
      {
        label: "Accept",
        title: "Visual scaffold is strong",
        body: "AI questions and conflicts inside the canvas are easier to inspect than chat answers.",
      },
      {
        label: "Qualify",
        title: "Evidence is early",
        body: "Small lab study, variable tasks, qualitative strength, and no significant clarity difference.",
      },
      {
        label: "Contest",
        title: "Scaffolding can become workload",
        body: "Users may need to repair wrong chunks, bad categories, missed conflicts, or visual overload.",
      },
      {
        label: "Transfer",
        title: "Use object-scoped AI",
        body: "Attach prompts, critiques, and summaries to visible user-authored objects in our own tools.",
      },
    ],
  },
  {
    id: "related-orca",
    section: "Related",
    title:
      "Orca: Browsing at Scale Through User-Driven and AI-Facilitated Orchestration Across Malleable Webpages",
    shortTitle: "Orca",
    subtitle: "",
    paperMeta: {
      venue: "CHI 2026",
      href: "https://dl.acm.org/doi/full/10.1145/3772318.3790335",
    },
    headline:
      "Orca keeps users in the loop by making webpages visible, selectable, and operable as canvas objects.",
    layout: "figure-focus",
    presenterMove:
      "Use Orca as the closest interaction cousin: AI is scoped to visible objects rather than hidden prompt context.",
    icon: BookOpenText,
    tone: "ink",
    slots: [
      "Problem: cross-page work is fragmented",
      "System: Web Canvas plus AI operations",
      "Evaluation: formative eight-person study",
      "Transfer: selection-scoped AI over artifacts",
    ],
    notes: [
      "Orca turns many webpages into visible, selectable, and operable canvas objects.",
      "The connection to Orality is object-scoped AI: assistance is bound to visible user-selected context.",
      "The evidence is formative, so the value is mainly a design reference rather than a proven outcome claim.",
      "My idea: similar AI-assisted interfaces could support financial analysis over visible documents, charts, and sources.",
    ],
    figures: [
      {
        src: `${relatedFigureBase}/orca_canvas.png`,
        alt: "Orca overview",
        caption:
          "Orca: viewing, organizing, extracting, operating, and synthesizing across webpages.",
        width: 2808,
        height: 1806,
      },
    ],
    points: [
      {
        label: "Problem",
        title: "Tabs fragment broad web work",
        body: "Cross-page exploration, comparison, extraction, and synthesis are expensive in a linear tab stack.",
      },
      {
        label: "System",
        title: "Pages become workspace objects",
        body: "A Web Canvas supports grids, stacks, extraction, contextual expansion, summaries, and visible agents.",
      },
      {
        label: "Connection",
        title: "Scope AI to visible artifacts",
        body: "Like Orality, Orca makes AI assistance inspectable by binding operations to selected objects.",
      },
      {
        label: "My idea",
        title: "AI-assisted financial analysis",
        body: "Maybe we can design similar AI-assisted interfaces for financial analysis.",
        emphasis: true,
      },
    ],
  },
  {
    id: "related-ai-personality",
    section: "Related",
    title:
      "AI-exhibited Personality Traits Can Shape Human Self-concept through Conversations",
    shortTitle: "AI Personality",
    subtitle: "",
    paperMeta: {
      venue: "CHI 2026",
      href: "https://dl.acm.org/doi/full/10.1145/3772318.3790654",
    },
    headline:
      "AI traits are not just style; after personal-topic conversations, users' self-concepts moved toward the chatbot's measured trait profile.",
    layout: "figure-focus",
    presenterMove:
      "Use this as the cautionary ending: scaffolding thought also means shaping the thinker.",
    icon: BookOpenText,
    tone: "coral",
    slots: [
      "Problem: AI personality as social influence",
      "Method: pre/post self-concept vectors",
      "Result: short-term alignment and homogenization",
      "Transfer: audit user-state effects",
    ],
    notes: [
      "This paper asks whether chatbot personality can shift users' self-concept.",
      "After personal-topic conversations, users' self-descriptions moved toward the AI's measured trait profile.",
      "My read: we are shaping AI, and AI is shaping us as well.",
      "My idea: AI could guide mental health support, but the influence on users needs careful responsibility.",
    ],
    figures: [
      {
        src: `${relatedFigureBase}/ai_personality_overview.png`,
        alt: "AI personality study overview",
        caption:
          "AI Personality: same AI trait profile, pre/post self-concept measurement, and alignment after conversation.",
        read: "We are shaping AI and AI is shaping us as well.",
        idea: "Maybe we can use AI to guide people to improve their mental health.",
        width: 4647,
        height: 2338,
      },
    ],
    points: [
      {
        label: "Question",
        title: "Can AI traits shape self-concept?",
        body: "The paper studies whether users' personality self-descriptions move toward an AI's measured traits.",
      },
      {
        label: "Evidence",
        title: "Personal topics matter",
        body: "In a 92-participant study, alignment was significant especially after personal-topic conversations.",
      },
      {
        label: "Connection",
        title: "Evaluate effects on users",
        body: "For Orality-like systems, success should include user agency and psychological side effects, not only task output.",
      },
    ],
  },
  {
    id: "related-visual-metaphors",
    section: "Related",
    title: "Unpacking Visual Metaphors in Infographics: A Design Space",
    shortTitle: "Visual Metaphors",
    subtitle: "",
    paperMeta: {
      venue: "CHI 2026",
      href: "https://dl.acm.org/doi/full/10.1145/3772318.3790840",
    },
    headline:
      "The paper turns visual metaphor ideation into target, source, and reconstruction choices that can guide generative AI.",
    layout: "figure-focus",
    presenterMove:
      "Use this paper to close with the design-structure theme: generation improves when the intermediate design space is explicit.",
    icon: BookOpenText,
    tone: "blue",
    slots: [
      "Problem: metaphor ideation is ad hoc",
      "Contribution: coded design space",
      "Evaluation: designers prefer guided generations",
      "Transfer: structure before generation",
    ],
    notes: [
      "The paper makes visual metaphor design explicit through target insight, source property, and reconstruction strategy.",
      "Designers preferred design-space-guided generations for novelty, effectiveness, diversity, and satisfaction.",
      "This could be useful for Nanyi's work if the goal involves structured ideation for visual explanations.",
      "The evidence is designer preference, not necessarily reader comprehension or data-fidelity proof.",
    ],
    figures: [
      {
        src: `${relatedFigureBase}/visual_metaphors_design_space.png`,
        alt: "Visual metaphors design space",
        caption:
          "Visual Metaphors: target insight, source property, and reconstruction strategy as design variables.",
        read: "Maybe useful for Nanyi's work.",
        width: 1370,
        height: 725,
      },
    ],
    points: [
      {
        label: "Contribution",
        title: "2,029 examples become a design space",
        body: "The authors code metaphoric infographics by target insight, source property, and reconstruction strategy.",
      },
      {
        label: "Evaluation",
        title: "Guided generation performs better",
        body: "Designers preferred design-space-augmented outputs for novelty, effectiveness, diversity, and satisfaction.",
      },
    ],
  },
];

export const templatePrinciples = [
  "AI should scaffold human thinking inside inspectable representations.",
  "The talk dives deep into Orality, then uses three papers to broaden the pattern.",
  "Do not overclaim the evaluation; keep the critique specific.",
];

export const sectionOrder = [
  "Setup",
  "Hook",
  "Motivation",
  "Problem",
  "Novelty",
  "Contributions",
  "System",
  "Interaction",
  "Method",
  "Evidence",
  "Critique",
  "Related",
];
