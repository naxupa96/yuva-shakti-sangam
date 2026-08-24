export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "The Big Idea", href: "#big-idea" },
  { label: "Why Attend", href: "#why-attend" },
  { label: "Experience", href: "#experience" },
  { label: "Samvaad", href: "#samvaad" },
  { label: "Action Areas", href: "#what-can-you-do" },
  { label: "About RSS", href: "#about-rss" },
  { label: "Event Info", href: "#event-info" },
];

export interface Pillar {
  number: string;
  title: string;
  tagline: string;
  description: string;
  action: string;
}

export const pillars: Pillar[] = [
  {
    number: "01",
    title: "THINK",
    tagline: "Question the world around you.",
    description: "Move beyond passive consumption. Challenge assumptions, analyze critical national challenges, and engage your intellect on India's trajectory.",
    action: "Deep questioning & constructive critique",
  },
  {
    number: "02",
    title: "CONNECT",
    tagline: "Meet people who care.",
    description: "Step away from algorithmic feeds. Form genuine bonds with driven peers, student leaders, young professionals, and community builders.",
    action: "Authentic peer networking & shared purpose",
  },
  {
    number: "03",
    title: "EXPERIENCE",
    tagline: "Feel the collective energy.",
    description: "Immerse yourself in physically engaging games, cultural expressions, martial arts demonstrations, and the electric presence of thousands gathered.",
    action: "Live immersion, discipline & cultural pride",
  },
  {
    number: "04",
    title: "ACT",
    tagline: "Channel energy into outcome.",
    description: "Discovery pathways to contribute your specific skills—in tech, environment, teaching, social venture, or community service.",
    action: "Direct project commitments & real impact",
  },
];

export interface ExperienceItem {
  number: string;
  title: string;
  titleHindi: string;
  description: string;
  highlights: string[];
  icon: string;
}

export const experiences: ExperienceItem[] = [
  {
    number: "01",
    title: "High-Energy Ground Games",
    titleHindi: "मैदानी खेल",
    description: "Not traditional sitting in lecture halls. Traditional Indian outdoor games that demand agility, teamwork, fast thinking, and instinctive leadership.",
    highlights: ["Kabaddi & Kho-Kho tactical variants", "Indigenous strength & agility challenges", "Spontaneous team problem-solving"],
    icon: "Gamepad2",
  },
  {
    number: "02",
    title: "Desh Bhakti Cultural Drama",
    titleHindi: "नाट्य प्रस्तुति",
    description: "Visually arresting live stage theatricals portraying untold chapters of unsung national heroes, historical resilience, and civilizational courage.",
    highlights: ["Live immersive soundscapes", "Powerful physical theatre & monologues", "Historical unsung freedom narratives"],
    icon: "Theater",
  },
  {
    number: "03",
    title: "Yuva Samvaad — Open Floor Dialogue",
    titleHindi: "युवा संवाद",
    description: "Unfiltered, no-prerequisites dialogue. Ask tough questions about modern culture, civilizational identity, governance, and social balance.",
    highlights: ["Direct interaction with senior leaders", "No pre-screened questions", "Open mic for contrarian perspectives"],
    icon: "MessageSquare",
  },
  {
    number: "04",
    title: "Nation-Building Project Stalls",
    titleHindi: "राष्ट्र निर्माण",
    description: "Interactive showcases of ongoing youth-led grassroots projects across tech literacy, rural development, environmental revival, and education.",
    highlights: ["Direct volunteering sign-ups", "Live tech-for-good project demos", "Mentorship access for student ventures"],
    icon: "Hammer",
  },
  {
    number: "05",
    title: "Social Harmony & Fellowship (Seva)",
    titleHindi: "समरसता एवं सेवा",
    description: "Experience the profound unity of shared meals, collective discipline, and equality in action—where social divisions naturally dissolve.",
    highlights: ["Community meal (Sahabhoj)", "Zero VIP culture — all seated together", "Peer networking across diverse backgrounds"],
    icon: "HeartHandshake",
  },
];

export interface ActionDomain {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  impactMetric: string;
  contributionPoints: string[];
  civilizationalRelevance: string;
}

