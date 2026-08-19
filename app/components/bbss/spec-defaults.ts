// Default content for the Biochemistry Specializations widget.
//
// Generated from the DATA block of public/bbss/snippets/biochem-specializations.html,
// which is the source of truth (curl'd verbatim from the BBSS-website-widgets repo).
// This file holds widget *content* only, never widget logic. If the snippet's defaults
// change, re-fetch the snippet and regenerate this file rather than editing it by hand.

export const ACCENT_COLORS = [
  { key: "green", label: "Green", hex: "#8AB976" },
  { key: "blue", label: "Periwinkle", hex: "#97A6D8" },
  { key: "orange", label: "Coral", hex: "#F38D6D" },
  { key: "pink", label: "Rose", hex: "#E39EBB" },
] as const;

export type AccentKey = (typeof ACCENT_COLORS)[number]["key"];

export type SpecDetail = { label: string; value: string };

export type Spec = {
  name: string;
  gate: string;
  color: AccentKey;
  details: SpecDetail[];
};

export const DEFAULT_SPECS: Spec[] = [
  {
    name: "Biochemistry Core",
    gate: "No application required",
    color: "green",
    details: [
      {
        label: "Overview",
        value:
          "Default path, with automatic enrolment and the most room for electives.",
      },
      {
        label: "Entry year",
        value: "Level III (automatic if not specializing)",
      },
      {
        label: "Application",
        value: "None required",
      },
      {
        label: "Prerequisites",
        value: "None",
      },
      {
        label: "Program length",
        value: "4 years",
      },
      {
        label: "Highlights",
        value:
          "Core courses cover the degree requirements; optional thesis or project (BIOCHEM 3A03, 3R03, 4F09, 4C03).",
      },
    ],
  },
  {
    name: "Biomedical Research Specialization",
    gate: "Supplementary application",
    color: "blue",
    details: [
      {
        label: "Overview",
        value:
          "Research-intensive path with heavy lab work and a senior thesis.",
      },
      {
        label: "Entry year",
        value: "Level III",
      },
      {
        label: "Application",
        value:
          "Supplementary application plus a research course permission form.",
      },
      {
        label: "Prerequisites",
        value:
          "Identify a lab or professor during 2nd year; start looking early.",
      },
      {
        label: "Program length",
        value: "4 years",
      },
      {
        label: "Highlights",
        value:
          "Up to 21 units of advanced lab experience; at least 3 units of lab or research courses in 3rd year plus a senior thesis in 4th year.",
      },
    ],
  },
  {
    name: "Biochemistry Co-op",
    gate: "OSCARplus application",
    color: "orange",
    details: [
      {
        label: "Overview",
        value: "Adds paid, full-time work terms to the degree.",
      },
      {
        label: "Entry year",
        value: "Level III",
      },
      {
        label: "Application",
        value: "Apply through OSCARplus.",
      },
      {
        label: "Prerequisites",
        value: "Complete SCIENCE 2C00; minimum 6.0 GPA.",
      },
      {
        label: "Program length",
        value: "5 years",
      },
      {
        label: "Highlights",
        value:
          "16 months of work (two 8-month or four 4-month terms) across 3rd to 5th year in industry, academia, government, or hospitals.",
      },
    ],
  },
  {
    name: "Biomedical Discovery & Commercialization",
    gate: "Supplementary application + interview",
    color: "pink",
    details: [
      {
        label: "Overview",
        value: "Blends drug discovery science with commerce and business.",
      },
      {
        label: "Entry year",
        value: "Level III",
      },
      {
        label: "Application",
        value: "Supplementary application plus an interview.",
      },
      {
        label: "Prerequisites",
        value: "Competitive admission; cohort of 50 to 60 students.",
      },
      {
        label: "Program length",
        value: "4 years, with an optional accelerated 1-year Master’s.",
      },
      {
        label: "Highlights",
        value:
          "Science plus business curriculum; the Master’s option includes a 4 to 12 month internship.",
      },
    ],
  },
];
