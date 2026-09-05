export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "The Big Idea", href: "#big-idea" },
  { label: "Dignitaries", href: "#chief-guest" },
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
    title: "Yuva Samvaad — Addresses by Rupesh Makwana & Nidhi Mehta",
    description: "Inspirational addresses by Chief Guest Rupesh Makwana (Guinness Record Holder) and Guest of Honor Nidhi Mehta (National Yoga Player) on endurance, yogic resilience, and character building, followed by open-floor Q&A.",
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
    answer: "The registration pass is ₹50 (nominal fee). Your pass includes an Official Delegate ID Card, High Tea & Refreshments, Official E-Certificate of Participation, complete access to ground games arena, cultural drama performances, and open-floor participation in Yuva Samvaad.",
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
    question: "Will refreshments, ID cards, and certificates be provided?",
    answer: "Yes! All registered delegates will be provided with an Official Delegate ID Card upon check-in, complimentary High Tea & Refreshments during the event, and an Official Verifiable E-Certificate of Participation.",
  },
  {
    category: "Logistics",
    question: "Where is the exact venue located?",
    answer: "The event is hosted at Shree Saurashtra Patel Samaj Maninagar (Isanpur Rd, Chandranagar Society, Basant Nagar, Maninagar, Ahmedabad, Gujarat). It is easily accessible via Ahmedabad Metro and BRTS.",
  },
];

export interface ChiefGuestRecord {
  id: string;
  badge: string;
  title: string;
  metric: string;
  description: string;
  year: string;
  iconName: string;
}

export interface ChiefGuestInitiative {
  id: string;
  title: string;
  titleGujarati: string;
  tagline: string;
  description: string;
  image: string;
  impactTag: string;
}

export interface ChiefGuestGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: "Award" | "Record" | "Seva" | "Poster";
}

export interface ChiefGuestData {
  name: string;
  nameGujarati: string;
  title: string;
  titleGujarati: string;
  location: string;
  mottoGujarati: string;
  mottoEnglish: string;
  missionStatement: string;
  missionSince: string;
  coachingCredentials: string;
  bioSummary: string;
  keyStats: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  awards: string[];
  records: ChiefGuestRecord[];
  initiatives: ChiefGuestInitiative[];
  gallery: ChiefGuestGalleryItem[];
}

