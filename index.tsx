import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// --- Types & Interfaces ---

interface FormData {
  subject: string;
  yearGroup: string;
  unitTitle: string;
  duration: string;
  curriculumLink: string;

  // Section 1
  learningObjectives: string;

  // Section 2
  priorKnowledge: string;
  lessonSequence: string;
  futureLearning: string;

  // Section 3
  vocabulary: string;
  misconceptions: string;

  // Section 4
  formativeAssessment: string;
  summativeAssessment: string;

  // Section 5
  diffStruggling: string;
  diffCore: string;
  diffGifted: string;

  // Section 6 & 7
  interventions: string;
  extensionActivities: string;

  // Section 8
  resourcesPhysical: string;
  resourcesDigital: string;
  resourcesNoGo: string;

  // Section 9
  unitConnections: string;

  // Section 10
  goldenPromptConstraints: string;
}

interface LessonData {
  lessonNumber: string;
  lessonTitle: string;
  specificFocus: string;
  studentNeeds: string;
  structureOverride: string;
}

interface SlideData {
  audience: "students" | "teachers";
  length: "Short" | "Default" | "Long";
  visualStyle: string;
  additionalContext: string;
}

interface InfographicData {
  topic: string; // Defaults to unitTitle
  mainConcepts: string;
  concreteExamples: string;
  visualOrganizer: string;
  flowDirection: string;
  styleKeywords: string;
}

const INITIAL_STATE: FormData = {
  subject: "",
  yearGroup: "",
  unitTitle: "",
  duration: "",
  curriculumLink: "",
  learningObjectives: "",
  priorKnowledge: "",
  lessonSequence: "",
  futureLearning: "",
  vocabulary: "",
  misconceptions: "",
  formativeAssessment: "",
  summativeAssessment: "",
  diffStruggling: "",
  diffCore: "",
  diffGifted: "",
  interventions: "",
  extensionActivities: "",
  resourcesPhysical: "",
  resourcesDigital: "",
  resourcesNoGo: "",
  unitConnections: "",
  goldenPromptConstraints:
    "Use British English. Keep slides visual. Match the teaching approach (concrete-pictorial-abstract).",
};

const INITIAL_LESSON_STATE: LessonData = {
  lessonNumber: "1",
  lessonTitle: "",
  specificFocus: "Focus on introducing the concept using concrete materials.",
  studentNeeds: "Include 2 students with dyscalculia.",
  structureOverride: `- Slide 1: Title & Learning Objectives (Read aloud)
- Slide 2: Recap previous lesson
- Slide 3-4: Teacher Input (Concept explanation)
- Slide 5: Teacher Model (Worked example)
- Slide 6-7: Guided Practice (We do it together)
- Slide 8: Activity (Paired or group task)
- Slide 9: Independent Work (Students do it alone)
- Slide 10: Assessment (Quick check)`,
};

const INITIAL_SLIDE_STATE: SlideData = {
  audience: "students",
  length: "Default",
  visualStyle:
    "Large, clear fraction diagrams, number lines, pictures of concrete objects (sweets, pizza).",
  additionalContext: "Use British English. Ensure font size is large (20pt+).",
};

const INITIAL_INFOGRAPHIC_STATE: InfographicData = {
  topic: "",
  mainConcepts: "halves, thirds, quarters, eighths",
  concreteExamples: "pizza slices, sweets, counters",
  visualOrganizer: "Number lines from 0 to 1",
  flowDirection: "simple (halves) to more complex (eighths)",
  styleKeywords: "Bold, colorful illustrations, icons and visual symbols",
};

