export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "The Big Idea", href: "#big-idea" },
  { label: "Why Attend", href: "#why-attend" },
  { label: "Experience", href: "#experience" },
  { label: "Action Areas", href: "#what-can-you-do" },
  { label: "Samvaad", href: "#samvaad" },
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
    tagline: "Play, participate and engage.",
    description: "Immerse in high-energy ground games, patriotic theatrical expressions, and dynamic group simulations designed to test teamwork and creativity.",
    action: "Physical participation & collective energy",
  },
  {
    number: "04",
    title: "ACT",
    tagline: "Turn ideas into action.",
    description: "Channel personal potential into measurable societal impact. Discover structured avenues in technology, education, social service, and leadership.",
    action: "Tangible contribution & nation-building",
  },
];

export interface ExperienceItem {
  icon: string;
  title: string;
  badge: string;
  description: string;
  highlights: string[];
}

export const experiences: ExperienceItem[] = [
  {
    icon: "Gamepad2",
    title: "On-Ground Games & Team Challenges",
    badge: "ENERGY & STRATEGY",
    description: "High-octane physical challenges, collective coordination games, and problem-solving arenas crafted to break ice and spark team cohesion.",
    highlights: ["Collaborative physical games", "Strategy & speed challenges", "Zero spectators — everyone plays"],
  },
  {
    icon: "Drama",
    title: "Desh Bhakti Drama & Theatrical Expression",
    badge: "CULTURE & EMOTION",
    description: "A stirring live performance capturing the spirit of youth sacrifice, historic resilience, and modern civic responsibility in contemporary Bharat.",
    highlights: ["Live theatrical production", "Evocative original script", "Inspiring youth narrative"],
  },
  {
    icon: "MessageSquareText",
    title: "Yuva Samvaad (Open Youth Dialogue)",
    badge: "QUESTIONS & CLARITY",
    description: "Unfiltered, interactive conversation. Bring your toughest questions about society, culture, national development, and youth leadership.",
    highlights: ["Direct Q&A format", "No scripted speeches", "Intellectual curiosity welcomed"],
  },
  {
    icon: "Flag",
    title: "Nation Building Action Lab",
    badge: "PURPOSE & IMPACT",
    description: "Explore real pathways where young engineers, entrepreneurs, artists, educators, and social volunteers are already transforming grassroots India.",
    highlights: ["Domain-specific showcases", "Direct mentorship links", "Action-oriented frameworks"],
  },
  {
    icon: "Users",
    title: "Youth Community & Networking",
    badge: "FELLOWSHIP & COLLABORATION",
    description: "Connect with hundreds of passionate youths from Ahmedabad and across Gujarat who share your hunger for purpose and national pride.",
    highlights: ["Cross-disciplinary connections", "Informal idea exchanges", "Lasting peer networks"],
  },
];

export interface ActionDomain {
  id: string;
  title: string;
  hindiWord: string;
  actionWord: string;
  shortDesc: string;
  expandedDetails: {
    focus: string;
    howToContribute: string[];
    impact: string;
  };
}

