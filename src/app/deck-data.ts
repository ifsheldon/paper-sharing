import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesCombined,
  Grid2X2,
  MessageSquareQuote,
  Milestone,
  Network,
  Presentation,
  Scale,
  SearchCheck,
  Workflow,
} from "lucide-react";

export type Tone = "ink" | "teal" | "cobalt" | "amber" | "coral" | "violet";

export type SlideLayout =
  | "backup"
  | "cover"
  | "diagram"
  | "cards"
  | "takeaways";

export type SlideVisual =
  | { kind: "triptych" }
  | { kind: "latent-geometry" }
  | { kind: "matrix-graph" }
  | { kind: "code-gap" }
  | { kind: "contribution-stack" }
  | { kind: "related-map" }
  | { kind: "semantic-pipeline" }
  | { kind: "output-columns" }
  | { kind: "equation-to-visualization" }
  | { kind: "question-map" }
  | { kind: "roadmap" };

export type SlidePoint = {
  label?: string;
  title: string;
  body: string;
  code?: string;
  bullets?: string[];
  emphasis?: boolean;
  links?: {
    label: string;
    href: string;
  }[];
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
  bodyHighlights?: string[];
  bullets?: string[];
  layout: SlideLayout;
  visual?: SlideVisual;
  presenterMove: string;
  icon: LucideIcon;
  tone: Tone;
  slots: string[];
  notes: string[];
  points?: SlidePoint[];
};