const FRACTIONS_EXAMPLE: FormData = {
  subject: "Mathematics",
  yearGroup: "Year 4",
  unitTitle: "Fractions: Visual & Conceptual",
  duration: "2 weeks (8 lessons)",
  curriculumLink: "KS2 Programme of Study - Number: Fractions",

  learningObjectives: `### Lesson Group 1 (Basics)
- **I can:** Identify the numerator and denominator.
- **I can:** Represent fractions using pizza slices.
- **Success Criteria:** Accurately labeling parts of a whole.

### Lesson Group 2 (Equivalence)
- **I can:** Use fraction walls to find equivalent fractions.
- **Success Criteria:** Explaining why 1/2 is same as 2/4.`,

  priorKnowledge:
    "- Students know what a 'whole' and a 'half' is.\n- Must be able to count confidently to 20.",

  lessonSequence: `**Lesson 1: The Pizza Party**
- Intro to numerator/denominator using real pizza boxes.

**Lesson 2: The Chocolate Bar**
- Using segments of chocolate to show non-unit fractions.

**Lesson 3: Fraction Wall Construction**
- Building a wall with Cuisenaire rods.`,

  futureLearning: "Decimals and percentages in Year 5.",

  vocabulary: `**Numerator:** The top number.
**Denominator:** The bottom number.
**Equivalent:** Worth the same amount.`,

  misconceptions: `| Misconception | What Students Do | Fix |
|---|---|---|
| Adding denominators | Adds 1/4 + 1/4 = 2/8 | Show physical pieces. |
| Bigger denominator = bigger number | Thinks 1/10 > 1/2 | Use the fraction wall. |`,

  formativeAssessment:
    "- Mini-whiteboard check: Draw 3/4.\n- Exit Ticket: Which is bigger, 1/3 or 1/2?",
  summativeAssessment:
    "**End of Unit Quiz**\n- Section A: Shade the shape\n- Section B: Match equivalents",

  diffStruggling:
    "- Focus on halves and quarters only.\n- Always use concrete counters.",
  diffCore: "- Full unit, exploring up to twelfths.",
  diffGifted: "- Explore 'improper fractions' visually.",

  interventions:
    "If confused by notation, just speak the words '1 part out of 4'.",
  extensionActivities:
    "Design a playground where 1/3 of the ground is grass, 1/4 is sand.",

  resourcesPhysical: "- Pizza boxes\n- Counters\n- Cuisenaire rods",
  resourcesDigital: "- Interactive fraction wall",
  resourcesNoGo: "- No abstract worksheets without diagrams.",

  unitConnections: "Links to Division (sharing sweets).",
  goldenPromptConstraints:
    "Use British English. Visual metaphors (pizza, sweets).",
};

// --- Icons ---

const Icons = {
  ChevronDown: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  Copy: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Sparkles: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  DocumentText: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Book: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  Chat: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  ),
  Presentation: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Image: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Alert: () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  Clock: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Shield: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  Robot: () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h.01M15 9h.01"
      />
    </svg>
  ),
  Pizza: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  Car: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  ),
  Brain: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  Skeleton: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h7"
      />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  Folder: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  LightBulb: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  Wrench: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  ArrowWide: () => (
    <svg
      className="w-full h-16 text-slate-300"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path d="M0 15 L75 15 L75 0 L100 20 L75 40 L75 25 L0 25 Z" />
    </svg>
  ),
  CursorClick: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};