export const actionDomains: ActionDomain[] = [
  {
    id: "tech",
    title: "Technology & AI Sovereignty",
    tagline: "Build digital infrastructure that belongs to Bharat.",
    description: "Digital public goods, cybersecurity resilience, open-source Indian language models, and grassroots hardware innovation to free India from algorithmic dependencies.",
    iconName: "Cpu",
    impactMetric: "850+ Open-Source Contributors Active",
    contributionPoints: [
      "Contribute code to vernacular language LLMs & local dataset tooling",
      "Deploy cybersecurity awareness workshops for rural small businesses",
      "Build offline-first digital literacy tools for tribal schools",
    ],
    civilizationalRelevance: "Ensuring Bharat controls its own intellectual and cognitive infrastructure in the synthetic intelligence era.",
  },
  {
    id: "education",
    title: "Education & Knowledge Systems",
    tagline: "Democratize excellence for every child.",
    description: "Supplemental teaching in slum settlements, decolonizing textbooks, establishing community libraries, and bridging the vocational gap for Tier-3 college students.",
    iconName: "GraduationCap",
    impactMetric: "12,000+ Students Mentored Weekly",
    contributionPoints: [
      "Weekend remedial teaching in foundational math & science",
      "Establish village libraries with Indic history and science collections",
      "Conduct career guidance bootcamps for first-generation graduates",
    ],
    civilizationalRelevance: "Reviving the guru-shishya ethos of free knowledge transmission as the ultimate equalizer.",
  },
  {
    id: "entrepreneurship",
    title: "Grassroots Entrepreneurship",
    tagline: "Turn job seekers into community job creators.",
    description: "Micro-enterprises, rural supply-chain value addition, artisan cooperative digitization, and sustainable Swadeshi manufacturing models.",
    iconName: "Briefcase",
    impactMetric: "340+ Youth-Led Rural Enterprises",
    contributionPoints: [
      "Provide accounting, marketing & legal support to rural micro-producers",
      "Build direct-to-consumer digital channels for traditional crafts",
      "Mentor young village founders on zero-debt scaling methods",
    ],
    civilizationalRelevance: "Re-establishing self-reliant local economies (Gram Swaraj) anchored in decentralized wealth creation.",
  },
  {
    id: "seva",
    title: "Direct Seva & Social Relief",
    tagline: "Action where state machinery and markets fail to reach.",
    description: "Disaster rapid response, blood donation registries, destitute healthcare camps, slum sanitation drives, and elder care companionship networks.",
    iconName: "HeartHandshake",
    impactMetric: "1.4 Lakh+ Disaster Victims Supported Annually",
    contributionPoints: [
      "Train with the certified Disaster Quick Reaction Volunteer Corps",
      "Organize emergency blood donor clusters by pin-code",
      "Participate in weekly nutrition & medical check-up outreach",
    ],
    civilizationalRelevance: "Seva is not charity—it is the experiential recognition of one divinity in every living being (Nara Seva, Narayana Seva).",
  },
  {
    id: "environment",
    title: "Ecological Restoration",
    tagline: "Treat natural systems as sacred living relatives.",
    description: "Native afforestation (Miyawaki urban forests), riverbank revitalization, rainwater harvesting arrays, zero-waste neighborhood composting, and single-use plastic elimination.",
    iconName: "Trees",
    impactMetric: "2.8 Lakh+ Native Trees Thriving",
    contributionPoints: [
      "Lead local Miyawaki micro-forest planting on neglected municipal plots",
      "Restore local stepwells (Vavs) and traditional percolation ponds",
      "Run neighborhood segregation & zero-waste kitchen audits",
    ],
    civilizationalRelevance: "Living out the Bhumi Sukta worldview: 'Earth is my mother, I am her child.'",
  },
  {
    id: "leadership",
    title: "Character & Civic Leadership",
    tagline: "Steer institutions with unshakeable moral compass.",
    description: "Local governance participation, civic activism, anti-corruption RTI advocacy, community dispute mediation, and public infrastructure vigilance.",
    iconName: "Shield",
    impactMetric: "4,200+ Civic Volunteers Mobilized",
    contributionPoints: [
      "Audit and report local public infrastructure maintenance issues",
      "Organize citizen awareness on rights, duties & local ward sabhas",
      "Mentor teenage youth through athletic discipline & value workshops",
    ],
    civilizationalRelevance: "Building an incorruptible cadre of citizens who place nation above self in every sphere of life.",
  },
];

export interface Milestone {
  year: string;
  headline: string;
  description: string;
  scale: string;
  badge: string;
}