export const slideTemplates: SlideTemplate[] = [
  {
    id: "title",
    section: "Setup",
    title: "From QEC Equations to Inspectable Code Geometry",
    shortTitle: "Title",
    body: "QEC codes protect quantum information in quantum computers, but the figures needed to understand and communicate modern codes are often manually produced from compact mathematical definitions.",
    layout: "cover",
    presenterMove:
      "Set expectations: this is not a quantum computing tutorial. It is the motivation for a visualization tool around QEC code figures.",
    icon: Presentation,
    tone: "ink",
    slots: [
      "Project title",
      "QEC codes protect quantum information",
      "Modern code figures are often manually produced from equations and matrices",
      "Proposed tool for paper authors and QEC engineers",
    ],
    notes: [
      "QEC codes protect quantum information from noise and errors.",
      "Many modern QEC codes are specified through equations and matrices.",
      "Useful code figures are often manually crafted and require expert geometric intuition.",
      "The project goal is a tool that helps paper authors and QEC engineers turn code definitions into trustworthy, editable figures.",
    ],
    points: [
      {
        label: "Domain",
        title: "QEC codes protect quantum information",
        body: "They are a core mechanism for quantum error correction in quantum computers.",
      },
      {
        label: "Pain point",
        title: "Figures are manually crafted",
        body: "Modern QEC codes can be defined through equations and matrices, but useful figures often take substantial manual effort.",
      },
      {
        label: "Proposal",
        title: "A tool for paper authors and engineers",
        body: "Help users draw trustworthy QEC code figures for publication and future code-inspection workflows.",
      },
    ],
  },
  {
    id: "formal-definitions",
    section: "Background",
    title: "From Formal Specification To Inspectable Geometry",
    shortTitle: "Process",
    body: "A useful workflow cannot jump directly from formula to picture. It needs expanded code structure, validation, provenance, alternatives, and expert correction.",
    layout: "cover",
    visual: { kind: "triptych" },
    presenterMove:
      "Explain the transformation the tool must support after the audience understands why the project exists.",
    icon: SearchCheck,
    tone: "teal",
    slots: [
      "Formal specification",
      "Expanded code structure",
      "Inspectable geometry",
      "Complex geometry plus trust-preserving transformation",
    ],
    notes: [
      "The workflow starts from a formal specification, expands the code structure, then produces inspectable geometry.",
      "The hard part is both drawing complex geometry and preserving what each visual mark means.",
      "The figure should keep links back to equations, matrices, construction rules, and validation checks.",
      "The system should expose alternatives and let experts correct the result.",
    ],
    points: [
      {
        label: "Hard part 1",
        title: "Generate complex geometry",
        body: "Modern QEC figures may involve topology, long-range edges, code blocks, and multiple valid embeddings.",
      },
      {
        label: "Hard part 2",
        title: "Preserve trust",
        body: "Every mark should remain linked to equations, matrices, construction rules, and validation checks.",
      },
      {
        label: "Interaction",
        title: "Support expert correction",
        body: "The system should expose alternatives, provenance, and editable structure rather than returning a single opaque drawing.",
      },
    ],
  },
  {
    id: "minimal-qec",
    section: "Background",
    title: "What Is Being Visualized?",
    shortTitle: "Visual Object",
    headline:
      "The formal input is a graph matrix that defines connections between checks and qubits.",
    body: "This gives us semantic graph support. A graph shows connectivity, but the VIS/HCI problem is turning that support into inspectable geometry, such as a cycle or surface, without losing meaning.",
    bodyHighlights: ["connectivity", "geometry"],
    bullets: [
      "Rows are checks or constraints.",
      "Columns are physical qubits.",
      "A matrix entry of 1 means this check is connected to this qubit.",
    ],
    layout: "diagram",
    visual: { kind: "matrix-graph" },
    presenterMove:
      "Translate the QEC object into visualization vocabulary: entities, relationships, and semantic structure.",
    icon: Grid2X2,
    tone: "cobalt",
    slots: [
      "QEC equations define structured objects",
      "Rows, columns, and connection entries",
      "Semantic graph support is not yet inspectable geometry",
    ],
    notes: [
      "The formal input can be read as a graph matrix connecting checks and physical qubits.",
      "Rows are checks or constraints; columns are physical qubits.",
      "A matrix entry of 1 means that check touches that qubit.",
      "This gives connectivity, but the visualization challenge is turning connectivity into geometry such as a cycle or surface.",
    ],
    points: [
      {
        label: "Rows",
        title: "Checks or constraints",
        body: "Each row is a constraint that valid encoded states must satisfy.",
      },
      {
        label: "Columns",
        title: "Physical qubits",
        body: "Each column is one physical qubit participating in some checks.",
      },
      {
        label: "Entries",
        title: "Connection structure",
        body: "`1` means the check is connected to that qubit. This creates graph support that can be embedded geometrically.",
      },
    ],
  },
  {
    id: "qldpc-gap",
    section: "Problem",
    title: "Modern QEC Codes Can Have Nontrivial Geometry",
    shortTitle: "Geometry",
    subtitle:
      "Examples include flat patches, periodic or toric views, and cylindrical or twisted boundary structures.",
    headline:
      "QEC code figures are not one generic graph drawing problem. Different codes and topologies need different figures.",
    layout: "diagram",
    visual: { kind: "code-gap" },
    presenterMove:
      "Use concrete geometry examples to show why the problem quickly becomes a visualization problem.",
    icon: Network,
    tone: "amber",
    slots: [
      "Flat patch geometry",
      "Periodic or toric geometry",
      "Cylindrical and Mobius geometry",
    ],
    notes: [
      "QEC code geometries can be flat, periodic, toric, cylindrical, or twisted.",
      "A useful figure depends on the code family and topology.",
      "The same periodic structure can be shown as a lattice, a torus, or a code drawn on a torus.",
      "This is why the problem is not just generic graph drawing.",
    ],
    points: [
      {
        label: "Flat patch",
        title: "Surface-code patch",
        body: "A planar local layout is directly visible.",
      },
      {
        label: "Periodic",
        title: "Toric geometry",
        body: "A lattice, torus, and code-on-torus figure can be different views of one periodic structure.",
      },
      {
        label: "Cylinder",
        title: "Cylindrical and Mobius codes",
        body: "Glued or twisted boundaries create additional geometry that the figure must make visible.",
      },
    ],
  },
  {
    id: "problem-classification",
    section: "Problem",
    title: "Problem",
    shortTitle: "Problem",
    layout: "cards",
    presenterMove:
      "Classify the problem before moving into the proposed method: what already exists, what is newly difficult, and what technique we bring in.",
    icon: Scale,
    tone: "coral",
    slots: [
      "Existing problem: drawing QEC codes",
      "New challenge: complex modern geometries",
      "New techniques: AI-assisted paper and equation interpretation",
    ],
    notes: [
      "Drawing QEC code figures is already an existing problem for paper authors and engineers.",
      "Modern QEC codes make the problem harder because their geometries can be nontrivial.",
      "The technique we propose is to use AI agents to understand papers, equations, and implied geometry before drawing.",
      "This frames the project as a visualization and HCI problem, not only a quantum computing implementation task.",
    ],
    points: [
      {
        label: "Existing problem",
        title: "Drawing QEC codes is already a problem",
        body: "QEC researchers already need figures to communicate code structure, but many useful figures are manually produced from formal definitions.",
      },
      {
        label: "New challenge",
        title: "Modern QEC codes have complex geometries",
        body: "Recent codes may involve periodic, toric, cylindrical, twisted, or long-range structures that are hard to infer from equations alone.",
      },
      {
        label: "New techniques",
        title: "AI agents interpret papers and equations",
        body: "We use AI agents to understand papers, their equations, and implied geometries, then draw editable figures with provenance.",
      },
    ],
  },
  {
    id: "method",
    section: "Method",
    title: "Method: From Formal Specification To Inspectable Figure",
    shortTitle: "Method",
    layout: "diagram",
    visual: { kind: "semantic-pipeline" },
    presenterMove:
      "Clarify that PDF parsing is not the main contribution. The main contribution is semantic translation and validation.",
    icon: Workflow,
    tone: "cobalt",
    slots: [
      "PDF / LaTeX -> Clean Spec",
      "Semantic code model",
      "Expanded code structure",
      "Validation",
      "Geometry alternatives",
      "Editable figure",
    ],
    notes: [
      "Input can be a PDF, LaTeX source, or clean spec; the first step is to extract a confirmable code definition.",
      "The system builds a semantic code model before drawing anything.",
      "The model is expanded into matrices, connections, and generated objects.",
      "Validation is a gate before visual output.",
      "The final output should offer geometry alternatives and editable figures with provenance.",
    ],
    points: [
      {
        label: "Deterministic core",
        title: "Construction and validation",
        body: "Matrix expansion, support extraction, and checks should be reproducible.",
      },
      {
        label: "AI assistance",
        title: "Parsing and layout hints",
        body: "AI can help interpret paper equations and suggest layouts when ambiguity is natural.",
      },
      {
        label: "Output",
        title: "Editable and inspectable",
        body: "SVG, TikZ, or Figma outputs should preserve semantic links to the source.",
      },
    ],
  },
  {
    id: "contributions",
    section: "Contributions",
    title: "Proposed Contributions",
    shortTitle: "Contributions",
    headline:
      "A semantic authoring workflow with AI agents for inspectable, validated QEC code geometry.",
    layout: "diagram",
    visual: { kind: "contribution-stack" },
    presenterMove:
      "Make the VIS/HCI contribution explicit: semantics, provenance, ambiguity, and expert correction.",
    icon: Milestone,
    tone: "violet",
    slots: [
      "Taxonomy",
      "Semantic intermediate representation",
      "Validated generation workflow",
      "Interaction design",
    ],
    notes: [
      "Contribution 1 is a taxonomy of QEC code inputs and figure outputs.",
      "Contribution 2 is a semantic representation linking equations, matrices, objects, and visual marks.",
      "Contribution 3 is a validated workflow that separates deterministic construction from visual choices.",
      "Contribution 4 is interaction support for ambiguity, alternatives, provenance, and expert correction.",
    ],
    points: [
      {
        label: "01",
        title: "Taxonomy",
        body: "Classify QEC code inputs and figure outputs for the first corpus.",
      },
      {
        label: "02",
        title: "Semantic Representation",
        body: "Link equations, matrices, stabilizers, graph supports, and visual marks.",
      },
      {
        label: "03",
        title: "Validated Workflow",
        body: "Generate figures only after deterministic expansion and mathematical checks.",
      },
      {
        label: "04",
        title: "Expert Interaction",
        body: "Support ambiguity, provenance, alternative embeddings, and expert correction.",
      },
    ],
  },
  {
    id: "expected-results",
    section: "Outputs",
    title: "Expected Research Outputs",
    shortTitle: "Outputs",
    layout: "diagram",
    visual: { kind: "output-columns" },
    presenterMove:
      "Make the deliverables concrete enough for the group to critique scope.",
    icon: ChartNoAxesCombined,
    tone: "coral",
    slots: [
      "Corpus",
      "BB-code prototype",
      "Validation checks",
      "Editable outputs",
      "Expert study",
    ],
    notes: [
      "Collect a small corpus of formula-figure pairs from recent QEC papers.",
      "Build a first prototype around one code family.",
      "Implement correctness checks that preserve formal connections and visual provenance.",
      "Export editable figures for paper writing and revision.",
      "Evaluate with QEC experts on correctness, trust, editability, and geometric intuition.",
    ],
    points: [
      {
        label: "Corpus",
        title: "Formula-Figure Pairs",
        body: "Collect examples from recent QEC papers where equations and figures appear together.",
      },
      {
        label: "Prototype",
        title: "Focused First Prototype",
        body: "Start with one code family and turn its formula into a matrix, a graph, and a draft figure.",
      },
      {
        label: "Validation",
        title: "Correctness Checks",
        body: "Check that the generated figure keeps the same connections as the formal input, and record where each visual mark comes from.",
      },
      {
        label: "Export",
        title: "Editable Figures",
        body: "Provide editable files for paper writing and figure revision.",
      },
      {
        label: "Study",
        title: "QEC Expert Feedback",
        body: "Ask QEC experts:",
        bullets: [
          "Correctness",
          "Trustworthy",
          "Easy to edit",
          "Useful for building geometric intuition",
        ],
      },
    ],
  },
  {
    id: "discussion",
    section: "Discussion",
    title: "Questions/Suggestions/Thoughts?",
    shortTitle: "Questions",
    headline: "Any related work in mind? Like equation to visualizations?",
    layout: "takeaways",
    visual: { kind: "equation-to-visualization" },
    presenterMove:
      "Invite the research group to suggest related work and sharpen the HCI framing.",
    icon: MessageSquareQuote,
    tone: "violet",
    slots: ["Related work suggestions"],
    notes: [
      "Ask the group for related VIS/HCI work on equation-to-visualization translation.",
      "Ask whether this framing should be closer to visual authoring, scientific diagrams, provenance, or graph layout.",
      "Collect suggestions for examples, datasets, and evaluation criteria.",
    ],
  },
  {
    id: "related-qec-tools",
    section: "Related Work",
    title: "Related Work: QEC Visualization And Tooling",
    shortTitle: "QEC Tools",
    subtitle:
      "Existing tools show that QEC users already benefit from visual support.",
    headline:
      "Gap: current tools usually assume the code family or workflow is already known.",
    layout: "cards",
    presenterMove:
      "Position existing QEC tools as useful references, but not as solutions for authoring new code-geometry figures from equations.",
    icon: Scale,
    tone: "teal",
    slots: [
      "Existing QEC tools",
      "Useful visual vocabulary",
      "Gap for equation-to-figure authoring",
    ],
    notes: [
      "Existing QEC tools show that visual support is already valuable for this community.",
      "They provide useful visual vocabulary for checks, qubits, errors, boundaries, circuits, and decoding traces.",
      "Most tools assume the code family or workflow is already known.",
      "The gap is authoring new code-geometry figures from formal definitions with editable provenance.",
    ],
    points: [
      {
        label: "Direction",
        title: "Existing QEC Tools",
        body: "Existing QEC tools visualize known workflows and provide domain examples for checks, circuits, decoders, and code structure.",
        links: [
          {
            label: "Stim",
            href: "https://quantum-journal.org/papers/q-2021-07-06-497/",
          },
          {
            label: "Crumble",
            href: "https://github.com/quantumlib/Stim/blob/main/glue/crumble/README.md",
          },
          {
            label: "PanQEC",
            href: "https://panqec.readthedocs.io/",
          },
          {
            label: "qecsim",
            href: "https://qecsim.github.io/",
          },
          {
            label: "PyMatching",
            href: "https://pymatching.readthedocs.io/",
          },
          {
            label: "Loom/Entwine",
            href: "https://loom-docs.entropicalabs.com/",
          },
          {
            label: "Product Codes",
            href: "https://arxiv.org/abs/2507.11577",
          },
          {
            label: "GraphStateVis",
            href: "https://arxiv.org/abs/2105.12752",
          },
        ],
      },
      {
        label: "Useful Piece",
        title: "Domain Visual Vocabulary",
        body: "They show visual conventions for checks, qubits, errors, boundaries, circuits, and decoding traces.",
      },
      {
        label: "Gap",
        title: "New Code Figure Authoring",
        body: "They rarely start from a new paper's formal code definition and produce editable publication figures with provenance.",
        emphasis: true,
      },
    ],
  },
  {
    id: "related-equation-diagrams",
    section: "Related Work",
    title: "Related Work: Mathematical Notation To Diagrams",
    shortTitle: "Equation Diagrams",
    subtitle:
      "Notation-to-diagram systems show how formal descriptions can drive visual construction.",
    headline:
      "Gap: general equation-to-diagram systems do not know QEC code semantics or correctness checks.",
    layout: "cards",
    presenterMove:
      "Connect the project to equation-driven diagramming while clarifying why QEC-specific semantics matter.",
    icon: Scale,
    tone: "cobalt",
    slots: [
      "Formal notation as input",
      "Constraint-based diagram generation",
      "QEC-specific semantic gap",
    ],
    notes: [
      "Notation-to-diagram systems show that formal descriptions can drive visual construction.",
      "Penrose is a useful example of separating mathematical meaning from visual style.",
      "This project needs QEC-specific semantics: checks, qubits, code families, geometry choices, and validation.",
      "The gap is domain-aware equation-to-figure generation, not just general diagram generation.",
    ],
    points: [
      {
        label: "Direction",
        title: "Formal Notation To Diagram",
        body: "Notation-driven diagram systems show that formal descriptions can become visual structure.",
        links: [
          {
            label: "Penrose",
            href: "https://penrose.cs.cmu.edu/siggraph20",
          },
          {
            label: "IBM Equation Visualization",
            href: "https://research.ibm.com/publications/visualization-of-equations-in-an-interactive-environment",
          },
        ],
      },
      {
        label: "Useful Piece",
        title: "Declarative Visual Construction",
        body: "They suggest a workflow where users specify meaning first, then generate or edit diagrams from that meaning.",
      },
      {
        label: "Gap",
        title: "QEC-Specific Semantics",
        body: "They do not directly model checks, qubits, code families, geometry choices, or QEC correctness tests.",
        emphasis: true,
      },
    ],
  },
  {
    id: "related-semantic-authoring",
    section: "Related Work",
    title: "Related Work: Semantic Visual Authoring And Provenance",
    shortTitle: "Authoring",
    subtitle:
      "Visual authoring systems show how editable figures can preserve links to underlying meaning.",
    headline:
      "Gap: existing authoring systems rarely handle algebraic scientific objects whose geometry must be validated.",
    layout: "cards",
    presenterMove:
      "Frame this direction as the HCI backbone: users need editable figures, provenance, alternatives, and expert correction.",
    icon: Scale,
    tone: "violet",
    slots: [
      "Semantic visual authoring",
      "Provenance and editability",
      "Validated scientific objects",
    ],
    notes: [
      "Semantic visual authoring systems show how visual marks can stay linked to underlying structure.",
      "Data Illustrator and Sketch-n-Sketch are useful references for editable, meaning-linked graphics.",
      "Our figures must preserve provenance from equations through generated code objects to final visual marks.",
      "The gap is validated scientific meaning before and during visual editing.",
    ],
    points: [
      {
        label: "Direction",
        title: "Semantic Visual Authoring",
        body: "Systems such as Data Illustrator and Sketch-n-Sketch connect visual edits with underlying structure.",
        links: [
          {
            label: "Data Illustrator",
            href: "https://data-illustrator.cs.umd.edu/",
          },
          {
            label: "Data Illustrator Paper",
            href: "https://dl.acm.org/doi/10.1145/3173574.3173697",
          },
          {
            label: "Sketch-n-Sketch",
            href: "https://ravichugh.github.io/sketch-n-sketch/",
          },
          {
            label: "Sketch-n-Sketch Paper",
            href: "https://arxiv.org/abs/1907.10699",
          },
        ],
      },
      {
        label: "Useful Piece",
        title: "Editable Marks With Provenance",
        body: "They show how users can manipulate visual output while keeping links to the source representation.",
      },
      {
        label: "Gap",
        title: "Validated Scientific Meaning",
        body: "They usually do not construct and validate a scientific object before drawing it, which is central for QEC figures.",
        emphasis: true,
      },
    ],
  },
  {
    id: "related-graph-layout",
    section: "Related Work",
    title: "Related Work: Graph And Sparse Matrix Layout",
    shortTitle: "Graph Layout",
    subtitle:
      "Graph and matrix layout methods help turn connections into readable visual structure.",
    headline:
      "Gap: readable graph layout is not the same as an interpretable QEC code geometry.",
    layout: "cards",
    presenterMove:
      "Use this slide to separate generic graph drawing from QEC code geometry, which may include topology, symmetry, and multiple valid embeddings.",
    icon: Scale,
    tone: "amber",
    slots: [
      "Graph drawing",
      "Sparse matrix visualization",
      "Geometry-aware QEC layout",
    ],
    notes: [
      "Graph drawing and sparse matrix visualization help reveal connectivity, clusters, and repeated patterns.",
      "These methods can help with graph support and large matrices.",
      "QEC figures also need topology, symmetry, code-family conventions, and multiple valid embeddings.",
      "The gap is code geometry, not only readable layout.",
    ],
    points: [
      {
        label: "Direction",
        title: "Graph And Matrix Layout",
        body: "Graph drawing and sparse matrix visualization can expose connectivity, clusters, and repeated patterns.",
        links: [
          {
            label: "Graph Drawing Handbook",
            href: "https://cs.brown.edu/people/rtamassi/gdhandbook/",
          },
          {
            label: "Matrix Reordering Survey",
            href: "https://inria.hal.science/hal-01326759",
          },
          {
            label: "SuiteSparse Matrix Collection",
            href: "https://sparse.tamu.edu/",
          },
          {
            label: "SuiteSparse Interface Paper",
            href: "https://joss.theoj.org/papers/10.21105/joss.01244",
          },
        ],
      },
      {
        label: "Useful Piece",
        title: "Readable Structure From Connections",
        body: "They provide layout strategies for making large connection structures easier to scan.",
      },
      {
        label: "Gap",
        title: "Code Geometry, Not Just Layout",
        body: "QEC figures may need topology, symmetry, code-family conventions, and alternative valid embeddings, not only a readable graph.",
        emphasis: true,
      },
    ],
  },
  {
    id: "backup-clean-spec-example",
    section: "Backup",
    title: "Backup: Example Clean Spec",
    shortTitle: "Clean Spec",
    subtitle: "What Step 1 should produce from a PDF or LaTeX source.",
    headline:
      "A clean spec is a small, explicit record that an expert can confirm before construction starts.",
    body: "It is not the paper itself and not yet a full internal model. It is the bridge from source text to a structured, checkable input.",
    layout: "backup",
    presenterMove:
      "Use this only if someone asks what Step 1 outputs. Emphasize that the schema starts family-specific and can grow with the corpus.",
    icon: SearchCheck,
    tone: "cobalt",
    slots: [
      "Source equations",
      "Machine-readable candidate spec",
      "Provenance and uncertainty",
    ],
    notes: [
      "A clean spec is the bridge from paper text to a structured, checkable input.",
      "It records parameters, constructors, equations, and matrix definitions in a compact form.",
      "It should include provenance for each field.",
      "Uncertainty should be explicit so an expert can confirm or edit it before construction.",
    ],
    points: [
      {
        label: "Example",
        title: "Candidate clean spec",
        body: "A compact, editable input extracted from paper equations and nearby explanatory text.",
        code: `family: bivariate_bicycle_like
params: { l: 6, m: 6 }
x: kron(S_l, I_m)
y: kron(I_l, S_m)
A: x + y^0 + y^2
B: y + x^0 + x^2
H_X: [A | B]
H_Z: [B^T | A^T]`,
      },
      {
        label: "Trust",
        title: "Keep provenance and uncertainty",
        body: "The system should say where each field came from and what still needs expert confirmation.",
        code: `provenance:
  A: paper Eq. 2
  B: paper Eq. 2
  H_X: paper Eq. 3
uncertainty:
  - confirm whether x^0 and y^0 mean identity
  - confirm boundary conventions before layout`,
      },
    ],
  },
  {
    id: "backup-code-object-example",
    section: "Backup",
    title: "Backup: What Is A Code Object?",
    shortTitle: "Code Object",
    subtitle:
      "Step 2 turns a clean spec into semantic objects the tool can reason about.",
    headline:
      "A code object is a named semantic entity, relation, or assumption from the QEC definition.",
    body: "These objects are not visual marks yet. They are the meaning that later visual marks must represent.",
    layout: "backup",
    presenterMove:
      "Use this if the audience asks what the semantic code model contains.",
    icon: Grid2X2,
    tone: "teal",
    slots: ["Checks", "Physical qubits", "Operators and terms", "Relations"],
    notes: [
      "A code object is a semantic entity or relation extracted from the definition.",
      "Examples include checks, qubit blocks, polynomial terms, matrices, and check-qubit connections.",
      "These objects are not visual marks yet.",
      "They provide the meaning that visual marks must preserve.",
    ],
    points: [
      {
        label: "Meaning",
        title: "Objects the system can reference",
        body: "The interpreter identifies checks, qubit blocks, polynomial terms, matrices, and relations.",
        code: `objects:
  X_checks: rows(H_X)
  Z_checks: rows(H_Z)
  left_qubits: columns(A)
  right_qubits: columns(B)
  A_terms: [x, y^0, y^2]
  B_terms: [y, x^0, x^2]`,
      },
      {
        label: "Relation",
        title: "A matrix entry becomes a connection",
        body: "The semantic model records relationships before choosing a geometry or a drawing style.",
        code: `relation:
  type: check_qubit_connection
  source: H_X[row_i, column_j] = 1
  check: X_check_i
  qubit: physical_qubit_j
  provenance: generated from A_term_3`,
      },
    ],
  },
  {
    id: "backup-constructor-example",
    section: "Backup",
    title: "Backup: What Is A Constructor?",
    shortTitle: "Constructor",
    subtitle: "Step 3 expands compact recipes into concrete code structure.",
    headline:
      "A constructor is a compact rule that generates many concrete matrix entries or connections.",
    body: "This is why a short equation can define a much larger object than it visually suggests.",
    layout: "backup",
    presenterMove:
      "Use this if someone asks what Step 3 means by expanding constructors.",
    icon: Workflow,
    tone: "amber",
    slots: ["Compact recipe", "Concrete matrix", "Connection structure"],
    notes: [
      "A constructor is a compact rule that generates many concrete matrix entries or connections.",
      "Cyclic shifts, products, lifts, and polynomial terms are examples of constructors.",
      "Expanding constructors turns short equations into concrete matrices and graph support.",
      "This step makes hidden scale and repeated structure explicit.",
    ],
    points: [
      {
        label: "Recipe",
        title: "Cyclic shift constructor",
        body: "One symbol can stand for a full permutation matrix.",
        code: `constructor: cyclic_shift
input:
  n: 6
  offset: 1
rule:
  S[i, (i + offset) mod n] = 1
output:
  matrix_shape: 6 x 6`,
      },
      {
        label: "Use",
        title: "Polynomial terms call constructors",
        body: "A term such as y^2 expands to a concrete matrix block before graph or geometry generation.",
        code: `term: y^2
definition:
  y = kron(identity(l), cyclic_shift(m))
expanded_as:
  kron(identity(l), cyclic_shift(m)^2)
generated:
  matrix block used inside A`,
      },
    ],
  },
  {
    id: "backup-generated-objects-example",
    section: "Backup",
    title: "Backup: What Are Generated Objects?",
    shortTitle: "Generated Objects",
    subtitle:
      "Generated objects are concrete items created from the compact spec during expansion, validation, and drawing.",
    headline:
      "Every generated object should carry a semantic source so the final figure remains inspectable.",
    body: "This is the provenance chain from equation term to matrix entry, graph connection, and visual mark.",
    layout: "backup",
    presenterMove:
      "Use this if someone asks what provenance means in the generated figure.",
    icon: Network,
    tone: "violet",
    slots: [
      "Matrix entries",
      "Connections",
      "Candidate visual marks",
      "Provenance chain",
    ],
    notes: [
      "Generated objects are concrete artifacts created during expansion, validation, and drawing.",
      "Each generated object should carry a source link.",
      "The provenance chain can connect an equation term to a matrix entry, graph edge, and visual mark.",
      "This supports inspection, validation, and expert correction.",
    ],
    points: [
      {
        label: "Chain",
        title: "From equation term to edge",
        body: "A visual edge should be traceable to a connection, a matrix entry, and the original construction term.",
        code: `matrix_entry:
  id: HX:r17:c42
  value: 1
  source: term A:y^2
connection:
  id: edge:X17-Q42
  source: HX:r17:c42`,
      },
      {
        label: "Figure",
        title: "Visual marks remain inspectable",
        body: "A drawn mark can be edited, but the tool should preserve what it represents.",
        code: `visual_mark:
  id: mark:e113
  type: edge
  represents: edge:X17-Q42
  layout_choice: toric_embedding_v2
  validation:
    connection_exists: true
    degree_check: passed`,
      },
    ],
  },
];

export const templatePrinciples = [
  "Foreground the VIS/HCI problem and minimize QC teaching.",
  "Treat figures as epistemic tools for experts, not only presentation polish.",
  "Separate mathematically determined structure from layout choices.",
  "Use deterministic validation before drawing and expose provenance after drawing.",
  "Keep syndrome circuits and hardware mapping out of scope for this first project.",
];

export const sectionOrder = [
  "Setup",
  "Background",
  "Problem",
  "Method",
  "Contributions",
  "Outputs",
  "Discussion",
  "Related Work",
  "Backup",
];