export const chiefGuestData: ChiefGuestData = {
  name: "Rupesh Makwana",
  nameGujarati: "રૂપેશ મકવાણા",
  title: "Guinness World Record Holder, National Athlete & Coach",
  titleGujarati: "ગિનીસ વર્લ્ડ રેકોર્ડ હોલ્ડર, રાષ્ટ્રીય એથ્લેટ અને કોચ",
  location: "Ahmedabad, Gujarat",
  mottoGujarati: "મારો સંકલ્પ રાષ્ટ્ર પ્રથમ",
  mottoEnglish: "My Resolution: Nation First",
  missionStatement: "Working for Nation's Youth & Leading the 'SAVE YOUTH SAVE NATION' movement to cultivate fitness, character, discipline, and addiction-free youth.",
  missionSince: "2017",
  coachingCredentials: "NSNIS Patiala 6-Week Diploma in Sports Coaching (Netaji Subhash National Institute of Sports, 2021)",
  bioSummary: "Rupesh Makwana is a trailblazing ultra-endurance athlete and dedicated sports coach from Ahmedabad who etched India's name into the Guinness Book of World Records by traversing the massive 6,000 km Golden Quadrilateral on foot in just 88 days. Beyond world records, he embodies true Rashtra Seva—having trained hundreds of underprivileged youths for free since 2018 and educating slum children with the timeless wisdom of the Bhagavad Gita.",
  keyStats: [
    {
      value: "6,000 KM",
      label: "Guinness World Record",
      sublabel: "Golden Quadrilateral on foot in 88 days",
    },
    {
      value: "75 Hours",
      label: "Non-Stop Marathon",
      sublabel: "375 km for Azadi Ka Amrit Mahotsav",
    },
    {
      value: "1,000 KM",
      label: "Ahmedabad to Delhi",
      sublabel: "Nasha Mukti & Youth Awareness Run",
    },
    {
      value: "Since 2018",
      label: "Free Youth Coaching",
      sublabel: "Empowering underprivileged aspirants",
    },
  ],
  awards: [
    "Gujarat Gaurav Ratna Award",
    "Guinness Book of World Records Holder",
    "World Book of Records Holder",
    "India Book of Records Holder",
    "3-Time National Cross Country Player",
  ],
  records: [
    {
      id: "guinness-6000km",
      badge: "Guinness World Record (2023)",
      title: "Fastest Travel of Indian Golden Quadrilateral on Foot (Male)",
      metric: "6,000 KM in 88 Days 1 Hr 28 Sec",
      year: "2023",
      iconName: "Trophy",
      description: "Officially verified Guinness World Record: Covered Delhi – Mumbai – Chennai – Kolkata – Delhi on foot from 21 Feb 2023 to 20 May 2023.",
    },
    {
      id: "world-book-75hrs",
      badge: "World & India Book of Records",
      title: "Longest Non-Stop Marathon for 75 Years of Independence",
      metric: "75 Hours Non-Stop (375 KM)",
      year: "2022/2023",
      iconName: "Flame",
      description: "Non-stop running marathon for 75 continuous hours covering 375 km from Ahmedabad to Pal to celebrate Azadi Ka Amrit Mahotsav.",
    },
    {
      id: "ahmedabad-delhi-1000k",
      badge: "National Awareness Run",
      title: "Ahmedabad to Delhi Youth De-addiction & Fitness Run",
      metric: "1,000 KM",
      year: "2018",
      iconName: "Zap",
      description: "1,000 km run carrying the message of drug-free youth ('Nasha Mukti'). Personally lauded by Union Minister Dr. Mansukh Mandaviya in New Delhi.",
    },
    {
      id: "bhilwara-1000k",
      badge: "Endurance Expedition",
      title: "Run Across Bhilwara, Rajasthan",
      metric: "1,000 KM",
      year: "2020",
      iconName: "Compass",
      description: "Endurance run across Bhilwara district in Rajasthan promoting health, endurance, and youth self-reliance.",
    },
    {
      id: "city-100k",
      badge: "Ultra Distance",
      title: "100 KM Non-Stop City Runs across Ahmedabad",
      metric: "100 KM in 10h 17m",
      year: "2017 & 2023",
      iconName: "Clock",
      description: "Clocked 100 km across Ahmedabad in 11:00 hrs (2017) and improved to a lightning 10 hrs 17 mins in 2023.",
    },
    {
      id: "tata-ultra-50k",
      badge: "National Ultra Finisher",
      title: "TATA Ultra Marathon 50 KM Finisher",
      metric: "50 KM in 4:59:00",
      year: "2024",
      iconName: "Medal",
      description: "Successfully finished the demanding Tata Ultra Marathon 50 KM in under 5 hours (4:59:00).",
    },
    {
      id: "national-athlete",
      badge: "National Level",
      title: "3-Time National Player in Cross Country",
      metric: "3x National Athlete",
      year: "Career",
      iconName: "Award",
      description: "Represented Gujarat in national cross-country championships, competing against top athletes across India.",
    },
  ],
  initiatives: [
    {
      id: "free-youth-training",
      title: "Free Athletic & Physical Training for Underprivileged Youth",
      titleGujarati: "ગરીબ અને આર્થિક રીતે નબળા યુવાનો માટે નિઃશુલ્ક શારીરિક તાલીમ",
      tagline: "Building Future Soldiers, Police Officers & Champions",
      description: "Since 2018, Rupesh Makwana has been providing intensive physical fitness coaching free of cost to young men and women whose families cannot afford private academies. Many students have successfully entered defense and police forces.",
      image: "/images/chief-guest/youth-training.jpg",
      impactTag: "Free Coaching Since 2018",
    },
    {
      id: "slum-education-gita",
      title: "Education & Bhagvat Gita Gyan for Slum Children",
      titleGujarati: "ઝૂંપડપટ્ટીના બાળકો માટે શિક્ષણ અને શ્રીમદ્ ભગવદ્ ગીતા જ્ઞાન",
      tagline: "Character Building at the Grassroots",
      description: "Empowering children in slum settlements near Dastan Circle, Naroda (Ahmedabad) by providing primary education, literacy support, nutritious snacks, and teaching sacred Bhagavad Gita shlokas and ethical values.",
      image: "/images/chief-guest/slum-education.jpg",
      impactTag: "Dastan Circle, Naroda",
    },
    {
      id: "save-youth-save-nation",
      title: "'Save Youth Save Nation' & Drug-Free Bharat Campaign",
      titleGujarati: "'સેવ યુથ સેવ નેશન' અને નશા મુક્ત ભારત અભિયાન",
      tagline: "Channelizing Youth Energy Toward Nation Building",
      description: "Leading an anti-addiction and mental wellness crusade since 2017. Using marathons, school sessions, and public rallies to warn youth about substance abuse and inspire daily fitness routines.",
      image: "/images/chief-guest/minister-meeting.jpg",
      impactTag: "Nationwide Movement Since 2017",
    },
  ],
  gallery: [
    {
      id: "poster",
      title: "Official Chief Guest Poster",
      subtitle: "Yuva Shakti Sangam Maninagar Announcement",
      image: "/images/chief-guest/rupesh-makwana-poster.png",
      category: "Poster",
    },
    {
      id: "guinness-record",
      title: "Guinness World Record & Gujarat Gaurav Ratna",
      subtitle: "6,000 km Golden Quadrilateral on Foot",
      image: "/images/chief-guest/guinness-record-award.png",
      category: "Record",
    },
    {
      id: "world-certificates",
      title: "World Book & India Book of Records Certificates",
      subtitle: "75 Hours Continuous Non-Stop Marathon",
      image: "/images/chief-guest/world-record-certificates.png",
      category: "Record",
    },
    {
      id: "recognition",
      title: "National Recognition & Minister Felicitation",
      subtitle: "Commendation by Union Minister Dr. Mansukh Mandaviya",
      image: "/images/chief-guest/records-recognition.png",
      category: "Award",
    },
    {
      id: "social-work",
      title: "Grassroots Seva & Slum Education Initiatives",
      subtitle: "Free Fitness Coaching & Bhagvat Gita Classes",
      image: "/images/chief-guest/social-work-initiatives.png",
      category: "Seva",
    },
    {
      id: "award-ceremony",
      title: "Gujarat Gaurav Ratna Award Ceremony",
      subtitle: "Honored on Stage for Exemplary Feats",
      image: "/images/chief-guest/award-stage.jpg",
      category: "Award",
    },
  ],
};

