import { Event } from "@/types/events";

// Mock event data for CMU Event Compass
// TODO: Replace with real API calls or ICS feed parsing
// Structure is designed to be easily swapped with API integration

const now = new Date();
const getDate = (daysOffset: number, hours: number = 12) => {
  const date = new Date(now);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

const getEndDate = (startISO: string, hours: number = 2) => {
  const date = new Date(startISO);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

export const mockEvents: Event[] = [
  // Today's events
  {
    id: "1",
    title: "AI & Machine Learning Research Talk",
    description:
      "Join us for an exciting talk on the latest developments in deep learning and neural networks, featuring guest speakers from industry.",
    startTime: getDate(0, 14),
    endTime: getEndDate(getDate(0, 14)),
    location: "Gates Hillman Center, Room 4401",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML", "Data Science"],
    rsvpUrl: "https://cmu.edu/events/ai-talk",
    hostOrgName: "SCS AI Lab",
  },
  {
    id: "2",
    title: "HCI Design Workshop",
    description:
      "Hands-on workshop on user-centered design methodologies and prototyping techniques for interactive systems.",
    startTime: getDate(0, 16),
    endTime: getEndDate(getDate(0, 16), 3),
    location: "Newell-Simon Hall, Room 1305",
    source: "HCII",
    format: "Workshop",
    interestTags: ["HCI / Design", "Product Management"],
    rsvpUrl: "https://cmu.edu/events/hci-workshop",
    hostOrgName: "HCII Design Lab",
  },
  // This week
  {
    id: "3",
    title: "CMU TartanHacks 2025",
    description:
      "Annual 36-hour hackathon bringing together students from across CMU to build innovative projects. Prizes, mentorship, and free food!",
    startTime: getDate(2, 18),
    endTime: getDate(4, 12),
    location: "Gates Hillman Center",
    source: "University-wide",
    format: "Hackathon",
    interestTags: ["AI / ML", "HCI / Design", "Entrepreneurship", "Robotics"],
    rsvpUrl: "https://tartanhacks.com",
    hostOrgName: "ScottyLabs",
  },
  {
    id: "4",
    title: "Healthcare Innovation Case Competition",
    description:
      "Teams compete to solve real-world healthcare challenges. Winners receive cash prizes and opportunities to present to industry leaders.",
    startTime: getDate(3, 10),
    endTime: getEndDate(getDate(3, 10), 5),
    location: "Tepper Quad, Room 5501",
    source: "Tepper",
    format: "Case Competition",
    interestTags: ["Healthcare", "Entrepreneurship"],
    rsvpUrl: "https://tepper.cmu.edu/case-comp",
    hostOrgName: "Tepper Healthcare Club",
  },
  {
    id: "5",
    title: "Data Science Career Fair",
    description:
      "Meet recruiters from top tech companies looking for data scientists, analysts, and ML engineers. Bring your resume!",
    startTime: getDate(4, 13),
    endTime: getEndDate(getDate(4, 13), 4),
    location: "University Center, Rangos Ballroom",
    source: "SCS",
    format: "Career/Networking",
    interestTags: ["Data Science", "AI / ML"],
    rsvpUrl: "https://cmu.edu/career-fair",
    hostOrgName: "SCS Career Services",
  },
  // This month
  {
    id: "6",
    title: "Policy & Technology Panel Discussion",
    description:
      "Experts discuss the intersection of technology policy, AI governance, and societal impact.",
    startTime: getDate(7, 17),
    endTime: getEndDate(getDate(7, 17)),
    location: "Heinz College, Room 1102",
    source: "Heinz",
    format: "Talk",
    interestTags: ["Policy & Society", "AI / ML"],
    rsvpUrl: "https://heinz.cmu.edu/policy-panel",
    hostOrgName: "Heinz Policy Lab",
  },
  {
    id: "7",
    title: "Startup Pitch Night",
    description:
      "Watch CMU student entrepreneurs pitch their startup ideas to a panel of investors and mentors.",
    startTime: getDate(10, 19),
    endTime: getEndDate(getDate(10, 19), 2),
    location: "Tepper Quad, Auditorium",
    source: "Tepper",
    format: "Talk",
    interestTags: ["Entrepreneurship"],
    rsvpUrl: "https://cmu.edu/startup-night",
    hostOrgName: "CMU Entrepreneurship Club",
  },
  {
    id: "8",
    title: "Robotics Lab Open House",
    description:
      "Tour the robotics lab, see demos of cutting-edge robots, and chat with researchers about ongoing projects.",
    startTime: getDate(12, 14),
    endTime: getEndDate(getDate(12, 14), 3),
    location: "Newell-Simon Hall, Robotics Lab",
    source: "SCS",
    format: "Workshop",
    interestTags: ["Robotics", "AI / ML"],
    hostOrgName: "Robotics Institute",
  },
  {
    id: "9",
    title: "Design Thinking Workshop",
    description:
      "Learn human-centered design methods through hands-on exercises and group activities.",
    startTime: getDate(14, 13),
    endTime: getEndDate(getDate(14, 13), 4),
    location: "HCII, Room 3401",
    source: "HCII",
    format: "Workshop",
    interestTags: ["HCI / Design", "Product Management"],
    rsvpUrl: "https://hcii.cmu.edu/design-workshop",
    hostOrgName: "HCII Design Studio",
  },
  {
    id: "10",
    title: "CMU Spring Social Mixer",
    description:
      "Casual social event to meet students from different programs and network in a relaxed setting.",
    startTime: getDate(15, 18),
    endTime: getEndDate(getDate(15, 18), 3),
    location: "University Center, Skibo Cafe",
    source: "University-wide",
    format: "Social",
    interestTags: ["General"],
    hostOrgName: "Student Activities Office",
  },
  {
    id: "11",
    title: "Product Management Bootcamp",
    description:
      "Intensive one-day bootcamp covering product strategy, roadmap planning, and stakeholder management.",
    startTime: getDate(17, 9),
    endTime: getEndDate(getDate(17, 9), 8),
    location: "Tepper Quad, Room 4101",
    source: "Tepper",
    format: "Workshop",
    interestTags: ["Product Management", "Entrepreneurship"],
    rsvpUrl: "https://tepper.cmu.edu/pm-bootcamp",
    hostOrgName: "Tepper Product Club",
  },
  {
    id: "12",
    title: "Healthcare Tech Innovation Hackathon",
    description:
      "48-hour hackathon focused on building solutions for healthcare challenges. Partnered with local hospitals.",
    startTime: getDate(20, 9),
    endTime: getDate(22, 18),
    location: "Heinz College",
    source: "Heinz",
    format: "Hackathon",
    interestTags: ["Healthcare", "AI / ML", "HCI / Design"],
    rsvpUrl: "https://heinz.cmu.edu/healthcare-hack",
    hostOrgName: "Heinz Healthcare Innovation Lab",
  },
  // Past events
  {
    id: "13",
    title: "ML Research Symposium",
    description: "Annual symposium showcasing cutting-edge machine learning research from CMU faculty and students.",
    startTime: getDate(-5, 10),
    endTime: getEndDate(getDate(-5, 10), 6),
    location: "Gates Hillman Center, Auditorium",
    source: "SCS",
    format: "Talk",
    interestTags: ["AI / ML", "Data Science"],
    hostOrgName: "ML Department",
  },
  {
    id: "14",
    title: "Dietrich College Research Showcase",
    description: "Celebrate research achievements from across Dietrich College with poster presentations and talks.",
    startTime: getDate(-10, 13),
    endTime: getEndDate(getDate(-10, 13), 4),
    location: "Baker Hall",
    source: "Dietrich",
    format: "Social",
    interestTags: ["General"],
    hostOrgName: "Dietrich College",
  },
];