// --- Components ---

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 font-sans">
      {/* Modal Popup */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            NotebookLM Prompter
          </h1>
          <p className="text-blue-100 text-sm mt-1 font-medium">
            Craft better prompts. Teach smarter.
          </p>
          <p className="text-blue-200/70 text-xs mt-2 max-w-xl mx-auto">
            NotebookLM is a core Google Workspace service for education users which ensures student and teacher data remains private and is not used to train AI models.
          </p>
        </div>

        {/* Thought Partner Message */}
        <div className="mx-4 mb-4 bg-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="bg-amber-400 rounded-full p-3 flex-shrink-0">
            <Icons.Brain />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">You Bring the Ideas</h3>
            <p className="text-slate-300 text-sm">
              NotebookLM is your thought partner and augmentor—it helps structure and write your planning, 
              but the creativity, insight, and professional judgment? That's all you.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-8 pb-8 pt-2">
          <button
            onClick={onEnter}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
          >
            Start Building Prompts
            <Icons.ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  isOpen,
  toggle,
  icon,
  children,
}: {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  icon?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`mb-4 border rounded-xl transition-all duration-300 ${
        isOpen
          ? "bg-white border-primary/30 shadow-md ring-1 ring-primary/10"
          : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
      }`}
    >
      <button
        onClick={toggle}
        className="w-full text-left px-5 py-4 flex justify-between items-center group focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            }`}
          >
            {icon || "#"}
          </div>
          <span
            className={`font-semibold text-base transition-colors ${
              isOpen
                ? "text-gray-900"
                : "text-gray-600 group-hover:text-gray-800"
            }`}
          >
            {title}
          </span>
        </div>
        <span
          className={`text-gray-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        >
          <Icons.ChevronDown />
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-6 pt-2 animate-fadeIn">{children}</div>
      )}
    </div>
  );
};

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  help,
}: any) => (
  <div className="mb-5 group">
    <div className="flex justify-between items-baseline mb-2">
      <label className="block text-sm font-semibold text-gray-700 group-focus-within:text-primary transition-colors">
        {label}
      </label>
    </div>
    <div className="relative">
      <textarea
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm leading-relaxed transition-all shadow-sm bg-gray-50/50 focus:bg-white resize-y font-mono"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
    {help && (
      <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
        <span className="text-primary font-bold">Tip:</span> {help}
      </p>
    )}
  </div>
);

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="mb-5 group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">
      {label}
    </label>
    <input
      type="text"
      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all shadow-sm bg-gray-50/50 focus:bg-white"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const Select = ({ label, value, onChange, options }: any) => (
  <div className="mb-5 group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 focus:bg-white text-sm appearance-none cursor-pointer shadow-sm transition-all"
        value={value}
        onChange={onChange}
      >
        <option value="">Select an option...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
        <Icons.ChevronDown />
      </div>
    </div>
  </div>
);

const Button = ({
  onClick,
  variant = "secondary",
  icon: Icon,
  children,
}: any) => {
  const baseClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95";
  const variants: any = {
    primary: "bg-primary text-white hover:bg-primaryHover shadow-primary/30",
    secondary:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    danger:
      "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",
  };

  return (
    <button onClick={onClick} className={`${baseClass} ${variants[variant]}`}>
      {Icon && <Icon />}
      {children}
    </button>
  );
};

// --- Main Application ---

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "unit" | "lesson" | "slides" | "infographic"
  >("unit");
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);
  const [lessonData, setLessonData] =
    useState<LessonData>(INITIAL_LESSON_STATE);
  const [slideData, setSlideData] = useState<SlideData>(INITIAL_SLIDE_STATE);
  const [infographicData, setInfographicData] = useState<InfographicData>(
    INITIAL_INFOGRAPHIC_STATE
  );
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const toggleSection = (idx: number) =>
    setOpenSection(openSection === idx ? null : idx);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLessonChange = (field: keyof LessonData, value: string) => {
    setLessonData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlideChange = (field: keyof SlideData, value: string) => {
    setSlideData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInfographicChange = (
    field: keyof InfographicData,
    value: string
  ) => {
    setInfographicData((prev) => ({ ...prev, [field]: value }));
  };

  const loadExample = () => {
    if (confirm("This will overwrite your current inputs. Load example?")) {
      setFormData(FRACTIONS_EXAMPLE);
      setLessonData((prev) => ({
        ...prev,
        lessonNumber: "5",
        lessonTitle: "Equivalent Fractions",
        specificFocus: "Focus on equivalent fractions, use only 1/2, 2/4, 3/6",
      }));
      setSlideData(INITIAL_SLIDE_STATE);
      setInfographicData({
        topic: "Fractions",
        mainConcepts: "halves, thirds, quarters, eighths",
        concreteExamples: "pizza slices, sweets, counters",
        visualOrganizer: "Number lines from 0 to 1",
        flowDirection: "simple (halves) to more complex (eighths)",
        styleKeywords: "Bold, colorful illustrations, icons and visual symbols",
      });
      setOpenSection(0);
    }
  };

  const clearForm = () => {
    if (confirm("Clear all fields?")) {
      setFormData(INITIAL_STATE);
      setLessonData(INITIAL_LESSON_STATE);
      setSlideData(INITIAL_SLIDE_STATE);
      setInfographicData(INITIAL_INFOGRAPHIC_STATE);
    }
  };

  const handleCopy = () => {
    let textToCopy = "";
    if (activeTab === "unit") textToCopy = generateUnitPlan();
    else if (activeTab === "lesson") textToCopy = generateLessonPrompt();
    else if (activeTab === "slides") textToCopy = generateSlidePrompt();
    else textToCopy = generateInfographicPrompt();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateUnitPlan = () => {
    const {
      subject,
      yearGroup,
      unitTitle,
      duration,
      curriculumLink,
      learningObjectives,
      priorKnowledge,
      lessonSequence,
      futureLearning,
      vocabulary,
      misconceptions,
      formativeAssessment,
      summativeAssessment,
      diffStruggling,
      diffCore,
      diffGifted,
      interventions,
      extensionActivities,
      resourcesPhysical,
      resourcesDigital,
      resourcesNoGo,
      unitConnections,
      goldenPromptConstraints,
    } = formData;

    return `# NotebookLM Unit Plan: ${unitTitle || "Untitled Unit"}
## ${yearGroup} ${subject}
**Subject:** ${subject}
**Year Group:** ${yearGroup}
**Unit Duration:** ${duration}
**Curriculum Link:** ${curriculumLink}

---

## 1. CRYSTAL-CLEAR LEARNING OBJECTIVES
${learningObjectives}

---

## 2. THE PROGRESSION (Explicit Lesson Order)

### What Students Already Know (Foundation)
${priorKnowledge}

### The Lesson Sequence
${lessonSequence}

### Future Learning (What's Next)
${futureLearning}

---

## 3. CORE CONCEPTS & NON-NEGOTIABLES

### Essential Vocabulary
${vocabulary}

### Common Misconceptions
${misconceptions}

---

## 4. ASSESSMENT STRATEGY

### Formative Assessment
${formativeAssessment}

### Summative Assessment
${summativeAssessment}

---

## 5. DIFFERENTIATION PATHWAYS

### For Students Struggling
${diffStruggling}

### For Students at Expected Level
${diffCore}

### For Gifted/Extension Students
${diffGifted}

---

## 6. HOW YOU'LL HELP STUDENTS WHO ARE STRUGGLING
${interventions}

---

## 7. HOW YOU'LL CHALLENGE ADVANCED STUDENTS
${extensionActivities}

---

## 8. RESOURCES & EQUIPMENT

### Physical Manipulatives
${resourcesPhysical}

### Digital Resources
${resourcesDigital}

### NOT Available (Don't Use)
${resourcesNoGo}

---

## 9. UNIT CONNECTIONS
${unitConnections}

---

## 10. THE GOLDEN PROMPT (Copy-Paste into NotebookLM)

When you upload this unit plan to NotebookLM and want to generate a lesson, use this prompt:

\`\`\`
Act as a ${yearGroup || "[Year Group]"} teacher delivering the ${
      unitTitle || "[Unit Title]"
    } unit to mixed-ability learners.

Using ONLY the source materials provided, create a 45-minute lesson following this structure:
- Slide 1: Title & Learning Objectives
- Slide 2: Recap previous lesson
- Slide 3-4: Teacher Input (Concept explanation)
- Slide 5: Teacher Model (Worked example)
- Slide 6-7: Guided Practice
- Slide 8: Activity
- Slide 9: Independent Work
- Slide 10: Assessment

Constraints:
- Use ONLY vocabulary from Section 3.
- Use ONLY resources from Section 8.
- Address common misconceptions from Section 3.
- ${goldenPromptConstraints}
\`\`\`
`;
  };

  const generateLessonPrompt = () => {
    const { yearGroup, unitTitle } = formData;
    const {
      lessonNumber,
      lessonTitle,
      specificFocus,
      studentNeeds,
      structureOverride,
    } = lessonData;

    return `Act as a ${yearGroup || "Year X"} teacher delivering the ${
      unitTitle || "Unit"
    } unit to mixed-ability learners
(${
      studentNeeds || "including specific needs"
    }). Using ONLY the source materials provided,
create a 45-minute lesson following this structure:

${structureOverride}

Constraints:
- Use ONLY the vocabulary listed in Section 3
- Every example must use the concrete materials available from Section 8
- Address the common misconceptions listed in Section 3
- Include a differentiation note: What struggling students do; what advanced students do
- No iPads or apps (unless approved in Section 8)
- Keep slides visual, not text-heavy
- Use British English

For Lesson ${lessonNumber} ${lessonTitle ? `(${lessonTitle})` : ""}:
${specificFocus}

Do not invent learning objectives. Do not suggest resources we don't have. Match the teaching approach in the unit plan (concrete-pictorial-abstract).`;
  };

  const generateSlidePrompt = () => {
    const { subject, yearGroup, unitTitle } = formData;
    const { audience, length, visualStyle, additionalContext } = slideData;

    let description = "";

    if (audience === "students") {
      description = `Create presenter slides for ${
        yearGroup || "[Year Group]"
      } ${subject || "[Subject]"} lesson: ${unitTitle || "[Title]"}.
  
STUDENT VIEW (what appears on projector):
- Minimal text: 1-2 key points per slide only
- Large, clear visuals: ${
        visualStyle || "diagrams, number lines, concrete objects"
      }
- Learning objectives displayed at start
- Simple language
- NO text-heavy explanations (students watch you teach, not read slides)
  
TEACHER VIEW (speaker notes hidden from students):
- Detailed explanations for teacher to say
- Questions to ask students
- Misconceptions to address
- When to use concrete materials
- Differentiation reminders
- Timing guidance
  
Students see ONLY clean slides. All teaching detail hidden in speaker notes.
${additionalContext ? `\nAdditional Requirements:\n${additionalContext}` : ""}`;
    } else {
      description = `Create detailed slides for ${
        yearGroup || "[Year Group]"
      } ${subject || "[Subject]"} lesson: ${
        unitTitle || "[Title]"
      } (DETAILED DECK, not Presenter Slides).
  
SLIDES (what teachers see):
- Full text explanations on each slide
- Learning objectives, misconceptions, differentiation notes visible
- Assessment criteria included
- Everything self-contained
- Teacher can read and teach immediately without hidden notes
  
${additionalContext ? `Additional Requirements:\n${additionalContext}` : ""}`;
    }

    return `Format: ${
      audience === "students" ? "Presenter Slides" : "Detailed Deck"
    }
Length: ${length}

Description:
${description}`;
  };

  const generateInfographicPrompt = () => {
    const { yearGroup, unitTitle } = formData;
    const {
      topic,
      mainConcepts,
      concreteExamples,
      visualOrganizer,
      flowDirection,
      styleKeywords,
    } = infographicData;

    const topicStr = topic || unitTitle || "[TOPIC]";
    const yearStr = yearGroup || "[Year Group]";

    return `Create a one-page infographic about ${topicStr} for ${yearStr} students.

DESIGN:
- Single visual page (not multiple slides)
- ${styleKeywords}
- Key diagrams showing: ${mainConcepts}
- Real-world examples: ${concreteExamples}
- ${visualOrganizer}
- Key vocabulary in large, clear text
- Icons and visual symbols to show concepts
- Flow from ${flowDirection}
- British English labels

PURPOSE: 
A poster-sized visual reference that students can understand at a glance. Shows what ${topicStr} looks like/means, not detailed explanations yet.

No paragraphs. Visual learning only.`;
  };

  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Geography",
    "Art",
    "Music",
    "PE",
    "Computing",
    "Design Technology",
    "RE",
    "PSHE",
  ];

  const years = [
    "Reception",
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
    "Sixth Form",
  ];

  const getFilename = () => {
    if (activeTab === "unit") return "gospel_truth.md";
    if (activeTab === "lesson")
      return `lesson_${lessonData.lessonNumber || "X"}_prompt.txt`;
    if (activeTab === "slides") return "slide_config.txt";
    return "infographic_prompt.txt";
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center flex-shrink-0 shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-800 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            <Icons.DocumentText />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              NotebookLM Prompter
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Teacher Unit Planning Tool
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("unit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "unit"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icons.Book />
            Unit Plan
          </button>
          <button
            onClick={() => setActiveTab("lesson")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "lesson"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icons.Chat />
            Lesson Prompter
          </button>
          <button
            onClick={() => setActiveTab("slides")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "slides"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icons.Presentation />
            Slide Styles
          </button>
          <button
            onClick={() => setActiveTab("infographic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "infographic"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icons.Image />
            Infographics
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={loadExample}
            icon={Icons.Sparkles}
            variant="secondary"
          >
            Load Example
          </Button>
          <Button onClick={clearForm} icon={Icons.Trash} variant="danger">
            Reset
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Form Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-gray-50/50 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto form-scrollbar p-6">
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {activeTab === "unit" && (
                <>
                  {/* Unit Info Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-2 h-6 bg-primary rounded-full"></div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Unit Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <Select
                        label="Subject"
                        value={formData.subject}
                        onChange={(e: any) =>
                          handleChange("subject", e.target.value)
                        }
                        options={subjects}
                      />
                      <Select
                        label="Year Group"
                        value={formData.yearGroup}
                        onChange={(e: any) =>
                          handleChange("yearGroup", e.target.value)
                        }
                        options={years}
                      />
                    </div>
                    <Input
                      label="Unit Title"
                      value={formData.unitTitle}
                      onChange={(e: any) =>
                        handleChange("unitTitle", e.target.value)
                      }
                      placeholder="e.g. Fractions, Shakespearean Drama"
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Duration"
                        value={formData.duration}
                        onChange={(e: any) =>
                          handleChange("duration", e.target.value)
                        }
                        placeholder="e.g. 2 weeks, 8 lessons"
                      />
                      <Input
                        label="Curriculum Link"
                        value={formData.curriculumLink}
                        onChange={(e: any) =>
                          handleChange("curriculumLink", e.target.value)
                        }
                        placeholder="KS2 Programme of Study..."
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                      Lesson Details
                    </h3>

                    <Section
                      title="1. Learning Objectives"
                      isOpen={openSection === 0}
                      toggle={() => toggleSection(0)}
                      icon="01"
                    >
                      <TextArea
                        label="Objectives & Success Criteria"
                        value={formData.learningObjectives}
                        onChange={(e: any) =>
                          handleChange("learningObjectives", e.target.value)
                        }
                        placeholder="- I can: ...&#10;- Success Criteria: ..."
                        help="Start every objective with 'I can'. Make it testable."
                      />
                    </Section>

                    <Section
                      title="2. Progression"
                      isOpen={openSection === 1}
                      toggle={() => toggleSection(1)}
                      icon="02"
                    >
                      <TextArea
                        label="What Students Already Know"
                        value={formData.priorKnowledge}
                        onChange={(e: any) =>
                          handleChange("priorKnowledge", e.target.value)
                        }
                        rows={3}
                      />
                      <TextArea
                        label="The Lesson Sequence"
                        value={formData.lessonSequence}
                        onChange={(e: any) =>
                          handleChange("lessonSequence", e.target.value)
                        }
                        placeholder="Lesson 1: Title..."
                        rows={6}
                        help="Outline the flow of your 10 lessons clearly."
                      />
                      <TextArea
                        label="Future Learning"
                        value={formData.futureLearning}
                        onChange={(e: any) =>
                          handleChange("futureLearning", e.target.value)
                        }
                        rows={2}
                      />
                    </Section>

                    <Section
                      title="3. Core Concepts"
                      isOpen={openSection === 2}
                      toggle={() => toggleSection(2)}
                      icon="03"
                    >
                      <TextArea
                        label="Essential Vocabulary"
                        value={formData.vocabulary}
                        onChange={(e: any) =>
                          handleChange("vocabulary", e.target.value)
                        }
                        placeholder="**Term:** Definition..."
                        help="Define words exactly as you want students to use them."
                      />
                      <TextArea
                        label="Misconceptions"
                        value={formData.misconceptions}
                        onChange={(e: any) =>
                          handleChange("misconceptions", e.target.value)
                        }
                        placeholder="| Misconception | What they do | Fix |"
                        rows={6}
                        help="What usually goes wrong? How do you fix it?"
                      />
                    </Section>

                    <Section
                      title="4. Assessment"
                      isOpen={openSection === 3}
                      toggle={() => toggleSection(3)}
                      icon="04"
                    >
                      <TextArea
                        label="Formative Assessment (During Lesson)"
                        value={formData.formativeAssessment}
                        onChange={(e: any) =>
                          handleChange("formativeAssessment", e.target.value)
                        }
                        placeholder="Observation, Question stems, Exit tickets..."
                      />
                      <TextArea
                        label="Summative Assessment (End of Unit)"
                        value={formData.summativeAssessment}
                        onChange={(e: any) =>
                          handleChange("summativeAssessment", e.target.value)
                        }
                        placeholder="End of unit quiz structure..."
                      />
                    </Section>

                    <Section
                      title="5. Differentiation"
                      isOpen={openSection === 4}
                      toggle={() => toggleSection(4)}
                      icon="05"
                    >
                      <TextArea
                        label="Struggling (SEN/EAL)"
                        value={formData.diffStruggling}
                        onChange={(e: any) =>
                          handleChange("diffStruggling", e.target.value)
                        }
                        placeholder="Simplified objectives, concrete materials..."
                      />
                      <TextArea
                        label="Core (Expected)"
                        value={formData.diffCore}
                        onChange={(e: any) =>
                          handleChange("diffCore", e.target.value)
                        }
                      />
                      <TextArea
                        label="Gifted / Extension"
                        value={formData.diffGifted}
                        onChange={(e: any) =>
                          handleChange("diffGifted", e.target.value)
                        }
                      />
                    </Section>

                    <Section
                      title="6 & 7. Support & Challenge"
                      isOpen={openSection === 5}
                      toggle={() => toggleSection(5)}
                      icon="06"
                    >
                      <TextArea
                        label="Interventions"
                        value={formData.interventions}
                        onChange={(e: any) =>
                          handleChange("interventions", e.target.value)
                        }
                        help="How will you help students who are stuck during the lesson?"
                      />
                      <TextArea
                        label="Extension Activities"
                        value={formData.extensionActivities}
                        onChange={(e: any) =>
                          handleChange("extensionActivities", e.target.value)
                        }
                      />
                    </Section>

                    <Section
                      title="8. Resources"
                      isOpen={openSection === 6}
                      toggle={() => toggleSection(6)}
                      icon="08"
                    >
                      <TextArea
                        label="Physical Manipulatives (Available)"
                        value={formData.resourcesPhysical}
                        onChange={(e: any) =>
                          handleChange("resourcesPhysical", e.target.value)
                        }
                      />
                      <TextArea
                        label="Digital Resources"
                        value={formData.resourcesDigital}
                        onChange={(e: any) =>
                          handleChange("resourcesDigital", e.target.value)
                        }
                      />
                      <TextArea
                        label="NOT Available (Do not use)"
                        value={formData.resourcesNoGo}
                        onChange={(e: any) =>
                          handleChange("resourcesNoGo", e.target.value)
                        }
                        help="Crucial for AI to avoid suggesting things you don't have."
                      />
                    </Section>

                    <Section
                      title="9. Connections & 10. Prompt"
                      isOpen={openSection === 7}
                      toggle={() => toggleSection(7)}
                      icon="10"
                    >
                      <TextArea
                        label="Unit Connections"
                        value={formData.unitConnections}
                        onChange={(e: any) =>
                          handleChange("unitConnections", e.target.value)
                        }
                      />
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <TextArea
                          label="Golden Prompt Constraints"
                          value={formData.goldenPromptConstraints}
                          onChange={(e: any) =>
                            handleChange(
                              "goldenPromptConstraints",
                              e.target.value
                            )
                          }
                          help="Specific constraints for NotebookLM (e.g., 'Use British English')"
                          rows={3}
                        />
                      </div>
                    </Section>
                  </div>
                </>
              )}

              {activeTab === "lesson" && (
                <>
                  {/* Lesson Generator Form */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Lesson Prompter
                      </h2>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-800">
                      <p className="font-semibold mb-1">
                        Context from Unit Plan:
                      </p>
                      <p>Subject: {formData.subject || "Not set"}</p>
                      <p>Year: {formData.yearGroup || "Not set"}</p>
                      <p>Unit: {formData.unitTitle || "Not set"}</p>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-4">
                        <Input
                          label="Lesson Number"
                          value={lessonData.lessonNumber}
                          onChange={(e: any) =>
                            handleLessonChange("lessonNumber", e.target.value)
                          }
                          placeholder="e.g. 5"
                        />
                      </div>
                      <div className="col-span-8">
                        <Input
                          label="Lesson Title"
                          value={lessonData.lessonTitle}
                          onChange={(e: any) =>
                            handleLessonChange("lessonTitle", e.target.value)
                          }
                          placeholder="e.g. Equivalent Fractions"
                        />
                      </div>
                    </div>

                    <Input
                      label="Student Needs (Class Context)"
                      value={lessonData.studentNeeds}
                      onChange={(e: any) =>
                        handleLessonChange("studentNeeds", e.target.value)
                      }
                      placeholder="e.g. including 2 students with dyscalculia"
                    />

                    <TextArea
                      label="Specific Focus / Instructions"
                      value={lessonData.specificFocus}
                      onChange={(e: any) =>
                        handleLessonChange("specificFocus", e.target.value)
                      }
                      placeholder="e.g. Focus on equivalent fractions, use only 1/2, 2/4, 3/6..."
                      rows={6}
                      help="Be specific. What exactly should happen in THIS lesson?"
                    />

                    <Section
                      title="Lesson Structure Override"
                      isOpen={openSection === 10}
                      toggle={() => toggleSection(10)}
                      icon="LS"
                    >
                      <TextArea
                        label="Lesson Slides Structure"
                        value={lessonData.structureOverride}
                        onChange={(e: any) =>
                          handleLessonChange(
                            "structureOverride",
                            e.target.value
                          )
                        }
                        rows={12}
                        help="Default structure is 10 slides. Modify if you need a different format."
                      />
                    </Section>
                  </div>
                </>
              )}

              {activeTab === "slides" && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Slide Deck Configuration
                      </h2>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-800">
                      <p className="font-semibold mb-1">What is this?</p>
                      <p>
                        Generates the instructions for NotebookLM's "Customize
                        Slide Deck" feature.
                      </p>
                    </div>

                    <div className="mb-6 group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">
                        Target Audience
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() =>
                            handleSlideChange("audience", "students")
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            slideData.audience === "students"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-gray-800 mb-1">
                            Classroom (Students)
                          </div>
                          <div className="text-xs text-gray-500">
                            Minimal text on slides. Detailed notes hidden for
                            teacher only.
                          </div>
                        </button>
                        <button
                          onClick={() =>
                            handleSlideChange("audience", "teachers")
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            slideData.audience === "teachers"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-gray-800 mb-1">
                            Teachers (Supply)
                          </div>
                          <div className="text-xs text-gray-500">
                            Full text on slides. Self-contained. No hidden
                            notes.
                          </div>
                        </button>
                      </div>
                    </div>

                    <Select
                      label="Deck Length"
                      value={slideData.length}
                      onChange={(e: any) =>
                        handleSlideChange("length", e.target.value)
                      }
                      options={["Short", "Default", "Long"]}
                    />

                    {slideData.audience === "students" && (
                      <TextArea
                        label="Visual Style Preferences"
                        value={slideData.visualStyle}
                        onChange={(e: any) =>
                          handleSlideChange("visualStyle", e.target.value)
                        }
                        placeholder="e.g. Large diagrams, bold colors, cartoons..."
                        help="Describe how the slides should look to engage students."
                      />
                    )}

                    <TextArea
                      label="Additional Requirements"
                      value={slideData.additionalContext}
                      onChange={(e: any) =>
                        handleSlideChange("additionalContext", e.target.value)
                      }
                      placeholder="e.g. Use British English. Include 'Think Pair Share' icons."
                      help="Any specific constraints or formatting rules?"
                    />
                  </div>
                </>
              )}

              {activeTab === "infographic" && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Infographic Generator
                      </h2>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6 text-sm text-blue-800">
                      <p className="font-semibold mb-1">
                        Visual Learning Tool:
                      </p>
                      <p>
                        Create a one-page visual guide prompt for NotebookLM.
                      </p>
                    </div>

                    <Input
                      label="Topic"
                      value={infographicData.topic}
                      onChange={(e: any) =>
                        handleInfographicChange("topic", e.target.value)
                      }
                      placeholder={formData.unitTitle || "e.g. The Water Cycle"}
                    />

                    <TextArea
                      label="Main Concepts (3-4 items)"
                      value={infographicData.mainConcepts}
                      onChange={(e: any) =>
                        handleInfographicChange("mainConcepts", e.target.value)
                      }
                      placeholder="e.g. evaporation, condensation, precipitation"
                      rows={3}
                      help="The key ideas that must be visualized."
                    />

                    <TextArea
                      label="Concrete Examples (Real-world)"
                      value={infographicData.concreteExamples}
                      onChange={(e: any) =>
                        handleInfographicChange(
                          "concreteExamples",
                          e.target.value
                        )
                      }
                      placeholder="e.g. puddles drying, clouds, rain, river"
                      rows={3}
                      help="Physical things students recognize."
                    />

                    <Input
                      label="Visual Organizer Type"
                      value={infographicData.visualOrganizer}
                      onChange={(e: any) =>
                        handleInfographicChange(
                          "visualOrganizer",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Circular cycle diagram / Timeline / Number line"
                    />

                    <Input
                      label="Flow Direction"
                      value={infographicData.flowDirection}
                      onChange={(e: any) =>
                        handleInfographicChange("flowDirection", e.target.value)
                      }
                      placeholder="e.g. simple to complex / start to finish"
                    />

                    <TextArea
                      label="Style Keywords"
                      value={infographicData.styleKeywords}
                      onChange={(e: any) =>
                        handleInfographicChange("styleKeywords", e.target.value)
                      }
                      rows={2}
                      help="e.g. Bold, colorful illustrations, icons..."
                    />
                  </div>
                </>
              )}

              <div className="text-center text-gray-400 text-sm py-4">
                {activeTab === "unit"
                  ? "Complete the sections above to generate your document."
                  : activeTab === "lesson"
                  ? "Generates a specific prompt to paste into the AI chat."
                  : activeTab === "slides"
                  ? "Copy this text into the 'Description' field of the Slide Generator."
                  : "Copy this text into the 'Description' field to generate a visual guide."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-1/2 bg-[#1e1e2e] flex flex-col h-full relative border-l border-gray-800">
          <div className="flex justify-between items-center px-6 py-4 bg-[#26263a] border-b border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h2 className="text-gray-300 font-mono text-sm ml-3 font-semibold">
                {getFilename()}
              </h2>
            </div>
            <Button
              onClick={handleCopy}
              variant="primary"
              icon={copied ? Icons.Check : Icons.Copy}
            >
              {copied ? "Copied!" : "Copy Output"}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 font-mono text-sm leading-relaxed text-gray-300 selection:bg-primary/30 selection:text-white">
            <pre className="whitespace-pre-wrap max-w-3xl mx-auto">
              {activeTab === "unit"
                ? generateUnitPlan()
                : activeTab === "lesson"
                ? generateLessonPrompt()
                : activeTab === "slides"
                ? generateSlidePrompt()
                : generateInfographicPrompt()}
            </pre>
          </div>

          {/* Subtle Overlay Gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1e1e2e] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