export interface GuestOfHonorRecord {
  id: string;
  badge: string;
  title: string;
  metric: string;
  description: string;
  year: string;
  iconName: string;
}

export interface GuestOfHonorInitiative {
  id: string;
  title: string;
  titleGujarati: string;
  tagline: string;
  description: string;
  image: string;
  impactTag: string;
}

export interface GuestOfHonorGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: "Award" | "Record" | "Seva" | "Poster";
}

export interface GuestOfHonorData {
  name: string;
  nameGujarati: string;
  role: string;
  roleGujarati: string;
  title: string;
  titleGujarati: string;
  location: string;
  mottoGujarati: string;
  mottoEnglish: string;
  missionStatement: string;
  bioSummary: string;
  keyStats: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  awards: string[];
  records: GuestOfHonorRecord[];
  initiatives: GuestOfHonorInitiative[];
  gallery: GuestOfHonorGalleryItem[];
}

export const guestOfHonorData: GuestOfHonorData = {
  name: "Nidhi Mehta",
  nameGujarati: "નિધિ મહેતા",
  role: "Guest of Honor",
  roleGujarati: "સન્માનિત અતિથિ વિશેષ",
  title: "National Yoga Player & Founder of Nidhi's Yoga Hub",
  titleGujarati: "રાષ્ટ્રીય યોગ ખેલાડી અને સંસ્થાપક - નિધિ'સ યોગ હબ",
  location: "Maninagar, Ahmedabad",
  mottoGujarati: "યોગઃ કર્મસુ કૌશલમ્ • સ્વસ્થ યુવા, સશક્ત ભારત",
  mottoEnglish: "Excellence in Action • Healthy Youth, Strong Nation",
  missionStatement: "Cultivating mental resilience, breath mastery, physical agility, and inner balance among youth through the timeless science of traditional Yoga and Pranayama.",
  bioSummary: "Nidhi Mehta is an acclaimed National Yoga Player and the visionary founder of Nidhi's Yoga Hub, with its flagship academy based right here in Maninagar, Ahmedabad. Conferred the prestigious Yoga Professional Young Star Award in 2019, she has trained more than 10,000 students, youth leaders, and aspiring instructors in traditional Hatha, Ashtanga Vinyasa, aerial yoga, and therapeutic healing. She champions youth wellness, breath awareness, and mental resilience as foundational pillars for modern nation-building.",
  keyStats: [
    {
      value: "National",
      label: "Yoga Player 🇮🇳",
      sublabel: "Represented Gujarat in national championships",
    },
    {
      value: "2019",
      label: "Young Star Award",
      sublabel: "Yoga Professional Excellence Winner",
    },
    {
      value: "10,000+",
      label: "Youth & Students",
      sublabel: "Trained across workshops & mass camps",
    },
    {
      value: "Maninagar",
      label: "Flagship Studio",
      sublabel: "Leading wellness hub in Ahmedabad",
    },
  ],
  awards: [
    "National Yoga Player 🇮🇳",
    "Yoga Professional Young Star Award 2019 Winner",
    "Founder & Master Trainer, Nidhi's Yoga Hub",
    "Pioneer in Hatha, Ashtanga & Therapeutic Yoga",
    "Certified Yoga Teacher Trainer & Youth Mentor",
  ],
  records: [
    {
      id: "national-yoga-player",
      badge: "National Level Athlete",
      title: "National Yoga Player Representing Gujarat",
      metric: "National Player 🇮🇳",
      year: "Competitive Career",
      iconName: "Medal",
      description: "Competed at national championship stages across India, displaying extraordinary yogic asana mastery, physical control, flexibility, and precision representing Gujarat.",
    },
    {
      id: "young-star-award-2019",
      badge: "State & National Honor",
      title: "Yoga Professional Young Star Award Winner",
      metric: "2019 Award Winner",
      year: "2019",
      iconName: "Trophy",
      description: "Bestowed with the prestigious Yoga Professional Young Star Award 2019 in recognition of exceptional contribution to youth wellness, yogic education, and professional coaching.",
    },
    {
      id: "nidhis-yoga-hub-founded",
      badge: "Pioneering Academy",
      title: "Founder & Director — Nidhi's Yoga Hub",
      metric: "Est. 2016 • Maninagar",
      year: "2016 – Present",
      iconName: "Flame",
      description: "Founded Nidhi's Yoga Hub, expanding across key Ahmedabad centers including Maninagar, Gota, Shyamal, and Naranpura, bringing holistic yogic education to thousands.",
    },
    {
      id: "mass-riverfront-camps",
      badge: "Mass Community Movement",
      title: "Mass Riverfront & Public Yoga Gatherings",
      metric: "Hundreds in Synchronized Practice",
      year: "Ongoing Movement",
      iconName: "Zap",
      description: "Spearheading massive outdoor morning yoga and pranayama sessions along the Sabarmati Riverfront and community grounds, inspiring citizens of all ages to embrace daily sadhana.",
    },
    {
      id: "teacher-training-leadership",
      badge: "Youth Skill Empowerment",
      title: "Certified Yoga Teacher Training Courses (TTC)",
      metric: "Youth Mentorship",
      year: "Professional Career",
      iconName: "Award",
      description: "Mentoring and qualifying young women and men as certified yoga coaches, unlocking economic self-reliance and career avenues in the global wellness industry.",
    },
  ],
  initiatives: [
    {
      id: "riverfront-mass-yoga",
      title: "Large-Scale Public & Riverfront Yoga Gatherings",
      titleGujarati: "જાહેર મેદાનો અને રિવરફ્રન્ટ પર સામૂહિક યોગ અભિયાન",
      tagline: "Connecting Breath, Movement & Community Fellowship",
      description: "Leading hundreds of participants in synchronized Pranayama (Anulom-Vilom, Kapalbhati, Bhastrika) and Surya Namaskar along Ahmedabad's Sabarmati Riverfront, promoting preventive health and collective youth energy.",
      image: "/images/guest-of-honour/yoga-session.jpg",
      impactTag: "Mass Riverfront Sessions",
    },
    {
      id: "nidhis-yoga-hub-academy",
      title: "Nidhi's Yoga Hub — Authentic Yogic Science Academy",
      titleGujarati: "નિધિ'સ યોગ હબ — પારંપરિક અને આધુનિક યોગ સાધના કેન્દ્ર",
      tagline: "Flagship Academy in Maninagar (Ahmedabad)",
      description: "Specialized training center providing systematic Hatha Yoga, dynamic Ashtanga Vinyasa, aerial/rope yoga, and therapeutic sessions for injury rehab, postural correction, and lifestyle disorder prevention.",
      image: "/images/guest-of-honour/portrait.jpg",
      impactTag: "Maninagar, Gota & Shyamal",
    },
    {
      id: "youth-mental-resilience",
      title: "Youth Mind-Body Discipline & Anti-Burnout Workshops",
      titleGujarati: "યુવા માનસિક શક્તિ, એકાગ્રતા અને તણાવ નિયંત્રણ કાર્યક્રમો",
      tagline: "Empowering Students to Beat Anxiety & Build Stamina",
      description: "Dedicated workshops for college students and working professionals to counter screen fatigue, academic anxiety, and stress through targeted breathwork, mindful asanas, and mental equanimity.",
      image: "/images/guest-of-honour/announcement.png",
      impactTag: "Youth Wellness Movement",
    },
  ],
  gallery: [
    {
      id: "official-announcement",
      title: "Official Guest of Honor Poster",
      subtitle: "National Yoga Player Nidhi Mehta • Yuva Shakti Sangam",
      image: "/images/guest-of-honour/announcement.png",
      category: "Poster",
    },
    {
      id: "portrait-pose",
      title: "Yogic Posture & Padmasana Demonstration",
      subtitle: "Nidhi Mehta — Founder of Nidhi's Yoga Hub",
      image: "/images/guest-of-honour/portrait.jpg",
      category: "Award",
    },
    {
      id: "riverfront-camp",
      title: "Mass Yoga Gathering at Ahmedabad Riverfront",
      subtitle: "Leading Hundreds in Synchronized Pranayama & Meditation",
      image: "/images/guest-of-honour/yoga-session.jpg",
      category: "Seva",
    },
  ],
};