export const timelineMilestones: Milestone[] = [
  {
    year: "1925",
    headline: "Foundation on Vijayadashami",
    description: "Dr. Keshav Baliram Hedgewar establishes RSS in Nagpur with a handful of youth, pioneering daily 1-hour Shakha character training.",
    scale: "Nagpur, Maharashtra",
    badge: "Origin",
  },
  {
    year: "1947",
    headline: "Partition Refugee Relief",
    description: "Set up massive refugee transit camps, provided food, medical care, and security to millions displaced across Punjab, Sindh, and Bengal borders.",
    scale: "3,000+ Relief Camps Run",
    badge: "National Defense",
  },
  {
    year: "1962 & 1965",
    headline: "Border Wars Civil Support",
    description: "Managed internal security, border supply logistics, and traffic control at Prime Minister Nehru & Shastri's request. Invited to march in 1963 Republic Day parade.",
    scale: "Republic Day Honor (1963)",
    badge: "Civil Duty",
  },
  {
    year: "1975–77",
    headline: "Underground Democratic Resistance",
    description: "Led the grassroots underground movement against the Emergency, publishing underground newspapers and coordinating opposition restoration of civil liberties.",
    scale: "1.2 Lakh+ Volunteers Jailed",
    badge: "Democracy Defense",
  },
  {
    year: "1979",
    headline: "Morbi Dam Burst Disaster Relief",
    description: "When the Machchhu-2 dam collapsed flooding Morbi, 4,000+ Swayamsevaks arrived immediately to clear debris, perform mass cremations to stop cholera epidemics, and rebuild dwellings.",
    scale: "4,000+ Mobilized in Gujarat",
    badge: "Disaster Response",
  },
  {
    year: "1988",
    headline: "Ahmedabad Plane Crash (Flight IC 113)",
    description: "When Indian Airlines Flight 113 crashed near Ahmedabad airport in Kotarpur fields, local Swayamsevaks were the first civilian responders on site, extricating survivors and managing hospital trauma transit.",
    scale: "First Responders on Crash Site",
    badge: "Aviation Rescue",
  },
  {
    year: "1989",
    headline: "Sewa Bharati Institutionalization",
    description: "Formalized grassroots social work network into Sewa Bharati, scaling institutional presence across tribal education, health vans, and skill centers.",
    scale: "1,50,000+ Service Projects",
    badge: "Institutional Seva",
  },
  {
    year: "1999",
    headline: "Odisha Super Cyclone Relief",
    description: "Utkal Bipanna Sahayata Samiti deployed 10,000+ volunteers into flooded coastal belts, cleared debris, purified drinking wells, and constructed permanent cyclone shelters.",
    scale: "10,000+ Volunteers Deployed",
    badge: "Disaster Response",
  },
  {
    year: "2001",
    headline: "Bhuj Gujarat Earthquake Relief",
    description: "First responders on the ground within 45 minutes of the devastating tremor in Kutch and Ahmedabad, rescuing trapped survivors, setting up blood banks, and adopting 10+ villages for permanent reconstruction.",
    scale: "25,000+ Volunteers in Kutch",
    badge: "Disaster Response",
  },
  {
    year: "2013",
    headline: "Kedarnath Uttarakhand Floods",
    description: "Following catastrophic Himalayan cloudbursts, relief posts were operated across Rishikesh, Haridwar, and Rudraprayag, distributing over 1.5 lakh food packets and medical aid to stranded pilgrims.",
    scale: "1.5 Lakh+ Food Packets Distributed",
    badge: "Himalayan Relief",
  },
  {
    year: "2020–22",
    headline: "COVID-19 Pandemic Mobilization",
    description: "Nationwide 24/7 COVID care and isolation centers, distributed 8.5+ crore meals, 62+ lakh grocery kits, operated plasma donor registries and oxygen banks, and conducted respectful cremations during surges.",
    scale: "8.5 Crore Meals Served",
    badge: "Pandemic Response",
  },
  {
    year: "2023",
    headline: "Balasore Train Collision Rescue",
    description: "Over 1,200 Swayamsevaks rushed to the Bahanaga train collision site at midnight, formed human chains to extricate trapped passengers, and queued at Balasore hospital donating 500+ units of emergency blood.",
    scale: "1,200+ Responders & 500+ Blood Units",
    badge: "Railway Rescue",
  },
  {
    year: "2025",
    headline: "Ahmedabad Aviation Emergency Support",
    description: "During critical airport transit emergencies and perimeter distress incidents at SVPI Airport Ahmedabad, volunteer networks coordinated on-ground transit logistics, water/refreshments, emergency blood readiness, and passenger family assistance.",
    scale: "Airport Perimeter Relief & Support",
    badge: "Aviation Aid",
  },
  {
    year: "2025–26",
    headline: "Centenary of Service (100 Years)",
    description: "Entering the 100th year of continuous voluntary nation-building with unprecedented youth mobilization across technology, environment, and social harmony.",
    scale: "60,000+ Daily Shakhas",
    badge: "Centenary Era",
  },
];

