/**
 * The Work demo's scenario: two weeks in San Francisco from London. The
 * listings, sites and prices are illustrative, written to be realistic for
 * March; airline names are real carriers on the route, the sites are not.
 */
export const trip = {
  work: "SF founder trip",
  time: "10:42 AM",
  request:
    "Plan two weeks in San Francisco for a founder trip in March, flying from London. Stay near SoMa and keep it under $6k.",
  context: [
    { label: "Your memory", kind: "Memory" },
    { label: "Trip planning", kind: "Skill" },
  ],
  questions: [
    {
      ask: "Which two weeks in March, and do you need a proper desk where you stay?",
      answer: "Mar 2–16. Yes, a real desk.",
    },
    {
      ask: "Is nonstop worth paying more for?",
      answer: "If it's under £150 more.",
    },
  ],
  stays: {
    agent: "Stays",
    status: "3 places near SoMa, two with a desk",
    site: "staybook.com",
    page: "Stays in SoMa · Mar 2–16",
    title: "Stays near SoMa, Mar 2–16",
    options: [
      {
        name: "Light-filled loft with a real desk",
        area: "Entire loft · SoMa",
        rating: "4.96",
        reviews: 112,
        desk: "Desk and monitor",
        note: "8 min walk to Caltrain",
        price: "$3,120",
        pick: true,
        image: "/demo/stay-soma-loft.webp",
      },
      {
        name: "Quiet one-bedroom by the ballpark",
        area: "Entire apartment · Mission Bay",
        rating: "4.91",
        reviews: 64,
        desk: "Desk by the window",
        note: "12 min to SoMa",
        price: "$2,860",
        image: "/demo/stay-mission-bay.webp",
      },
      {
        name: "Garden studio with fast Wi‑Fi",
        area: "Entire studio · Hayes Valley",
        rating: "4.88",
        reviews: 203,
        desk: "Kitchen table only",
        note: "20 min to SoMa",
        price: "$2,540",
        image: "/demo/stay-hayes-valley.webp",
      },
    ],
  },
  flights: {
    agent: "Flights",
    status: "4 return options, 3 nonstop",
    site: "flightfinder.com",
    page: "London ⇄ San Francisco · Mar 2–16",
    title: "London ⇄ San Francisco, return",
    options: [
      {
        airline: "KLM",
        price: "£512",
        depart: "06:05",
        arrive: "12:40",
        from: "LHR",
        to: "SFO",
        duration: "14h 35m",
        stops: "1 stop · AMS",
      },
      {
        airline: "United",
        price: "£634",
        depart: "09:45",
        arrive: "12:50",
        from: "LHR",
        to: "SFO",
        duration: "11h 05m",
        stops: "Nonstop",
        pick: true,
        why: "Nonstop for £122 more — within what you said.",
      },
      {
        airline: "British Airways",
        price: "£742",
        depart: "11:20",
        arrive: "14:15",
        from: "LHR",
        to: "SFO",
        duration: "10h 55m",
        stops: "Nonstop",
      },
      {
        airline: "Virgin Atlantic",
        price: "£768",
        depart: "14:30",
        arrive: "17:35",
        from: "LHR",
        to: "SFO",
        duration: "11h 05m",
        stops: "Nonstop",
      },
    ],
  },
  plan: {
    title: "Two weeks in San Francisco",
    dates: "Mar 2–16",
    summary:
      "Take the SoMa loft for its desk and the walk to Caltrain, and fly United nonstop. Together they come to about $3,970 before food and transport, well under your $6k. UK passports need an approved ESTA before you board.",
    figures: [
      { value: "$3,120", label: "Loft · 14 nights" },
      { value: "£634", label: "United · return" },
    ],
    timeline: [
      { when: "Before booking", title: "Apply for an ESTA", detail: "Usually approved within 72 hours; apply before you pay for flights." },
      { when: "Mar 2", title: "Fly London → San Francisco", detail: "United · LHR 09:45 → SFO 12:50 · nonstop", cost: "£634 rtn" },
      { when: "Mar 2–16", title: "Stay in SoMa", detail: "Light-filled loft · desk and monitor · 8 min to Caltrain", cost: "$3,120" },
      { when: "Mar 16", title: "Fly San Francisco → London", detail: "United · SFO 16:10 → LHR 10:25 +1 · nonstop" },
    ],
    sources: ["staybook.com", "flightfinder.com", "esta.cbp.dhs.gov"],
  },
  tasks: [
    "Apply for an ESTA",
    "Book the SoMa loft for Mar 2–16",
    "Book United LHR → SFO",
    "Put the trip on the calendar",
    "Share the plan with Alex",
  ],
} as const;