export const actionDomains: ActionDomain[] = [
  {
    id: "tech",
    title: "TECHNOLOGY",
    hindiWord: "तकनीक",
    actionWord: "Build.",
    shortDesc: "Architect indigenous digital public infrastructure, AI tools, and accessible tech solutions for grassroots Bharat.",
    expandedDetails: {
      focus: "Digital sovereignty, rural digital access, language tech, and cybersecurity.",
      howToContribute: [
        "Develop open-source tools for local governance and education",
        "Empower rural artisans with direct e-commerce connectivity",
        "Teach basic digital literacy in underserved urban pockets"
      ],
      impact: "Closing the digital divide and asserting technological self-reliance."
    }
  },
  {
    id: "edu",
    title: "EDUCATION",
    hindiWord: "शिक्षा",
    actionWord: "Empower.",
    shortDesc: "Democratize foundational learning, skill development, and values-based education for every child.",
    expandedDetails: {
      focus: "Ekal Vidyalaya models, remedial coaching, and career mentoring.",
      howToContribute: [
        "Volunteer weekly tutoring in neighborhood community centers",
        "Mentor high school students on modern career opportunities",
        "Curate multilingual educational content and study materials"
      ],
      impact: "Igniting curiosity and equipping future generations with capability."
    }
  },
  {
    id: "biz",
    title: "ENTREPRENEURSHIP",
    hindiWord: "उद्यमिता",
    actionWord: "Create.",
    shortDesc: "Build sustainable social enterprises, generate localized jobs, and foster economic self-reliance (Swadeshi).",
    expandedDetails: {
      focus: "Micro-enterprises, rural livelihoods, and sustainable supply chains.",
      howToContribute: [
        "Mentor budding grassroots entrepreneurs on financial planning",
        "Innovate affordable products addressing local community pain points",
        "Support self-help groups (SHGs) with branding and distribution"
      ],
      impact: "Decentralized economic resilience and dignified employment."
    }
  },
  {
    id: "env",
    title: "ENVIRONMENT",
    hindiWord: "पर्यावरण",
    actionWord: "Protect.",
    shortDesc: "Lead ecological restoration through tree plantation, water conservation, and plastic-free living.",
    expandedDetails: {
      focus: "Paryavaran Sanrakshan, urban biodiversity, and watershed care.",
      howToContribute: [
        "Participate in urban micro-forest (Miyawaki) initiatives",
        "Drive rainwater harvesting awareness in residential colonies",
        "Organize neighborhood lake and water-body cleanup drives"
      ],
      impact: "Harmonizing urban growth with environmental stewardship."
    }
  },
  {
    id: "seva",
    title: "SEVA",
    hindiWord: "सेवा",
    actionWord: "Serve.",
    shortDesc: "Step forward in moments of disaster, support healthcare outreach, and uplift vulnerable communities without bias.",
    expandedDetails: {
      focus: "Disaster management training, blood donation networks, and health camps.",
      howToContribute: [
        "Join trained emergency first-response volunteer teams",
        "Support free medical screening camps in slum settlements",
        "Mobilize relief supplies and logistics during natural calamities"
      ],
      impact: "Unconditional community support when it matters most."
    }
  },
  {
    id: "lead",
    title: "LEADERSHIP",
    hindiWord: "नेतृत्व",
    actionWord: "Take Responsibility.",
    shortDesc: "Lead by personal discipline, ethical conviction, and uniting diverse sections of society for the greater good.",
    expandedDetails: {
      focus: "Social harmony (Samajik Samarasata), civic duties, and youth leadership.",
      howToContribute: [
        "Organize local civic awareness and voter participation camps",
        "Promote social inclusion and eliminate caste barriers in daily life",
        "Mentor youth peer groups in physical fitness and character building"
      ],
      impact: "A cohesive, self-confident, and united societal fabric."
    }
  },
];

export interface TimelineMilestone {
  year: string;
  title: string;
  tag: string;
  description: string;
  context: string;
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    year: "1925",
    title: "Foundation & Vision",
    tag: "ORIGIN",
    description: "Founded on Vijayadashami in Nagpur by Dr. Keshav Baliram Hedgewar with the vision of character-building, societal discipline, and uniting citizens above distinctions.",
    context: "A quiet movement centered around daily Shakhas for physical fitness, moral grounding, and selfless service."
  },
  {
    year: "1947",
    title: "Partition Relief & National Support",
    tag: "SERVICE IN CRISIS",
    description: "Mobilized extensive volunteer networks to operate refugee relief camps, provide food, medical aid, and shelter to millions displaced during Partition.",
    context: "Demonstrated early capacity for rapid, disciplined humanitarian response."
  },
  {
    year: "1962",
    title: "Civil Defense During War",
    tag: "CIVIC DUTY",
    description: "Volunteers actively supported civil defense, maintained internal supply lines, and assisted law enforcement during the Indo-China war at national request.",
    context: "Recognized for civilian discipline, leading to participation in the 1963 Republic Day Parade."
  },
  {
    year: "1971",
    title: "National Defense & Refugee Relief",
    tag: "HUMANITARIAN SERVICE",
    description: "Assisted border logistics, organized massive blood donation drives, and managed humanitarian camps for displaced refugees during the Bangladesh Liberation War.",
    context: "Coordinated volunteer efforts alongside district administrations across western and eastern frontiers."
  },
  {
    year: "1975–77",
    title: "Defense of Democratic Freedoms",
    tag: "CONSTITUTIONAL RESILIENCE",
    description: "Played an integral role in the underground movement for the restoration of fundamental rights and democratic liberties during the 21-month Emergency period.",
    context: "Thousands endured imprisonment peacefully under MISA to defend civil liberties."
  },
  {
    year: "2001",
    title: "Gujarat Earthquake Disaster Relief",
    tag: "CRITICAL RESCUE",
    description: "First responders on the ground in Kutch and Ahmedabad within hours of the devastating 7.7 earthquake, conducting rescue, debris clearance, and long-term rehabilitation.",
    context: "Set up community kitchens, field hospitals, and rebuilt devastated village schools."
  },
  {
    year: "TODAY",
    title: "Contemporary Grassroots Nation Building",
    tag: "EXPANDING REACH",
    description: "A nationwide fabric of over 150,000+ service projects run by affiliated trusts in education (Vidya Bharati, Ekal Vidyalaya), healthcare, tribal empowerment (Vanvasi Kalyan Ashram), and environmental conservation.",
    context: "Inspiring millions of everyday citizens to volunteer their time and skills for self-reliant India."
  }
];