export interface DisasterReliefIncident {
  id: string;
  year: string;
  location: string;
  title: string;
  category: "Aviation" | "Flood / Cyclone" | "Earthquake" | "Epidemic / Health" | "Railway" | "Civil Emergency";
  facts: string[];
  impactSummary: string;
  verifiedSource: string;
}

export const disasterReliefIncidents: DisasterReliefIncident[] = [
  {
    id: "ahmedabad-aviation-2025",
    year: "2025",
    location: "Ahmedabad Airport Area, Gujarat",
    title: "Ahmedabad Aviation Emergency & Passenger Aid",
    category: "Aviation",
    facts: [
      "During airport perimeter emergencies and diversion crises in Ahmedabad, youth volunteers provided rapid logistical aid outside airport gates.",
      "Set up instant transit refreshment points, drinking water distribution, and family assistance desks for stranded domestic and international passengers.",
      "Maintained on-call voluntary blood donor registries at Ahmedabad Civil Hospital for emergency contingency support.",
      "Collaborated constructively with local civic and transport authorities to ensure smooth civilian traffic movement around terminal corridors.",
    ],
    impactSummary: "Rapid passenger liaison, airport perimeter refreshments, and hospital blood donation readiness.",
    verifiedSource: "Ahmedabad Civic & Volunteer Relief Coordination Records (2025)",
  },
  {
    id: "ahmedabad-crash-1988",
    year: "1988",
    location: "Ahmedabad (Kotarpur), Gujarat",
    title: "Indian Airlines Flight 113 Plane Crash",
    category: "Aviation",
    facts: [
      "On 19 October 1988, Flight IC 113 crashed near Ahmedabad airport amid dense morning fog in the Kotarpur fields.",
      "Local Swayamsevaks and neighborhood residents were the first civilians to reach the crash site prior to official rescue vehicles.",
      "Extricated 5 surviving passengers from the burning debris, safely transported the critically injured to Ahmedabad Civil Hospital, and helped cordoning off the area.",
      "Assisted district authorities with respectful handling, retrieval, and family identification of deceased passengers.",
    ],
    impactSummary: "First civilian emergency responders on ground; assisted survivor evacuation and hospital trauma logistics.",
    verifiedSource: "Ahmedabad Civil Hospital & contemporary press documentation (October 1988)",
  },

  {
    id: "morbi-dam-1979",
    year: "1979",
    location: "Morbi, Gujarat",
    title: "Machchhu Dam Burst & Morbi Flood Disaster",
    category: "Flood / Cyclone",
    facts: [
      "On 11 August 1979, the Machchhu-2 dam collapsed, flooding the town of Morbi under 20 feet of water within 15 minutes.",
      "Over 4,000 Swayamsevaks from across Gujarat mobilized within hours when many hesitated to enter due to severe contamination.",
      "Handled the grim task of clearing and cremating thousands of human and cattle remains without religious discrimination to prevent cholera epidemics.",
      "Organized mass relief camps, community grain kitchens, medical camps, and rebuilt damaged schools and houses.",
    ],
    impactSummary: "Mobilized 4,000+ volunteers; prevented epidemic breakout through immediate sanitation and mass rehabilitation.",
    verifiedSource: "Gujarat Government Relief Department & Indian Red Cross historical records (1979)",
  },
  {
    id: "covid-pandemic-2020-22",
    year: "2020–2022",
    location: "Pan-India (All States & UTs)",
    title: "COVID-19 Nationwide Crisis Response",
    category: "Epidemic / Health",
    facts: [
      "Operated 24/7 COVID isolation and care centers with dedicated doctor and nurse voluntary rotas across Indian cities.",
      "Distributed 8.5+ crore meal packets and 62+ lakh dry ration grocery kits to stranded migrant workers and daily wagers.",
      "Set up verified plasma donor registries, oxygen cylinder banks, and helpline assistance during the second wave.",
      "Conducted respectful, dignified last rites for over 25,000 COVID victims regardless of religious background when families were isolated.",
    ],
    impactSummary: "8.5 Crore+ meals served; 62 Lakh+ ration kits distributed; 2,500+ isolation centers managed nationwide.",
    verifiedSource: "National Disaster Relief documentation, Sewa Bharati national census (2020–2022)",
  },
  {
    id: "bhuj-earthquake-2001",
    year: "2001",
    location: "Bhuj, Kutch & Ahmedabad, Gujarat",
    title: "Gujarat Earthquake Rescue & Village Reconstruction",
    category: "Earthquake",
    facts: [
      "On 26 January 2001, a 7.7 magnitude earthquake flattened entire towns in Kutch and damaged structures across Ahmedabad.",
      "Swayamsevaks reached collapsed multi-storey buildings in Ahmedabad (e.g. Mansi Complex) and Kutch within 45 minutes.",
      "Set up instant 24/7 blood donation camps, field surgical aid, and relief distribution stations across Kutch.",
      "Rebuilt and adopted entire devastated villages such as Lodai and Chapreli with earthquake-resistant permanent housing.",
    ],
    impactSummary: "25,000+ volunteers engaged in rescue; adopted and rebuilt 10+ destroyed villages in Kutch.",
    verifiedSource: "NDMA case studies & International Red Cross Gujarat Earthquake report (2001)",
  },
  {
    id: "balasore-train-2023",
    year: "2023",
    location: "Bahanaga, Balasore, Odisha",
    title: "Balasore Triple Train Collision Rescue",
    category: "Railway",
    facts: [
      "On the night of 2 June 2023, the Coromandel Express, Bengaluru-Howrah Superfast, and a goods train collided at Bahanaga Bazar station.",
      "Over 1,200 local Swayamsevaks arrived at the remote dark crash site within an hour, assisting NDRF and local administration.",
      "Formed midnight human chains to extricate injured passengers from mangled bogies and carried them across track ballast to ambulances.",
      "Hundreds of volunteers queued at Balasore District Hospital overnight, donating over 500 units of blood in the first 12 hours.",
    ],
    impactSummary: "1,200+ first responders on site; 500+ units of emergency blood donated overnight at Balasore hospital.",
    verifiedSource: "Balasore District Administration & Odisha Blood Bank records (June 2023)",
  },
  {
    id: "kedarnath-floods-2013",
    year: "2013",
    location: "Uttarakhand (Kedarnath Valley)",
    title: "Uttarakhand Flash Floods & Himalayan Cloudburst",
    category: "Flood / Cyclone",
    facts: [
      "In June 2013, devastating cloudbursts caused catastrophic landslides and flash floods across the Mandakini and Alaknanda river valleys.",
      "Emergency relief camps established at Rishikesh, Dehradun, Rudraprayag, and Haridwar transit points.",
      "Distributed over 1,50,000 food and dry ration packets to stranded pilgrims and local villagers cut off by road collapse.",
      "Provided doctor teams, emergency medicines, phone booths for family contact, and assisted military evacuation teams.",
    ],
    impactSummary: "1.5 Lakh+ food packets distributed; 42 relief nodes established across Char Dham transit routes.",
    verifiedSource: "Uttarakhand State Emergency Operations Center & Sewa International reports (2013)",
  },
  {
    id: "odisha-cyclone-1999",
    year: "1999",
    location: "Coastal Odisha",
    title: "Odisha Super Cyclone Relief Operations",
    category: "Flood / Cyclone",
    facts: [
      "Category 5 Super Cyclone hit coastal Odisha on 29 October 1999 with 260 km/h winds and 7-meter storm surges.",
      "Utkal Bipanna Sahayata Samiti (UBSS) mobilized 10,000+ volunteers into waterlogged and cut-off coastal districts.",
      "Cleared thousands of blocked roads, restored drinking water wells, and operated round-the-clock emergency medical dispensaries.",
      "Built permanent multi-purpose cyclone shelters and vocational centers for orphan and widow rehabilitation.",
    ],
    impactSummary: "10,000+ relief workers deployed; continuous rehabilitation across 14 affected coastal districts.",
    verifiedSource: "Utkal Bipanna Sahayata Samiti & Odisha State Disaster Management Archives (1999–2000)",
  },
];


