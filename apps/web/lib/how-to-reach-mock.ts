// TEMPORARY placeholder data for the "How to Reach" modal.
//
// See apps/docs/checklists/master-trek/how-to-reach-data-structure-checklist.md — the real
// MasterTrek.howToReach field is currently a single flat string with no
// enforced structure, so it can't reliably be parsed into per-mode
// paragraphs. This file stands in until backend ships a structured
// `{ mode, description }[]` shape for howToReach.
//
// Swap-out plan: once the API returns `trek.howToReach` as
// `TransportOption[]`, delete this file and pass that straight into
// <HowToReachModal options={trek.howToReach} /> instead of MOCK_HOW_TO_REACH.
// HowToReachModal already expects exactly this shape, so no component
// changes should be needed.

export interface TransportOption {
  mode: string;
  description: string;
}

export const MOCK_HOW_TO_REACH: TransportOption[] = [
  {
    mode: "By Flight",
    description:
      "The nearest airport to Rishikesh is Jolly Grant Airport in Dehradun, located about 20 kilometers away. It is well-connected to major cities like Delhi, Mumbai, and Bangalore through regular flights. From the airport, you can take a taxi to reach Rishikesh in approximately 45 minutes, while local buses may also be available but are less frequent.",
  },
  {
    mode: "By Train",
    description:
      "Rishikesh has its own railway station, but it handles limited trains. The nearby Haridwar Junction, about 25 kilometers away, offers excellent connectivity to major cities like Delhi, Kolkata, and Mumbai. From Haridwar, you can hire a taxi or take a local bus to Rishikesh, which takes around 30–45 minutes. Popular trains include the Yoga Express and Dehradun Express.",
  },
  {
    mode: "By Bus",
    description:
      "Rishikesh is well-connected by road. From Delhi, around 240 kilometers away, private and state-run Volvo buses operate from Kashmiri Gate ISBT and take approximately 6–7 hours depending on traffic. Regular buses from nearby cities like Dehradun and Haridwar also make reaching Rishikesh easy and affordable.",
  },
];
