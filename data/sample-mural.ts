import { Posting } from "@/types/postings";
import { posterSvg } from "@/lib/poster-svg";

// A stand-in for a real photographed board, so the swipe flow works with no API
// key. Ids are stable (not random) so saving and skipping stay consistent across
// reloads. This is sample data, labeled as such in the UI.

export const SAMPLE_MURAL_ID = "sample";

const BASE: Posting[] = [
  {
    id: "sample-1",
    title: "AI for Social Impact: Building Responsible Civic Tech",
    category: "Event",
    summary:
      "Alumni panel on AI in public-interest technology and government, with time for questions about scoping responsible tools and careers in civic tech.",
    date: "Wed, 6:00 PM",
    location: "Hamburg Hall 1204",
    org: "Heinz College",
    tags: ["ai", "policy", "careers"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-2",
    title: "Paid memory and attention study",
    category: "Research",
    summary:
      "Healthy participants needed for a one-hour study on memory and attention. Sessions run weekday afternoons in Baker Hall.",
    compensation: "$20 gift card",
    contact: "memlab@andrew.cmu.edu",
    org: "Psychology Department",
    tags: ["psychology", "research study", "paid"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-3",
    title: "Futon for sale, good condition",
    category: "For sale",
    summary:
      "Graduating senior selling a gray futon that folds flat into a bed. Pickup near campus this weekend.",
    price: "$60",
    contact: "text 412-555-0148",
    tags: ["furniture", "dorm", "moving out"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-4",
    title: "Calculus and linear algebra tutoring",
    category: "Tutoring",
    summary:
      "Math PhD student offering one-on-one tutoring for 21-120, 21-122, and 21-241. First session free.",
    price: "$25/hour",
    contact: "@cmu_math_tutor",
    tags: ["math", "tutoring", "calculus"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-5",
    title: "Undergraduate research assistant, robotics lab",
    category: "Job",
    summary:
      "Part-time position helping run experiments and label data in a mobile-robotics lab. Python experience preferred; 8 to 10 hours a week.",
    compensation: "$16/hour",
    contact: "roboticslab-hiring@cmu.edu",
    org: "Robotics Institute",
    tags: ["robotics", "research", "python"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-6",
    title: "ScottyLabs first interest meeting",
    category: "Club",
    summary:
      "Build student tools and run TartanHacks. New members welcome, no experience required. Pizza provided.",
    date: "Thu, 7:00 PM",
    location: "Gates 4401",
    org: "ScottyLabs",
    tags: ["software", "hackathon", "community"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-7",
    title: "TartanHacks 2026 kickoff",
    category: "Event",
    summary:
      "Annual 36-hour hackathon across CMU. Form a team or join one at the kickoff. Workshops and mentors all weekend.",
    date: "Fri, 7:00 PM",
    location: "Rangos Ballroom",
    org: "ScottyLabs",
    tags: ["hackathon", "ai", "free food"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-8",
    title: "Survey: how students manage deadlines",
    category: "Research",
    summary:
      "Ten-minute online survey on study habits and time management. Open to all enrolled students.",
    compensation: "entry in a $50 raffle",
    contact: "studyhabits.cmu.edu",
    org: "HCII",
    tags: ["survey", "hci", "productivity"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-9",
    title: "Intro to Machine Learning textbook",
    category: "For sale",
    summary:
      "Lightly used textbook for 10-301/10-601, no writing inside. Meet at Hunt Library.",
    price: "$40",
    contact: "text 412-555-0162",
    tags: ["textbook", "machine learning", "books"],
    muralId: SAMPLE_MURAL_ID,
  },
  {
    id: "sample-10",
    title: "Found: blue water bottle",
    category: "Announcement",
    summary:
      "Found a blue insulated water bottle in Wean Hall 5409. Describe it to claim.",
    location: "Wean Hall front desk",
    tags: ["lost and found"],
    muralId: SAMPLE_MURAL_ID,
  },
];

// Attach a generated SVG poster to each entry, so the sample mural shows
// real-looking posters even though there is no photograph behind them.
export const SAMPLE_POSTINGS: Posting[] = BASE.map((p) => ({
  ...p,
  image: posterSvg(p),
}));