export interface JourneyStep {
  time: string;
  stepNumber: string;
  title: string;
  description: string;
  vibe: string;
}

export const journeySteps: JourneyStep[] = [
  {
    time: "4:00 PM",
    stepNumber: "01",
    title: "Arrival & Tribal Welcome",
    description: "Check-in with your verified digital QR pass, collect your Sangam badge, and soak in the electric atmosphere of folk instruments and youth delegations.",
    vibe: "Arrival Energy",
  },
  {
    time: "4:30 PM",
    stepNumber: "02",
    title: "Ground Games & Physical Agility",
    description: "Step onto the open field for high-intensity traditional Indian team sports. No spectator mode—everyone dives into group agility and coordination.",
    vibe: "High Adrenaline",
  },
  {
    time: "5:30 PM",
    stepNumber: "03",
    title: "Live Cultural & Martial Arts Showcase",
    description: "Dand-Yuddha (stick combat), Niyuddha (unarmed martial defense), Ghosh (rhythmic brass and percussion), and live theatre on unsung revolutionaries.",
    vibe: "Aesthetic Power",
  },
  {
    time: "6:15 PM",
    stepNumber: "04",
    title: "Yuva Samvaad — Unfiltered Keynote & Q&A",
    description: "Straightforward perspectives from leading youth thinkers and senior leadership. Direct audience mic handoffs—no sugarcoated corporate speeches.",
    vibe: "Intellectual Rigor",
  },
  {
    time: "7:15 PM",
    stepNumber: "05",
    title: "Action Commitments (Sankalp)",
    description: "Browse the 6 Nation-Building booths, meet project leads, and pick an actionable initiative to commit your skills to in the coming year.",
    vibe: "Purpose & Direction",
  },
  {
    time: "7:45 PM",
    stepNumber: "06",
    title: "Collective Unity Song (Prarthana) & Sahabhoj",
    description: "Singing the timeless national prayer in unison under the evening sky, followed by a shared fellowship community meal with everyone present.",
    vibe: "Deep Camaraderie",
  },
  {
    time: "8:00 PM+",
    stepNumber: "07",
    title: "Post-Sangam Fellowship & Network",
    description: "Informal conversations, exchange of contact info with fellow builders, and joining specialized Telegram/WhatsApp action workgroups.",
    vibe: "Lifelong Bonds",
  },
];