export interface JourneyStep {
  step: string;
  title: string;
  hindi: string;
  time: string;
  description: string;
}

export const journeySteps: JourneyStep[] = [
  {
    step: "01",
    title: "ARRIVE",
    hindi: "आगमन",
    time: "3:45 PM",
    description: "Check in at the venue in Maninagar, receive your Sangam kit, and step into the high-energy campus atmosphere."
  },
  {
    step: "02",
    title: "CONNECT",
    hindi: "संवाद व परिचय",
    time: "4:00 PM",
    description: "Meet fellow participants, break the ice through informal community circles, and find your cohort."
  },
  {
    step: "03",
    title: "PLAY",
    hindi: "मैदानी खेल",
    time: "4:30 PM",
    description: "Immerse in curated on-ground team games designed for physical vitality, tactical coordination, and team spirit."
  },
  {
    step: "04",
    title: "EXPERIENCE",
    hindi: "नाट्य प्रस्तुति",
    time: "5:30 PM",
    description: "Witness a stirring live Desh Bhakti drama highlighting youth power, historic valor, and societal duties."
  },
  {
    step: "05",
    title: "SAMVAAD",
    hindi: "युवा संवाद",
    time: "6:15 PM",
    description: "Engage in an open, two-way dialogue on modern challenges, societal questions, and India's global role."
  },
  {
    step: "06",
    title: "THINK",
    hindi: "मंथन",
    time: "7:15 PM",
    description: "Reflect on personal capabilities and explore how your domain skills align with urgent national needs."
  },
  {
    step: "07",
    title: "ACT",
    hindi: "संकल्प व कर्म",
    time: "7:45 PM",
    description: "Take the Sangam Sankalp and step out with tangible volunteer pathways, mentorship links, and purpose."
  }
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Who can attend Yuva Shakti Sangam?",
    answer: "The event is open to all students, young professionals, entrepreneurs, creators, and civic-minded youths aged 16 to 35 residing in or visiting Ahmedabad/Gujarat."
  },
  {
    question: "Is there any registration fee?",
    answer: "No, entry to Yuva Shakti Sangam is completely free. However, prior registration via Luma is mandatory for entry and logistics planning."
  },
  {
    question: "What is the dress code and what should I bring?",
    answer: "Comfortable casual or ethnic attire suitable for physical ground games and evening outdoor seating. Please carry a valid digital/printed Luma registration pass and your photo ID."
  },
  {
    question: "Is this a political rally or party event?",
    answer: "No. Yuva Shakti Sangam is a cultural, social, and youth gathering focused on character building, open dialogue (Samvaad), team sports, and nation-building initiatives."
  },
  {
    question: "When will the exact venue address in Maninagar be shared?",
    answer: "The precise venue location in Maninagar will be sent directly to all registered attendees via their Luma confirmation email and SMS updates well ahead of 6 September 2026."
  },
  {
    question: "Can I bring my friends or college group?",
    answer: "Yes, absolutely! Each friend should register individually on Luma to ensure their pass is generated."
  }
];
