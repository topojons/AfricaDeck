import { useState, useEffect } from "react";
import {
  Shield, Globe, TrendingUp, Cloud, Activity,
  AlertTriangle, Zap, Newspaper, Heart,
  BarChart3, MapPin, Eye, RefreshCw,
  ChevronDown, ChevronUp, Clock, Users,
  DollarSign, Droplets, Wind,
  Anchor, Bell, Search, Menu, X,
  Landmark, Building2, Flag
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ─── CONSTANTS ──────────────────────────────────────────
const SEVERITY_COLORS = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };
const PARTY_COLORS = { APC: "#1e40af", PDP: "#dc2626", LP: "#16a34a", NNPP: "#9333ea", APGA: "#ca8a04", ADC: "#0891b2", SDP: "#be185d", YPP: "#ea580c" };

// ─── UTILITY FUNCTIONS ──────────────────────────────────
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomBetween(min, max));
const timeAgo = (minutes) => {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

// ─── DATA GENERATORS ────────────────────────────────────
const generateSecurityEvents = () => [
  { id: 0, state: "Borno", lga: "Maiduguri", type: "Boko Haram Attack", severity: "critical", casualties: randomInt(3, 20), displaced: randomInt(500, 5000), description: "Insurgent attack on military checkpoint along Maiduguri-Konduga road", responders: "Nigerian Army 7th Division", source: "Military Sources", lat: 11.84, lng: 13.16, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 1, state: "Zamfara", lga: "Anka", type: "Banditry", severity: "critical", casualties: randomInt(5, 30), displaced: randomInt(200, 3000), description: "Armed bandits raid farming communities, livestock stolen", responders: "Joint Military Task Force", source: "Local Officials", lat: 12.1, lng: 5.93, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 2, state: "Kaduna", lga: "Birnin Gwari", type: "Kidnapping", severity: "high", casualties: randomInt(0, 5), displaced: randomInt(50, 500), description: "Mass abduction of travelers on Kaduna-Abuja highway", responders: "DSS / Police", source: "Reuters", lat: 10.67, lng: 6.58, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 3, state: "Benue", lga: "Guma", type: "Farmer-Herder Clash", severity: "high", casualties: randomInt(2, 15), displaced: randomInt(300, 2000), description: "Armed herders attack farming settlement in Guma LGA", responders: "Operation Whirl Stroke", source: "AFP", lat: 7.87, lng: 8.72, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 4, state: "Rivers", lga: "Obio-Akpor", type: "Cultism / Gang Violence", severity: "medium", casualties: randomInt(1, 8), displaced: randomInt(20, 200), description: "Rival cult group clashes in Rumuokoro area", responders: "Rivers State Police Command", source: "Local Media", lat: 4.85, lng: 7.02, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 5, state: "Plateau", lga: "Jos South", type: "Communal Violence", severity: "high", casualties: randomInt(3, 12), displaced: randomInt(200, 1500), description: "Inter-communal tensions escalate after market dispute", responders: "STF / Operation Safe Haven", source: "ACLED", lat: 9.85, lng: 8.88, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 6, state: "Imo", lga: "Orlu", type: "IPOB / ESN Activity", severity: "medium", casualties: randomInt(0, 5), displaced: randomInt(50, 300), description: "Unknown gunmen attack police station and INEC office", responders: "Joint Security Forces", source: "Local Media", lat: 5.8, lng: 7.03, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 7, state: "Niger", lga: "Shiroro", type: "Banditry", severity: "critical", casualties: randomInt(5, 25), displaced: randomInt(500, 4000), description: "Bandits attack mining site, workers abducted", responders: "Air Force / Ground Troops", source: "Military Sources", lat: 10.0, lng: 6.2, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 8, state: "Katsina", lga: "Jibia", type: "Cross-border Incursion", severity: "high", casualties: randomInt(2, 10), displaced: randomInt(300, 2000), description: "Armed groups from Niger Republic attack border communities", responders: "Nigerian Army / Immigration", source: "AFP", lat: 13.08, lng: 7.23, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 9, state: "Lagos", lga: "Ikorodu", type: "Pipeline Vandalism", severity: "medium", casualties: randomInt(0, 3), displaced: 0, description: "Illegal oil bunkering and pipeline explosion in Ikorodu", responders: "NSCDC / Fire Service", source: "NNPC", lat: 6.6, lng: 3.51, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 10, state: "Delta", lga: "Warri South", type: "Oil Theft / Militancy", severity: "medium", casualties: randomInt(0, 4), displaced: randomInt(10, 100), description: "Illegal refinery discovered, JTF conducts raid", responders: "JTF / NSCDC", source: "Local Media", lat: 5.52, lng: 5.76, time: randomInt(1, 720), verified: Math.random() > 0.3 },
  { id: 11, state: "Taraba", lga: "Wukari", type: "Ethnic Violence", severity: "high", casualties: randomInt(3, 15), displaced: randomInt(500, 3000), description: "Jukun-Tiv conflict resurfaces after land dispute", responders: "Military / Police", source: "ACLED", lat: 7.87, lng: 9.78, time: randomInt(1, 720), verified: Math.random() > 0.3 },
];

const generateElectionData = () => ({
  upcoming: [
    { election: "Governorship Election", state: "Ondo", date: "Nov 16, 2025", status: "INEC Preparations", registeredVoters: "1.82M", candidates: [
      { name: "Lucky Aiyedatiwa", party: "APC", color: PARTY_COLORS.APC },
      { name: "Agboola Ajayi", party: "PDP", color: PARTY_COLORS.PDP },
      { name: "Olusola Ebiseni", party: "LP", color: PARTY_COLORS.LP },
    ]},
    { election: "Governorship Election", state: "Anambra", date: "Nov 6, 2025", status: "Campaign Period", registeredVoters: "2.45M", candidates: [
      { name: "Chukwuma Umeoji", party: "APC", color: PARTY_COLORS.APC },
      { name: "Valentine Ozigbo", party: "PDP", color: PARTY_COLORS.PDP },
      { name: "Charles Soludo (Inc.)", party: "APGA", color: PARTY_COLORS.APGA },
    ]},
    { election: "Local Government Elections", state: "Nationwide", date: "Q2 2026", status: "Planning Phase", registeredVoters: "93.4M", candidates: [] },
  ],
  recentResults: [
    { election: "2023 Presidential", winner: "Bola Ahmed Tinubu", party: "APC", votes: "8,794,726", percentage: "36.6%", turnout: "26.7%", margin: "2.1M votes" },
    { election: "2024 Edo Governorship", winner: "Monday Okpebholo", party: "APC", votes: "291,667", percentage: "47.6%", turnout: "24.8%", margin: "32K votes" },
    { election: "2024 Ondo Governorship", winner: "Lucky Aiyedatiwa", party: "APC", votes: "366,781", percentage: "52.3%", turnout: "28.1%", margin: "75K votes" },
  ],
  inecUpdates: [
    { update: "INEC announces voter registration portal reopening", time: randomInt(5, 120), priority: "high" },
    { update: "PVC collection deadline extended for 3 states", time: randomInt(30, 240), priority: "medium" },
    { update: "New electoral districts gazetted for LG elections", time: randomInt(60, 480), priority: "medium" },
    { update: "BVAS deployment plan finalized for off-cycle elections", time: randomInt(120, 600), priority: "low" },
  ],
  partyStrength: [
    { party: "APC", governors: 22, seats: 177, color: PARTY_COLORS.APC },
    { party: "PDP", governors: 11, seats: 100, color: PARTY_COLORS.PDP },
    { party: "LP", governors: 0, seats: 35, color: PARTY_COLORS.LP },
    { party: "NNPP", governors: 1, seats: 19, color: PARTY_COLORS.NNPP },
    { party: "APGA", governors: 1, seats: 5, color: PARTY_COLORS.APGA },
    { party: "Others", governors: 1, seats: 24, color: "#6b7280" },
  ],
});

const generateEconomyData = () => ({
  naira: { officialRate: randomBetween(1500, 1650), parallelRate: randomBetween(1600, 1800), change24h: randomBetween(-3, 3), weekChange: randomBetween(-5, 5), cbnReserves: `$${randomBetween(32, 38).toFixed(1)}B` },
  inflation: {
    headline: randomBetween(28, 35), food: randomBetween(35, 42), core: randomBetween(22, 28), month: "February 2026",
    trend: Array.from({ length: 12 }, (_, i) => ({ month: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"][i], rate: randomBetween(25, 38) })),
  },
  ngx: {
    asiIndex: randomBetween(95000, 110000), change: randomBetween(-2, 3), volume: `${randomBetween(200, 800).toFixed(0)}M`, marketCap: `₦${randomBetween(55, 65).toFixed(1)}T`,
    topGainers: [{ name: "Dangote Cement", change: randomBetween(1, 8) }, { name: "BUA Foods", change: randomBetween(1, 6) }, { name: "Airtel Africa", change: randomBetween(0.5, 5) }],
    topLosers: [{ name: "Access Holdings", change: randomBetween(-6, -1) }, { name: "Zenith Bank", change: randomBetween(-5, -0.5) }, { name: "GTCo", change: randomBetween(-4, -0.5) }],
    sparkline: Array.from({ length: 20 }, () => randomBetween(95000, 110000)),
  },
  oil: { production: randomBetween(1.2, 1.6), target: 2.0, bonnyLight: randomBetween(72, 92), oilRevenue: `₦${randomBetween(1.5, 3.0).toFixed(1)}T`, refineryStatus: "Dangote Refinery at 85% capacity", exports: `${randomBetween(0.8, 1.2).toFixed(2)} mbpd` },
  fuelPrices: { pms: randomBetween(600, 950), ago: "₦1,100 - ₦1,350", lpg: randomBetween(1000, 1400), cng: randomBetween(250, 400) },
  debt: { total: `₦${randomBetween(87, 100).toFixed(1)}T`, external: `$${randomBetween(40, 45).toFixed(1)}B`, domestic: `₦${randomBetween(48, 55).toFixed(1)}T`, debtToGdp: `${randomBetween(38, 45).toFixed(1)}%` },
});

const generateHealthData = () => [
  { disease: "Cholera", state: "Lagos", cases: randomInt(200, 2000), deaths: randomInt(5, 80), trend: "rising", newCases24h: randomInt(10, 100), responseTeams: randomInt(5, 20), ncdc: true, vaccineAvailable: true },
  { disease: "Lassa Fever", state: "Ondo", cases: randomInt(100, 800), deaths: randomInt(10, 60), trend: "rising", newCases24h: randomInt(5, 30), responseTeams: randomInt(3, 12), ncdc: true, vaccineAvailable: false },
  { disease: "Malaria", state: "Nationwide", cases: randomInt(100000, 500000), deaths: randomInt(500, 3000), trend: "stable", newCases24h: randomInt(2000, 10000), responseTeams: randomInt(20, 80), ncdc: false, vaccineAvailable: true },
  { disease: "Measles", state: "Kano", cases: randomInt(500, 3000), deaths: randomInt(10, 100), trend: "rising", newCases24h: randomInt(20, 150), responseTeams: randomInt(5, 15), ncdc: true, vaccineAvailable: true },
  { disease: "Diphtheria", state: "Katsina", cases: randomInt(100, 1000), deaths: randomInt(10, 80), trend: "declining", newCases24h: randomInt(2, 20), responseTeams: randomInt(3, 10), ncdc: true, vaccineAvailable: true },
  { disease: "Yellow Fever", state: "Bauchi", cases: randomInt(50, 500), deaths: randomInt(5, 40), trend: "stable", newCases24h: randomInt(2, 15), responseTeams: randomInt(2, 8), ncdc: true, vaccineAvailable: true },
  { disease: "Mpox", state: "Lagos", cases: randomInt(20, 200), deaths: randomInt(1, 10), trend: "declining", newCases24h: randomInt(0, 5), responseTeams: randomInt(2, 8), ncdc: true, vaccineAvailable: false },
  { disease: "CSM (Meningitis)", state: "Sokoto", cases: randomInt(100, 1500), deaths: randomInt(10, 100), trend: "rising", newCases24h: randomInt(5, 50), responseTeams: randomInt(3, 10), ncdc: true, vaccineAvailable: true },
];

const generateNewsItems = () => [
  { id: 0, title: "FG announces new minimum wage implementation timeline for states", source: "Punch", category: "Economy", time: randomInt(1, 60), priority: "high", summary: "Federal Government sets Q2 deadline for all state governors to implement the ₦70,000 minimum wage. Labour unions threaten nationwide strike if deadline is missed. 15 states yet to begin." },
  { id: 1, title: "NNPC reports Dangote Refinery now processing 500,000 bpd", source: "ThisDay", category: "Energy", time: randomInt(10, 120), priority: "high", summary: "Dangote Refinery hits 500,000 bpd milestone. PMS production expected to ease pump prices. Export of refined products to West Africa has begun." },
  { id: 2, title: "Troops neutralize Boko Haram commanders in Sambisa operation", source: "Premium Times", category: "Security", time: randomInt(5, 90), priority: "critical", summary: "Operation Hadin Kai confirms elimination of 3 senior ISWAP commanders in Sambisa Forest. 47 hostages freed including women and children." },
  { id: 3, title: "CBN raises interest rate to 28.5% amid inflation concerns", source: "Bloomberg", category: "Economy", time: randomInt(30, 180), priority: "high", summary: "MPC votes unanimously for 50bps hike to 28.5%, citing persistent inflation. Foreign portfolio investments rose 15% post-decision." },
  { id: 4, title: "INEC begins preparation for off-cycle governorship elections", source: "Channels TV", category: "Politics", time: randomInt(60, 300), priority: "medium", summary: "INEC deploys sensitive materials to Ondo and Anambra for upcoming governorship polls. BVAS machines tested and certified across all LGAs." },
  { id: 5, title: "Lagos-Calabar coastal highway reaches Ogun State", source: "Guardian", category: "Infrastructure", time: randomInt(60, 360), priority: "medium", summary: "₦15.6T coastal highway has 120km of 700km completed. Expected to create 300,000 jobs and cut Lagos-Calabar travel from 14hrs to 8hrs." },
  { id: 6, title: "NCDC activates EOC for cholera outbreak in Lagos", source: "NCDC", category: "Health", time: randomInt(10, 60), priority: "critical", summary: "Emergency Operations Centre activated as cholera spikes across 12 Lagos LGAs. Oral rehydration points set up in markets and motor parks." },
  { id: 7, title: "Senate passes Petroleum Industry Act amendment", source: "Vanguard", category: "Politics", time: randomInt(120, 480), priority: "medium", summary: "Senate approves amendments increasing host community development trust funds from 3% to 5%. Oil-producing states welcome the move." },
  { id: 8, title: "NCC reports 230M active telecom subscribers", source: "TechCabal", category: "Tech", time: randomInt(60, 360), priority: "medium", summary: "Internet penetration reaches 52%. 5G expanded to 7 more cities including Kano, Port Harcourt, and Ibadan." },
  { id: 9, title: "Flooding displaces 200,000 in Kogi and Niger States", source: "NEMA", category: "Disaster", time: randomInt(30, 180), priority: "critical", summary: "NEMA declares emergency as River Niger overflows. 15,000 hectares of farmland submerged. FG releases ₦5B for emergency response." },
  { id: 10, title: "GDP grows 3.46% in Q4 driven by non-oil sector", source: "NBS", category: "Economy", time: randomInt(120, 600), priority: "high", summary: "ICT (14.2%), financial services (28.1%), and agriculture (2.1%) drive growth. Oil sector contracts -0.8% due to pipeline vandalism." },
  { id: 11, title: "Customs intercepts ₦2.5B worth of arms at Apapa port", source: "Daily Trust", category: "Security", time: randomInt(60, 240), priority: "high", summary: "Assault rifles, ammunition, and grenades seized at Apapa. Shipment from Eastern Europe falsely declared as industrial machinery." },
];

const generateWeatherCities = () => [
  { city: "Lagos", state: "Lagos", temp: randomInt(27, 35), condition: "Partly Cloudy", humidity: randomInt(70, 95), wind: randomInt(5, 18), icon: "🌤️", zone: "SW" },
  { city: "Abuja", state: "FCT", temp: randomInt(22, 36), condition: "Sunny", humidity: randomInt(30, 60), wind: randomInt(5, 15), icon: "☀️", zone: "NC" },
  { city: "Kano", state: "Kano", temp: randomInt(25, 42), condition: "Hot & Dry", humidity: randomInt(15, 40), wind: randomInt(8, 25), icon: "🌡️", zone: "NW" },
  { city: "Port Harcourt", state: "Rivers", temp: randomInt(24, 33), condition: "Thunderstorms", humidity: randomInt(75, 95), wind: randomInt(5, 20), icon: "⛈️", zone: "SS" },
  { city: "Enugu", state: "Enugu", temp: randomInt(22, 32), condition: "Overcast", humidity: randomInt(55, 80), wind: randomInt(5, 12), icon: "☁️", zone: "SE" },
  { city: "Ibadan", state: "Oyo", temp: randomInt(24, 34), condition: "Partly Cloudy", humidity: randomInt(55, 85), wind: randomInt(5, 15), icon: "🌤️", zone: "SW" },
  { city: "Maiduguri", state: "Borno", temp: randomInt(28, 44), condition: "Hot & Hazy", humidity: randomInt(10, 35), wind: randomInt(10, 30), icon: "🌡️", zone: "NE" },
  { city: "Calabar", state: "Cross River", temp: randomInt(24, 32), condition: "Rainy", humidity: randomInt(80, 98), wind: randomInt(5, 15), icon: "🌧️", zone: "SS" },
];

const generateInfrastructure = () => ({
  power: {
    gridGeneration: randomInt(3500, 5500), peakCapacity: 13000, distributionLoss: `${randomInt(30, 45)}%`,
    discos: [
      { name: "Ikeja Electric", state: "Lagos", load: randomInt(500, 900), status: Math.random() > 0.3 ? "stable" : "rationing" },
      { name: "Eko DisCo", state: "Lagos", load: randomInt(400, 700), status: Math.random() > 0.5 ? "stable" : "rationing" },
      { name: "Abuja DisCo", state: "FCT", load: randomInt(300, 600), status: Math.random() > 0.4 ? "stable" : "rationing" },
      { name: "Ibadan DisCo", state: "Oyo", load: randomInt(250, 500), status: Math.random() > 0.6 ? "stable" : "rationing" },
      { name: "Enugu DisCo", state: "Enugu", load: randomInt(200, 400), status: Math.random() > 0.5 ? "stable" : "rationing" },
      { name: "PH DisCo", state: "Rivers", load: randomInt(200, 450), status: Math.random() > 0.5 ? "stable" : "rationing" },
    ],
  },
  transport: [
    { project: "Lagos-Ibadan Railway", status: "Operational", completion: "100%", color: "#22c55e" },
    { project: "Abuja-Kaduna Railway", status: "Operational", completion: "100%", color: "#22c55e" },
    { project: "Lagos Metro Blue Line", status: "Operational", completion: "100%", color: "#22c55e" },
    { project: "Lagos-Calabar Highway", status: "Under Construction", completion: "17%", color: "#eab308" },
    { project: "Abuja-Kano Railway", status: "Under Construction", completion: "32%", color: "#eab308" },
    { project: "PH-Maiduguri Railway", status: "Planning", completion: "5%", color: "#ef4444" },
  ],
});

// ─── UI COMPONENTS ──────────────────────────────────────
const DetailRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-[10px] text-gray-500">{label}</span>
    <span className="text-[10px] font-medium" style={{ color: color || "#d1d5db" }}>{value}</span>
  </div>
);

const Widget = ({ title, icon: Icon, children, className = "", span = 1, color = "#3b82f6", onRefresh, badge }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${span === 2 ? "col-span-1 lg:col-span-2" : ""} ${className}`} style={{ minHeight: collapsed ? "auto" : "280px" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">{title}</h3>
          {badge && <span className="px-1.5 py-0.5 text-[10px] font-bold rounded" style={{ backgroundColor: color + "22", color }}>{badge}</span>}
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && <button onClick={onRefresh} className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 cursor-pointer"><RefreshCw size={12} /></button>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 cursor-pointer">{collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}</button>
        </div>
      </div>
      {!collapsed && <div className="p-3">{children}</div>}
    </div>
  );
};

const SeverityBadge = ({ severity }) => {
  const colors = { critical: "bg-red-500/20 text-red-400 border-red-500/30", high: "bg-orange-500/20 text-orange-400 border-orange-500/30", medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", low: "bg-green-500/20 text-green-400 border-green-500/30" };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${colors[severity] || colors.low}`}>{severity?.toUpperCase()}</span>;
};

const LiveDot = () => (<span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>);

const StatCard = ({ label, value, sub, icon: Icon, color = "#3b82f6", onClick, active }) => (
  <div onClick={onClick} className={`bg-gray-800/50 rounded-lg p-3 border transition-all ${onClick ? "cursor-pointer hover:bg-gray-800/80 hover:border-gray-600" : ""} ${active ? "border-2 ring-1 ring-opacity-30" : "border-gray-700/50"}`} style={active ? { borderColor: color, boxShadow: `0 0 12px ${color}33` } : {}}>
    <div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>{Icon && <Icon size={12} style={{ color }} />}</div>
    <div className="text-lg font-bold text-white">{value}</div>
    {sub && <span className="text-[10px] text-gray-500">{sub}</span>}
    {onClick && <span className="text-[8px] text-gray-600 mt-0.5 block">Click to filter</span>}
  </div>
);

// Nigeria Map
const NigeriaMapWidget = ({ events }) => {
  const markers = (events || []).map(e => ({ x: ((e.lng - 2.5) / 13) * 100, y: ((14 - e.lat) / 10) * 100, color: SEVERITY_COLORS[e.severity] }));
  return (
    <div className="relative w-full" style={{ height: "320px" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M15,25 L20,20 L28,18 L35,15 L42,14 L50,13 L58,14 L65,16 L72,18 L78,22 L82,28 L85,35 L83,42 L80,48 L78,55 L75,60 L70,65 L65,68 L60,72 L55,75 L50,78 L45,80 L40,78 L35,75 L30,70 L25,65 L20,58 L16,50 L14,42 L13,35 L14,30 Z" fill="#0f2912" stroke="#22c55e33" strokeWidth="0.5" />
        <line x1="30" y1="20" x2="32" y2="55" stroke="#22c55e15" strokeWidth="0.3" strokeDasharray="2,2" />
        <line x1="55" y1="15" x2="55" y2="55" stroke="#22c55e15" strokeWidth="0.3" strokeDasharray="2,2" />
        <line x1="15" y1="45" x2="85" y2="45" stroke="#22c55e15" strokeWidth="0.3" strokeDasharray="2,2" />
        <text x="22" y="30" fill="#22c55e44" fontSize="3.5" fontWeight="bold">NW</text>
        <text x="45" y="25" fill="#22c55e44" fontSize="3.5" fontWeight="bold">NE</text>
        <text x="35" y="42" fill="#22c55e44" fontSize="3.5" fontWeight="bold">NC</text>
        <text x="25" y="62" fill="#22c55e44" fontSize="3.5" fontWeight="bold">SW</text>
        <text x="55" y="62" fill="#22c55e44" fontSize="3.5" fontWeight="bold">SE</text>
        <text x="42" y="72" fill="#22c55e44" fontSize="3.5" fontWeight="bold">SS</text>
        {markers.map((m, i) => (<g key={i}><circle cx={m.x} cy={m.y} r="2" fill={m.color} opacity="0.25"><animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" /></circle><circle cx={m.x} cy={m.y} r="1" fill={m.color} /></g>))}
      </svg>
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-gray-500">
        {Object.entries(SEVERITY_COLORS).map(([k, v]) => (<span key={k} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: v }}></span>{k}</span>))}
      </div>
      <div className="absolute top-2 right-2 text-[9px] text-gray-600 bg-gray-900/80 px-2 py-1 rounded">🇳🇬 36 States + FCT</div>
    </div>
  );
};

// Nigeria Heat Map — Bird's Eye with clickable zones
const NigeriaHeatMap = ({ security, health, onZoneClick, activeZone, heatMode }) => {
  const zones = {
    "NW": { cx: 28, cy: 28, r: 14, states: ["Jigawa","Kaduna","Kano","Katsina","Kebbi","Sokoto","Zamfara"] },
    "NE": { cx: 55, cy: 25, r: 14, states: ["Adamawa","Bauchi","Borno","Gombe","Taraba","Yobe"] },
    "NC": { cx: 42, cy: 42, r: 12, states: ["Benue","Kogi","Kwara","Nasarawa","Niger","Plateau","FCT"] },
    "SW": { cx: 24, cy: 62, r: 11, states: ["Ekiti","Lagos","Ogun","Ondo","Osun","Oyo"] },
    "SE": { cx: 58, cy: 60, r: 10, states: ["Abia","Anambra","Ebonyi","Enugu","Imo"] },
    "SS": { cx: 42, cy: 72, r: 11, states: ["Akwa Ibom","Bayelsa","Cross River","Delta","Edo","Rivers"] },
  };

  const getZoneIntensity = (zone) => {
    const zoneStates = zones[zone].states;
    if (heatMode === "health") {
      return health.filter(h => zoneStates.includes(h.state) || h.state === "Nationwide").reduce((sum, h) => sum + h.cases, 0);
    }
    return security.filter(s => zoneStates.includes(s.state)).reduce((sum, s) => sum + s.casualties + (s.severity === "critical" ? 20 : s.severity === "high" ? 10 : 3), 0);
  };

  const maxIntensity = Math.max(...Object.keys(zones).map(z => getZoneIntensity(z)), 1);

  const getHeatColor = (intensity) => {
    const pct = intensity / maxIntensity;
    if (heatMode === "health") {
      if (pct > 0.7) return "rgba(239,68,68,0.6)";
      if (pct > 0.4) return "rgba(249,115,22,0.45)";
      if (pct > 0.15) return "rgba(234,179,8,0.35)";
      return "rgba(34,197,94,0.2)";
    }
    if (pct > 0.7) return "rgba(239,68,68,0.55)";
    if (pct > 0.4) return "rgba(249,115,22,0.4)";
    if (pct > 0.15) return "rgba(234,179,8,0.3)";
    return "rgba(34,197,94,0.15)";
  };

  const getZoneStats = (zone) => {
    const zoneStates = zones[zone].states;
    if (heatMode === "health") {
      const outbreaks = health.filter(h => zoneStates.includes(h.state) || h.state === "Nationwide");
      return { count: outbreaks.length, label: "outbreaks", detail: outbreaks.map(o => o.disease).join(", ") || "None" };
    }
    const incidents = security.filter(s => zoneStates.includes(s.state));
    const casualties = incidents.reduce((sum, s) => sum + s.casualties, 0);
    return { count: incidents.length, label: "incidents", detail: `${casualties} casualties` };
  };

  return (
    <div className="relative w-full" style={{ height: "340px" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Nigeria outline */}
        <path d="M15,25 L20,20 L28,18 L35,15 L42,14 L50,13 L58,14 L65,16 L72,18 L78,22 L82,28 L85,35 L83,42 L80,48 L78,55 L75,60 L70,65 L65,68 L60,72 L55,75 L50,78 L45,80 L40,78 L35,75 L30,70 L25,65 L20,58 L16,50 L14,42 L13,35 L14,30 Z"
              fill="#0a1a0d" stroke="#22c55e22" strokeWidth="0.5" />
        {/* Heat zones */}
        {Object.entries(zones).map(([zone, { cx, cy, r }]) => {
          const intensity = getZoneIntensity(zone);
          const heatColor = getHeatColor(intensity);
          const isActive = activeZone === zone;
          return (
            <g key={zone} onClick={() => onZoneClick(zone)} style={{ cursor: "pointer" }}>
              {/* Heat glow */}
              <circle cx={cx} cy={cy} r={r * 1.3} fill={heatColor} opacity="0.4">
                <animate attributeName="r" values={`${r * 1.2};${r * 1.5};${r * 1.2}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={r} fill={heatColor} opacity="0.6" />
              {/* Active ring */}
              {isActive && <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8"><animate attributeName="r" values={`${r + 1};${r + 3};${r + 1}`} dur="1.5s" repeatCount="indefinite" /></circle>}
              {/* Zone label */}
              <text x={cx} y={cy - 1} textAnchor="middle" fill={isActive ? "#ffffff" : "#e5e7ebcc"} fontSize="4" fontWeight="bold">{zone}</text>
              <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#9ca3afaa" fontSize="2.5">{getZoneStats(zone).count} {getZoneStats(zone).label}</text>
            </g>
          );
        })}
      </svg>
      {/* Zone detail panel */}
      {activeZone && (
        <div className="absolute top-2 left-2 bg-gray-900/95 border border-gray-700 rounded-lg p-2.5 max-w-[200px] animate-fadeIn">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">{activeZone} Zone</span>
            <button onClick={() => onZoneClick(null)} className="text-gray-500 hover:text-white cursor-pointer"><X size={10} /></button>
          </div>
          <p className="text-[9px] text-gray-400 mb-1">{zones[activeZone].states.join(", ")}</p>
          <div className="space-y-0.5">
            {heatMode === "health" ? (
              health.filter(h => zones[activeZone].states.includes(h.state) || h.state === "Nationwide").map((h, i) => (
                <div key={i} className="flex justify-between text-[9px]">
                  <span className="text-gray-300">{h.disease} ({h.state})</span>
                  <span className={h.trend === "rising" ? "text-red-400" : h.trend === "declining" ? "text-green-400" : "text-yellow-400"}>{h.cases.toLocaleString()}</span>
                </div>
              ))
            ) : (
              security.filter(s => zones[activeZone].states.includes(s.state)).map((s, i) => (
                <div key={i} className="flex justify-between text-[9px]">
                  <span className="text-gray-300">{s.type}</span>
                  <span className="text-red-400">{s.state}</span>
                </div>
              ))
            )}
            {((heatMode === "health" ? health.filter(h => zones[activeZone].states.includes(h.state) || h.state === "Nationwide") : security.filter(s => zones[activeZone].states.includes(s.state))).length === 0) && (
              <span className="text-[9px] text-gray-500">No active {heatMode === "health" ? "outbreaks" : "incidents"}</span>
            )}
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[9px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgba(34,197,94,0.3)" }}></span>Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgba(234,179,8,0.4)" }}></span>Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgba(249,115,22,0.5)" }}></span>High</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "rgba(239,68,68,0.6)" }}></span>Critical</span>
      </div>
      <div className="absolute top-2 right-2 text-[9px] text-gray-600 bg-gray-900/80 px-2 py-1 rounded">
        🔥 {heatMode === "health" ? "Disease" : "Security"} Heat Map
      </div>
    </div>
  );
};
export default function AfricaDeck() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [heatMode, setHeatMode] = useState("security");

  const [security, setSecurity] = useState(generateSecurityEvents());
  const [election] = useState(generateElectionData());
  const [economy, setEconomy] = useState(generateEconomyData());
  const [health, setHealth] = useState(generateHealthData());
  const [news, setNews] = useState(generateNewsItems());
  const [weather, setWeather] = useState(generateWeatherCities());
  const [infra] = useState(generateInfrastructure());

  const toggle = (setter, current, id) => setter(current === id ? null : id);

  useEffect(() => {
    const interval = setInterval(() => { setLastUpdate(new Date()); setEconomy(generateEconomyData()); setWeather(generateWeatherCities()); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshAll = () => {
    setSecurity(generateSecurityEvents()); setEconomy(generateEconomyData()); setHealth(generateHealthData());
    setNews(generateNewsItems()); setWeather(generateWeatherCities()); setLastUpdate(new Date());
    setSelectedSecurity(null); setSelectedNews(null); setSelectedDisease(null); setSelectedElection(null);
  };

  const criticalEvents = security.filter(s => s.severity === "critical").length;
  const risingOutbreaks = health.filter(h => h.trend === "rising").length;

  const categories = [
    { id: "all", label: "All", icon: Globe }, { id: "security", label: "Security", icon: Shield },
    { id: "elections", label: "Elections", icon: Landmark }, { id: "economy", label: "Economy", icon: TrendingUp },
    { id: "health", label: "Health", icon: Heart }, { id: "infra", label: "Infrastructure", icon: Zap },
    { id: "weather", label: "Weather", icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-[1920px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-sm">🇳🇬</div>
              <div>
                <h1 className="text-base font-bold tracking-tight"><span className="text-green-400">Nigeria</span><span className="text-white">Deck</span></h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Nigeria Intelligence Dashboard</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search states, events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-8 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-green-500/50" />
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-red-400"><Shield size={12} /> <span className="font-semibold">{security.length}</span> <span className="text-gray-500">incidents</span></div>
                <div className="flex items-center gap-1.5 text-green-400"><DollarSign size={12} /> <span className="font-semibold">₦{economy.naira.officialRate.toFixed(0)}</span> <span className="text-gray-500">/USD</span></div>
                <div className="flex items-center gap-1.5 text-yellow-400"><Heart size={12} /> <span className="font-semibold">{health.length}</span> <span className="text-gray-500">outbreaks</span></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500"><LiveDot /><span>LIVE</span><span>|</span><Clock size={10} /><span>{lastUpdate.toLocaleTimeString()}</span></div>
              <button onClick={refreshAll} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white cursor-pointer"><RefreshCw size={14} /></button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-1.5 hover:bg-gray-800 rounded-lg text-gray-400">{showMobileMenu ? <X size={14} /> : <Menu size={14} />}</button>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 pb-1 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap cursor-pointer ${activeFilter === cat.id ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent"}`}>
                <cat.icon size={11} />{cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ALERT BANNER */}
      {criticalEvents > 0 && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-1.5">
          <div className="max-w-[1920px] mx-auto flex items-center gap-2 text-[11px]">
            <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
            <div className="overflow-hidden"><div className="flex gap-8 animate-marquee">
              {security.filter(s => s.severity === "critical").map((s, i) => (
                <span key={i} className="text-red-300 whitespace-nowrap"><span className="text-red-400 font-bold">ALERT:</span> {s.type} in {s.state} ({s.lga}) — {s.description}<span className="mx-4 text-red-500/40">|</span></span>
              ))}
            </div></div>
          </div>
        </div>
      )}

      {/* STATS BAR */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <StatCard label="Security Incidents" value={security.length} sub={`${criticalEvents} critical`} icon={Shield} color="#ef4444" onClick={() => setActiveFilter(activeFilter === "security" ? "all" : "security")} active={activeFilter === "security"} />
            <StatCard label="Naira / USD" value={`₦${economy.naira.officialRate.toFixed(0)}`} sub={`Parallel: ₦${economy.naira.parallelRate.toFixed(0)}`} icon={DollarSign} color="#22c55e" onClick={() => setActiveFilter(activeFilter === "economy" ? "all" : "economy")} active={activeFilter === "economy"} />
            <StatCard label="NGX ASI" value={economy.ngx.asiIndex.toFixed(0)} sub={`${economy.ngx.change >= 0 ? "+" : ""}${economy.ngx.change.toFixed(2)}%`} icon={TrendingUp} color="#3b82f6" onClick={() => setActiveFilter(activeFilter === "economy" ? "all" : "economy")} active={activeFilter === "economy"} />
            <StatCard label="Oil Production" value={`${economy.oil.production.toFixed(2)} mbpd`} sub={`Target: ${economy.oil.target} mbpd`} icon={Zap} color="#f97316" onClick={() => setActiveFilter(activeFilter === "economy" ? "all" : "economy")} active={activeFilter === "economy"} />
            <StatCard label="Disease Outbreaks" value={health.length} sub={`${risingOutbreaks} rising`} icon={Heart} color="#eab308" onClick={() => setActiveFilter(activeFilter === "health" ? "all" : "health")} active={activeFilter === "health"} />
            <StatCard label="Grid Power" value={`${infra.power.gridGeneration} MW`} sub={`of ${infra.power.peakCapacity} MW`} icon={Activity} color="#a855f7" onClick={() => setActiveFilter(activeFilter === "infra" ? "all" : "infra")} active={activeFilter === "infra"} />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <main className="max-w-[1920px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

          {/* ═══ 1. HEALTH / NCDC DISEASE TRACKER — FIRST ═══ */}
          {(activeFilter === "all" || activeFilter === "health") && (
            <Widget title="NCDC Disease Tracker" icon={Heart} color="#eab308" badge={`${risingOutbreaks} RISING`} onRefresh={() => setHealth(generateHealthData())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {health.sort((a, b) => b.cases - a.cases).map((d, i) => (
                  <div key={i} onClick={() => toggle(setSelectedDisease, selectedDisease, d.disease + d.state)} className={`bg-gray-800/30 rounded-lg p-2 border cursor-pointer transition-all ${selectedDisease === d.disease + d.state ? "border-yellow-500/30 bg-gray-800/50" : "border-gray-700/20 hover:border-gray-600/30"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gray-200">{d.disease}</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${d.trend === "rising" ? "bg-red-500/20 text-red-400" : d.trend === "declining" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{d.trend === "rising" ? "▲ Rising" : d.trend === "declining" ? "▼ Declining" : "— Stable"}</span>
                        {selectedDisease === d.disease + d.state ? <ChevronUp size={10} className="text-gray-500" /> : <ChevronDown size={10} className="text-gray-500" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span><MapPin size={9} className="inline" /> {d.state}</span>
                      <span>Cases: <span className="text-gray-300 font-medium">{d.cases.toLocaleString()}</span></span>
                      <span>Deaths: <span className="text-red-400 font-medium">{d.deaths.toLocaleString()}</span></span>
                    </div>
                    <div className="mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min((d.deaths / d.cases) * 100 * 5, 100)}%`, backgroundColor: d.trend === "rising" ? "#ef4444" : d.trend === "declining" ? "#22c55e" : "#eab308" }} /></div>
                    {selectedDisease === d.disease + d.state && (
                      <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-0.5 animate-fadeIn">
                        <DetailRow label="New Cases (24h)" value={`+${d.newCases24h.toLocaleString()}`} color={d.trend === "rising" ? "#ef4444" : "#eab308"} />
                        <DetailRow label="CFR" value={`${((d.deaths / d.cases) * 100).toFixed(1)}%`} color="#ef4444" />
                        <DetailRow label="NCDC Alert" value={d.ncdc ? "Active" : "Monitoring"} color={d.ncdc ? "#ef4444" : "#6b7280"} />
                        <DetailRow label="Vaccine" value={d.vaccineAvailable ? "Available" : "Not Available"} color={d.vaccineAvailable ? "#22c55e" : "#ef4444"} />
                        <DetailRow label="Response Teams" value={`${d.responseTeams} deployed`} color="#3b82f6" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 2. BIRD'S EYE HEAT MAP — CLICKABLE ZONES ═══ */}
          {(activeFilter === "all" || activeFilter === "security" || activeFilter === "health") && (
            <Widget title="Bird's Eye — Heat Map" icon={Eye} span={2} color={heatMode === "health" ? "#eab308" : "#ef4444"} badge="CLICK ZONES">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-gray-500 uppercase">View:</span>
                <button onClick={() => { setHeatMode("security"); setActiveZone(null); }} className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer transition-all ${heatMode === "security" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
                  <Shield size={9} className="inline mr-1" />Security
                </button>
                <button onClick={() => { setHeatMode("health"); setActiveZone(null); }} className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer transition-all ${heatMode === "health" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
                  <Heart size={9} className="inline mr-1" />Disease
                </button>
              </div>
              <NigeriaHeatMap security={security} health={health} onZoneClick={(z) => setActiveZone(activeZone === z ? null : z)} activeZone={activeZone} heatMode={heatMode} />
            </Widget>
          )}

          {/* ═══ 3. NIGERIA SITUATION MAP ═══ */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Nigeria Situation Map" icon={Globe} span={2} color="#22c55e" badge="LIVE" onRefresh={() => setSecurity(generateSecurityEvents())}><NigeriaMapWidget events={security} /></Widget>
          )}

          {/* ═══ 4. SECURITY FEED ═══ */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Security & Conflict Feed" icon={Shield} color="#ef4444" badge={`${security.length}`} onRefresh={() => setSecurity(generateSecurityEvents())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {security.sort((a, b) => a.time - b.time).map(ev => (
                  <div key={ev.id} onClick={() => toggle(setSelectedSecurity, selectedSecurity, ev.id)} className={`bg-gray-800/40 rounded-lg p-2.5 border cursor-pointer transition-all ${selectedSecurity === ev.id ? "border-red-500/40 bg-gray-800/60" : "border-gray-700/30 hover:border-gray-600/50"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5"><SeverityBadge severity={ev.severity} /><span className="text-[11px] font-medium text-gray-300">{ev.type}</span></div>
                      <div className="flex items-center gap-1"><span className="text-[10px] text-gray-600">{timeAgo(ev.time)}</span>{selectedSecurity === ev.id ? <ChevronUp size={10} className="text-gray-500" /> : <ChevronDown size={10} className="text-gray-500" />}</div>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-1">{ev.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span><MapPin size={9} className="inline" /> {ev.state}, {ev.lga}</span>
                      {ev.casualties > 0 && <span className="text-red-400">† {ev.casualties}</span>}
                      {ev.verified && <span className="text-[9px] text-green-400 border border-green-500/30 px-1 rounded">✓</span>}
                    </div>
                    {selectedSecurity === ev.id && (
                      <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-0.5 animate-fadeIn">
                        <DetailRow label="Coordinates" value={`${ev.lat.toFixed(2)}°N, ${ev.lng.toFixed(2)}°E`} />
                        <DetailRow label="Displaced" value={`~${ev.displaced.toLocaleString()}`} color="#f97316" />
                        <DetailRow label="Response" value={ev.responders} color="#3b82f6" />
                        <DetailRow label="Source" value={ev.source} color="#06b6d4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 5. NEWS ═══ */}
          {(activeFilter === "all") && (
            <Widget title="Nigeria News Wire" icon={Newspaper} color="#06b6d4" badge="BREAKING" onRefresh={() => setNews(generateNewsItems())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {news.sort((a, b) => a.time - b.time).map(item => (
                  <div key={item.id} onClick={() => toggle(setSelectedNews, selectedNews, item.id)} className={`py-2 border-b border-gray-800/50 last:border-0 cursor-pointer rounded px-2 ${selectedNews === item.id ? "bg-gray-800/40" : "hover:bg-gray-800/20"}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.priority === "critical" ? "bg-red-500" : item.priority === "high" ? "bg-orange-500" : "bg-blue-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-300 leading-relaxed">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-600">
                          <span>{item.source}</span><span>•</span><span>{timeAgo(item.time)}</span>
                          <span className="px-1 bg-gray-800 rounded text-[9px] text-gray-500">{item.category}</span>
                        </div>
                        {selectedNews === item.id && (
                          <div className="mt-2 pt-2 border-t border-gray-700/50 animate-fadeIn">
                            <p className="text-[10px] text-gray-400 leading-relaxed">{item.summary}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 6. ELECTIONS — UPCOMING ═══ */}
          {(activeFilter === "all" || activeFilter === "elections") && (
            <Widget title="Upcoming Elections" icon={Landmark} color="#8b5cf6" badge="INEC">
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {election.upcoming.map((el, i) => (
                  <div key={i} onClick={() => toggle(setSelectedElection, selectedElection, `up-${i}`)} className={`bg-gray-800/40 rounded-lg p-2.5 border cursor-pointer transition-all ${selectedElection === `up-${i}` ? "border-purple-500/40 bg-gray-800/60" : "border-gray-700/30 hover:border-gray-600/50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gray-200">{el.election}</span>
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{el.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span><MapPin size={9} className="inline" /> {el.state}</span><span>Voters: {el.registeredVoters}</span><span className="text-yellow-400">{el.status}</span>
                    </div>
                    {selectedElection === `up-${i}` && el.candidates.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-1.5 animate-fadeIn">
                        <span className="text-[9px] text-gray-500 uppercase">Key Candidates</span>
                        {el.candidates.map((c, j) => (
                          <div key={j} className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-300">{c.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: c.color }}>{c.party}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 7. ELECTIONS — PARTY STRENGTH ═══ */}
          {(activeFilter === "all" || activeFilter === "elections") && (
            <Widget title="Party Strength" icon={Flag} color="#8b5cf6">
              <div className="space-y-2">
                {election.partyStrength.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[11px] font-bold w-12 text-right" style={{ color: p.color }}>{p.party}</span>
                    <div className="flex-1"><div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(p.governors / 22) * 100}%`, backgroundColor: p.color }} /></div></div>
                    <span className="text-[10px] text-gray-400 w-14">{p.governors} Gov</span>
                    <span className="text-[10px] text-gray-500 w-14">{p.seats} seats</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">INEC Updates</span>
                <div className="space-y-1.5 mt-1.5">
                  {election.inecUpdates.map((u, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[10px]">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${u.priority === "high" ? "bg-orange-500" : "bg-blue-500"}`} />
                      <span className="text-gray-400">{u.update} <span className="text-gray-600">{timeAgo(u.time)}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </Widget>
          )}

          {/* ═══ 8. ELECTIONS — RECENT RESULTS ═══ */}
          {(activeFilter === "elections") && (
            <Widget title="Recent Results" icon={BarChart3} color="#8b5cf6">
              <div className="space-y-2">
                {election.recentResults.map((r, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gray-200">{r.election}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: PARTY_COLORS[r.party] || "#6b7280" }}>{r.party}</span>
                    </div>
                    <p className="text-[11px] text-green-400 font-medium mb-1">🏆 {r.winner}</p>
                    <div className="grid grid-cols-2 gap-x-3 text-[10px]">
                      <DetailRow label="Votes" value={r.votes} /><DetailRow label="Share" value={r.percentage} color="#22c55e" />
                      <DetailRow label="Turnout" value={r.turnout} /><DetailRow label="Margin" value={r.margin} />
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 9. ECONOMY — NAIRA & INFLATION ═══ */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="Naira & Inflation" icon={DollarSign} color="#22c55e">
              <div className="space-y-3">
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <span className="text-[10px] text-gray-500 uppercase">NGN/USD Exchange Rate</span>
                  <div className="flex items-end gap-3 mt-1">
                    <div><span className="text-[9px] text-gray-500">Official</span><p className="text-lg font-bold text-white">₦{economy.naira.officialRate.toFixed(2)}</p></div>
                    <div><span className="text-[9px] text-gray-500">Parallel</span><p className="text-base font-semibold text-gray-400">₦{economy.naira.parallelRate.toFixed(0)}</p></div>
                    <span className={`text-[10px] font-medium mb-1 ${economy.naira.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>{economy.naira.change24h >= 0 ? "▲" : "▼"} {Math.abs(economy.naira.change24h).toFixed(2)}%</span>
                  </div>
                  <DetailRow label="CBN Reserves" value={economy.naira.cbnReserves} color="#22c55e" />
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <span className="text-[10px] text-gray-500 uppercase">Inflation ({economy.inflation.month})</span>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    <div className="text-center"><p className="text-sm font-bold text-red-400">{economy.inflation.headline.toFixed(1)}%</p><span className="text-[9px] text-gray-500">Headline</span></div>
                    <div className="text-center"><p className="text-sm font-bold text-orange-400">{economy.inflation.food.toFixed(1)}%</p><span className="text-[9px] text-gray-500">Food</span></div>
                    <div className="text-center"><p className="text-sm font-bold text-yellow-400">{economy.inflation.core.toFixed(1)}%</p><span className="text-[9px] text-gray-500">Core</span></div>
                  </div>
                </div>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={economy.inflation.trend}>
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "10px" }} />
                      <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef444422" strokeWidth={1.5} name="Inflation %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Widget>
          )}

          {/* ═══ 10. ECONOMY — NGX & OIL ═══ */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="NGX & Oil" icon={TrendingUp} color="#3b82f6">
              <div className="space-y-3">
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase">NGX All-Share Index</span>
                    <span className={`text-[10px] font-bold ${economy.ngx.change >= 0 ? "text-green-400" : "text-red-400"}`}>{economy.ngx.change >= 0 ? "+" : ""}{economy.ngx.change.toFixed(2)}%</span>
                  </div>
                  <p className="text-lg font-bold text-white">{economy.ngx.asiIndex.toFixed(2)}</p>
                  <div className="h-12 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={economy.ngx.sparkline.map(v => ({ v }))}><Area type="monotone" dataKey="v" stroke={economy.ngx.change >= 0 ? "#22c55e" : "#ef4444"} fill={economy.ngx.change >= 0 ? "#22c55e11" : "#ef444411"} strokeWidth={1} dot={false} /></AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 mt-1 text-[10px]"><DetailRow label="Market Cap" value={economy.ngx.marketCap} /><DetailRow label="Volume" value={economy.ngx.volume} /></div>
                  <div className="flex gap-4 mt-1.5">
                    <div className="flex-1"><span className="text-[9px] text-gray-500">Gainers</span>{economy.ngx.topGainers.map((g, i) => (<div key={i} className="flex justify-between text-[9px]"><span className="text-gray-400">{g.name}</span><span className="text-green-400">+{g.change.toFixed(1)}%</span></div>))}</div>
                    <div className="flex-1"><span className="text-[9px] text-gray-500">Losers</span>{economy.ngx.topLosers.map((l, i) => (<div key={i} className="flex justify-between text-[9px]"><span className="text-gray-400">{l.name}</span><span className="text-red-400">{l.change.toFixed(1)}%</span></div>))}</div>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <span className="text-[10px] text-gray-500 uppercase">Oil & Gas</span>
                  <DetailRow label="Production" value={`${economy.oil.production.toFixed(2)} mbpd`} color="#f97316" />
                  <DetailRow label="OPEC Target" value={`${economy.oil.target} mbpd`} />
                  <DetailRow label="Bonny Light" value={`$${economy.oil.bonnyLight.toFixed(2)}/bbl`} color="#22c55e" />
                  <DetailRow label="Oil Revenue" value={economy.oil.oilRevenue} />
                  <DetailRow label="Refinery" value={economy.oil.refineryStatus} color="#3b82f6" />
                </div>
              </div>
            </Widget>
          )}

          {/* ═══ 11. ECONOMY — FUEL & DEBT ═══ */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="Fuel Prices & Debt" icon={BarChart3} color="#f97316">
              <div className="space-y-3">
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <span className="text-[10px] text-gray-500 uppercase">Fuel Prices (per litre)</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <div className="text-center bg-gray-800/50 rounded p-2"><span className="text-[9px] text-gray-500">PMS</span><p className="text-sm font-bold text-orange-400">₦{economy.fuelPrices.pms.toFixed(0)}</p></div>
                    <div className="text-center bg-gray-800/50 rounded p-2"><span className="text-[9px] text-gray-500">Diesel</span><p className="text-sm font-bold text-yellow-400">{economy.fuelPrices.ago}</p></div>
                    <div className="text-center bg-gray-800/50 rounded p-2"><span className="text-[9px] text-gray-500">LPG (Gas)</span><p className="text-sm font-bold text-blue-400">₦{economy.fuelPrices.lpg.toFixed(0)}/kg</p></div>
                    <div className="text-center bg-gray-800/50 rounded p-2"><span className="text-[9px] text-gray-500">CNG</span><p className="text-sm font-bold text-green-400">₦{economy.fuelPrices.cng.toFixed(0)}/scm</p></div>
                  </div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <span className="text-[10px] text-gray-500 uppercase">National Debt</span>
                  <DetailRow label="Total Debt" value={economy.debt.total} color="#ef4444" />
                  <DetailRow label="External" value={economy.debt.external} />
                  <DetailRow label="Domestic" value={economy.debt.domestic} />
                  <DetailRow label="Debt-to-GDP" value={economy.debt.debtToGdp} color="#eab308" />
                </div>
              </div>
            </Widget>
          )}

          {/* ═══ 12. WEATHER ═══ */}
          {(activeFilter === "all" || activeFilter === "weather") && (
            <Widget title="Nigerian City Weather" icon={Cloud} color="#38bdf8" onRefresh={() => setWeather(generateWeatherCities())}>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {weather.map((w, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/20 text-center">
                    <span className="text-xl">{w.icon}</span>
                    <p className="text-[11px] font-semibold text-gray-200 mt-0.5">{w.city}</p>
                    <p className="text-[9px] text-gray-500">{w.state} ({w.zone})</p>
                    <p className="text-lg font-bold text-white">{w.temp}°C</p>
                    <p className="text-[9px] text-gray-500">{w.condition}</p>
                    <div className="flex justify-center gap-2 mt-1 text-[9px] text-gray-600">
                      <span><Droplets size={8} className="inline" /> {w.humidity}%</span>
                      <span><Wind size={8} className="inline" /> {w.wind}km/h</span>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 13. POWER GRID ═══ */}
          {(activeFilter === "all" || activeFilter === "infra") && (
            <Widget title="Power Grid" icon={Zap} color="#a855f7">
              <div className="space-y-2">
                <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/20">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-gray-500 uppercase">National Grid</span><span className="text-[10px] text-yellow-400">{infra.power.distributionLoss} losses</span></div>
                  <div className="flex items-end gap-2 mt-1"><p className="text-lg font-bold text-white">{infra.power.gridGeneration} MW</p><span className="text-[10px] text-gray-500 mb-0.5">/ {infra.power.peakCapacity} MW</span></div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-1"><div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: `${(infra.power.gridGeneration / infra.power.peakCapacity) * 100}%` }} /></div>
                </div>
                <span className="text-[9px] text-gray-500 uppercase">DisCos</span>
                {infra.power.discos.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-800/30 last:border-0">
                    <div><span className="text-gray-300">{d.name}</span><span className="text-gray-600 ml-1">({d.state})</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-mono">{d.load} MW</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${d.status === "stable" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 14. TRANSPORT ═══ */}
          {(activeFilter === "all" || activeFilter === "infra") && (
            <Widget title="Transport Projects" icon={Building2} color="#0ea5e9">
              <div className="space-y-2.5">
                {infra.transport.map((t, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 font-medium">{t.project}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.color + "22", color: t.color }}>{t.status}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: t.completion, backgroundColor: t.color }} /></div>
                    <div className="flex justify-between text-[9px] text-gray-600"><span>Progress</span><span>{t.completion}</span></div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ═══ 15. SECURITY PIE ═══ */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Incidents by Type" icon={Eye} color="#ef4444">
              {(() => {
                const types = [...new Set(security.map(s => s.type))];
                const data = types.map(t => ({ name: t.length > 18 ? t.slice(0, 18) + "…" : t, value: security.filter(s => s.type === t).length }));
                const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#f43f5e","#84cc16"];
                return (<><div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} cx="50%" cy="50%" outerRadius={65} innerRadius={30} dataKey="value" paddingAngle={2}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "10px" }} /></PieChart></ResponsiveContainer></div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">{data.map((item, i) => (<span key={i} className="flex items-center gap-1 text-[9px] text-gray-500"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: colors[i % colors.length] }}></span>{item.name}</span>))}</div></>);
              })()}
            </Widget>
          )}

          {/* ═══ 16. SECURITY TREND ═══ */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Security Trend — 12 Months" icon={BarChart3} span={2} color="#ef4444">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ month: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"][i], incidents: randomInt(40, 120), casualties: randomInt(50, 300), kidnappings: randomInt(10, 60) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "10px" }} />
                    <Area type="monotone" dataKey="incidents" stroke="#ef4444" fill="#ef444422" strokeWidth={1.5} name="Incidents" />
                    <Area type="monotone" dataKey="casualties" stroke="#f97316" fill="#f9731622" strokeWidth={1.5} name="Casualties" />
                    <Area type="monotone" dataKey="kidnappings" stroke="#eab308" fill="#eab30822" strokeWidth={1.5} name="Kidnappings" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Widget>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-900/30 py-3">
        <div className="max-w-[1920px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600">
          <div className="flex items-center gap-2"><span className="text-green-400 font-bold">NigeriaDeck-Olayinka Ayeni</span><span>v2.0.0</span><span>|</span><span>Nigeria Intelligence Dashboard</span></div>
          <div className="flex items-center gap-3"><span>Sources: ACLED, NCDC, NBS, CBN, NNPC, INEC, NiMet, NEMA</span><span>|</span><span>Last sync: {lastUpdate.toLocaleTimeString()}</span></div>
        </div>
      </footer>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