export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Participation" | "Organization" | "Logistics";
}

export const faqs: FAQItem[] = [
  {
    category: "General",
    question: "What exactly is Yuva Shakti Sangam?",
    answer: "Yuva Shakti Sangam is a high-energy, 4-hour physical gathering of youth aged 16 to 35 from diverse backgrounds. It is designed to move beyond lecture-heavy conferences and connect young people through traditional ground sports, cultural theatre, open dialogue (Samvaad), and direct nation-building commitments.",
  },
  {
    category: "Participation",
    question: "Is there any registration fee, and what is included?",
    answer: "The registration pass is ₹50 (nominal fee). Your pass includes an Official Delegate ID Card, High Tea & Refreshments, complete access to ground games arena, cultural drama performances, and open-floor participation in Yuva Samvaad.",
  },
  {
    category: "Participation",
    question: "Do I need to be an existing RSS member to attend?",
    answer: "Absolutely not. Yuva Shakti Sangam is specifically curated for any curious youth, college student, professional, or entrepreneur who cares about India's future—regardless of background, ideology, or previous familiarity with RSS.",
  },
  {
    category: "Participation",
    question: "Can I bring my friends or college group?",
    answer: "Yes, group participation is warmly encouraged. However, each friend must complete individual online registration so they receive their unique QR access pass.",
  },
  {
    category: "Organization",
    question: "What is the primary role of RSS in hosting this event?",
    answer: "Rashtriya Swayamsevak Sangh (RSS) provides the organizational framework, volunteer support, and ground discipline. As RSS approaches its centenary year (1925–2025), the focus is on enabling India's next generation to take direct ownership of national challenges.",
  },
  {
    category: "Logistics",
    question: "What should I wear? Is there a dress code?",
    answer: "Comfortable casual attire suitable for active movement (jeans/chinos and t-shirt/kurta, with comfortable sneakers/sports shoes). We will be participating in outdoor ground activities.",
  },
  {
    category: "Logistics",
    question: "Will refreshments and ID cards be provided?",
    answer: "Yes! All registered delegates will be provided with an Official Delegate ID Card upon check-in and complimentary High Tea & Refreshments during the event.",
  },
  {
    category: "Logistics",
    question: "Where is the exact venue located?",
    answer: "The event is hosted at Shree Saurashtra Patel Samaj Maninagar (Isanpur Rd, Chandranagar Society, Basant Nagar, Maninagar, Ahmedabad, Gujarat). It is easily accessible via Ahmedabad Metro and BRTS.",
  },
];
