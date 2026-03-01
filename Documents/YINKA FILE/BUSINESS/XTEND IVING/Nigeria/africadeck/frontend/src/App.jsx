import { useState, useEffect, useCallback, useRef } from "react";
import {
  Shield, Globe, TrendingUp, Cloud, Activity, Radio,
  AlertTriangle, Zap, Navigation, Newspaper, Heart,
  BarChart3, MapPin, Eye, RefreshCw, Wifi, WifiOff,
  ChevronDown, ChevronUp, ExternalLink, Clock, Users,
  DollarSign, Thermometer, Droplets, Wind, Sun, Moon,
  Anchor, Plane, Bell, Search, Menu, X, Settings,
  Maximize2, Minimize2, Filter, Download, Share2
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ─── CONSTANTS ──────────────────────────────────────────
const AFRICA_COUNTRIES = [
  "Nigeria", "South Africa", "Kenya", "Ethiopia", "Egypt", "Ghana",
  "Tanzania", "DRC", "Uganda", "Mozambique", "Cameroon", "Angola",
  "Sudan", "Mali", "Somalia", "Libya", "Zimbabwe", "Senegal",
  "Rwanda", "Côte d'Ivoire", "Madagascar", "Morocco", "Tunisia",
  "Algeria", "Zambia", "Malawi", "Niger", "Burkina Faso", "Chad",
  "South Sudan", "Central African Republic", "Eritrea", "Djibouti",
  "Botswana", "Namibia", "Lesotho", "Eswatini", "Mauritius",
  "Comoros", "Seychelles", "São Tomé", "Cape Verde", "Gambia",
  "Guinea", "Guinea-Bissau", "Sierra Leone", "Liberia", "Togo", "Benin"
];

const CONFLICT_TYPES = ["Armed Clash", "Protest", "Riot", "Strategic Development", "Violence Against Civilians", "Explosion/Remote Violence"];
const SEVERITY_COLORS = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };

const AFRICAN_CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬" },
  { code: "ZAR", name: "South African Rand", country: "South Africa", flag: "🇿🇦" },
  { code: "KES", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪" },
  { code: "EGP", name: "Egyptian Pound", country: "Egypt", flag: "🇪🇬" },
  { code: "GHS", name: "Ghanaian Cedi", country: "Ghana", flag: "🇬🇭" },
  { code: "ETB", name: "Ethiopian Birr", country: "Ethiopia", flag: "🇪🇹" },
  { code: "MAD", name: "Moroccan Dirham", country: "Morocco", flag: "🇲🇦" },
  { code: "TZS", name: "Tanzanian Shilling", country: "Tanzania", flag: "🇹🇿" },
];

const AFRICAN_EXCHANGES = [
  { name: "JSE", full: "Johannesburg Stock Exchange", country: "South Africa", flag: "🇿🇦" },
  { name: "NGX", full: "Nigerian Exchange", country: "Nigeria", flag: "🇳🇬" },
  { name: "NSE", full: "Nairobi Securities Exchange", country: "Kenya", flag: "🇰🇪" },
  { name: "EGX", full: "Egyptian Exchange", country: "Egypt", flag: "🇪🇬" },
  { name: "GSE", full: "Ghana Stock Exchange", country: "Ghana", flag: "🇬🇭" },
  { name: "BRVM", full: "Bourse Régionale", country: "West Africa", flag: "🌍" },
  { name: "CSE", full: "Casablanca SE", country: "Morocco", flag: "🇲🇦" },
  { name: "DSE", full: "Dar es Salaam SE", country: "Tanzania", flag: "🇹🇿" },
];

// ─── UTILITY FUNCTIONS ──────────────────────────────────
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomBetween(min, max));
const timeAgo = (minutes) => {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

// Generate realistic-looking data
const generateConflictEvents = () => {
  const regions = [
    { country: "Sudan", region: "Darfur", lat: 13.5, lng: 25.0 },
    { country: "DRC", region: "North Kivu", lat: -1.5, lng: 29.0 },
    { country: "Somalia", region: "Mogadishu", lat: 2.0, lng: 45.3 },
    { country: "Nigeria", region: "Borno State", lat: 11.8, lng: 13.1 },
    { country: "Mali", region: "Ménaka", lat: 15.9, lng: 2.4 },
    { country: "Mozambique", region: "Cabo Delgado", lat: -12.3, lng: 40.5 },
    { country: "Burkina Faso", region: "Sahel Region", lat: 14.2, lng: -0.3 },
    { country: "Ethiopia", region: "Amhara", lat: 11.5, lng: 38.5 },
    { country: "Cameroon", region: "Far North", lat: 10.6, lng: 14.3 },
    { country: "Central African Republic", region: "Bangui", lat: 4.4, lng: 18.6 },
    { country: "Libya", region: "Tripoli", lat: 32.9, lng: 13.1 },
    { country: "South Sudan", region: "Upper Nile", lat: 9.8, lng: 32.0 },
  ];
  return regions.map((r, i) => ({
    id: i,
    ...r,
    type: CONFLICT_TYPES[randomInt(0, CONFLICT_TYPES.length)],
    severity: ["critical", "high", "medium", "low"][randomInt(0, 4)],
    casualties: randomInt(0, 25),
    time: randomInt(1, 720),
    source: ["ACLED", "UN OCHA", "Reuters", "AFP", "Local Media"][randomInt(0, 5)],
    verified: Math.random() > 0.3,
    description: [
      "Armed engagement reported between military forces and non-state actors",
      "Civilian protests escalating in urban center",
      "IED detonation near military checkpoint",
      "Displacement of civilian population reported",
      "Peacekeeping forces responding to incident",
      "Cross-border incursion detected",
    ][randomInt(0, 6)],
  }));
};

const generateEarthquakes = () => {
  const locations = [
    { place: "East African Rift, Tanzania", lat: -6.2, lng: 35.7 },
    { place: "Northern Algeria", lat: 36.5, lng: 3.0 },
    { place: "Lake Kivu Region, DRC", lat: -2.0, lng: 29.0 },
    { place: "Gulf of Aden, Djibouti", lat: 11.5, lng: 43.1 },
    { place: "Cameroon Volcanic Line", lat: 4.2, lng: 9.2 },
    { place: "Mozambique Channel", lat: -15.4, lng: 41.0 },
    { place: "Atlas Mountains, Morocco", lat: 31.5, lng: -7.5 },
    { place: "Ethiopian Rift Valley", lat: 8.0, lng: 39.0 },
  ];
  return locations.map((l, i) => ({
    id: i,
    ...l,
    magnitude: +(randomBetween(2.0, 6.5)).toFixed(1),
    depth: randomInt(5, 150),
    time: randomInt(1, 4320),
    tsunami: Math.random() > 0.95,
  }));
};

const generateDiseaseOutbreaks = () => {
  const outbreaks = [
    { disease: "Cholera", country: "Zambia", cases: randomInt(500, 5000), deaths: randomInt(10, 200), trend: "rising" },
    { disease: "Mpox", country: "DRC", cases: randomInt(1000, 15000), deaths: randomInt(50, 500), trend: "rising" },
    { disease: "Malaria", country: "Nigeria", cases: randomInt(50000, 200000), deaths: randomInt(200, 2000), trend: "stable" },
    { disease: "Ebola", country: "Uganda", cases: randomInt(10, 200), deaths: randomInt(5, 50), trend: "declining" },
    { disease: "Yellow Fever", country: "Sudan", cases: randomInt(100, 2000), deaths: randomInt(10, 100), trend: "rising" },
    { disease: "Meningitis", country: "Niger", cases: randomInt(200, 5000), deaths: randomInt(20, 300), trend: "stable" },
    { disease: "Lassa Fever", country: "Nigeria", cases: randomInt(100, 1000), deaths: randomInt(10, 100), trend: "declining" },
    { disease: "Dengue", country: "Kenya", cases: randomInt(200, 3000), deaths: randomInt(5, 50), trend: "rising" },
  ];
  return outbreaks;
};

const generateNewsItems = () => [
  { title: "AU Summit concludes with landmark digital trade agreement", source: "African Union", category: "Politics", time: randomInt(1, 60), priority: "high" },
  { title: "AfCFTA trade volume hits record quarterly high", source: "Reuters Africa", time: randomInt(30, 180), category: "Economy", priority: "high" },
  { title: "Sahel alliance announces joint military operation", source: "AFP", time: randomInt(10, 120), category: "Security", priority: "critical" },
  { title: "Kenya launches largest geothermal expansion project", source: "Bloomberg Africa", time: randomInt(60, 300), category: "Energy", priority: "medium" },
  { title: "DRC mining reform bill passes parliamentary review", source: "Mining Weekly", time: randomInt(120, 480), category: "Economy", priority: "medium" },
  { title: "South Africa load-shedding reaches Stage 6", source: "News24", time: randomInt(5, 60), category: "Infrastructure", priority: "high" },
  { title: "WHO declares end to cholera outbreak in Malawi", source: "WHO Africa", time: randomInt(30, 240), category: "Health", priority: "medium" },
  { title: "Nigeria's fintech sector attracts $2B in Q1 funding", source: "TechCrunch Africa", time: randomInt(60, 360), category: "Tech", priority: "medium" },
  { title: "UN peacekeeping mandate extended in Central African Republic", source: "UN News", time: randomInt(120, 600), category: "Security", priority: "high" },
  { title: "Morocco-Nigeria gas pipeline project enters Phase 2", source: "Energy Voice", time: randomInt(180, 720), category: "Energy", priority: "medium" },
  { title: "Ethiopian Airlines reports record annual revenue", source: "Aviation Week", time: randomInt(240, 960), category: "Economy", priority: "low" },
  { title: "Floods displace 50,000 in South Sudan", source: "OCHA", time: randomInt(30, 180), category: "Disaster", priority: "critical" },
];

const generateCurrencyData = () => AFRICAN_CURRENCIES.map(c => ({
  ...c,
  rate: c.code === "NGN" ? randomBetween(1500, 1650) :
       c.code === "ZAR" ? randomBetween(17.5, 19.5) :
       c.code === "KES" ? randomBetween(128, 155) :
       c.code === "EGP" ? randomBetween(48, 52) :
       c.code === "GHS" ? randomBetween(14, 16) :
       c.code === "ETB" ? randomBetween(56, 62) :
       c.code === "MAD" ? randomBetween(9.5, 10.5) :
       randomBetween(2400, 2600),
  change: randomBetween(-3, 3),
  volume: randomInt(100, 5000),
}));

const generateExchangeData = () => AFRICAN_EXCHANGES.map(e => ({
  ...e,
  index: randomBetween(1000, 85000),
  change: randomBetween(-4, 4),
  volume: `${randomBetween(0.5, 15).toFixed(1)}B`,
  sparkline: Array.from({ length: 20 }, () => randomBetween(80, 120)),
}));

const generateCommodityData = () => [
  { name: "Gold", price: randomBetween(2800, 3200), change: randomBetween(-2, 2), unit: "$/oz", icon: "🥇" },
  { name: "Crude Oil (Brent)", price: randomBetween(70, 90), change: randomBetween(-3, 3), unit: "$/bbl", icon: "🛢️" },
  { name: "Cocoa", price: randomBetween(8000, 12000), change: randomBetween(-5, 5), unit: "$/ton", icon: "🍫" },
  { name: "Coffee (Robusta)", price: randomBetween(3000, 5000), change: randomBetween(-3, 3), unit: "$/ton", icon: "☕" },
  { name: "Platinum", price: randomBetween(900, 1100), change: randomBetween(-2, 2), unit: "$/oz", icon: "💎" },
  { name: "Cobalt", price: randomBetween(25000, 35000), change: randomBetween(-4, 4), unit: "$/ton", icon: "⚡" },
  { name: "Copper", price: randomBetween(8000, 10000), change: randomBetween(-2, 2), unit: "$/ton", icon: "🔶" },
  { name: "Natural Gas", price: randomBetween(2.5, 4.5), change: randomBetween(-5, 5), unit: "$/MMBtu", icon: "🔥" },
];

const generateWeatherAlerts = () => [
  { type: "Tropical Cyclone", region: "Mozambique Channel", severity: "critical", detail: "Category 3 cyclone approaching Mozambican coast" },
  { type: "Extreme Heat", region: "Sahel Region", severity: "high", detail: "Temperatures exceeding 47°C expected for 5+ days" },
  { type: "Flooding", region: "Niger River Basin", severity: "high", detail: "River levels rising above flood stage" },
  { type: "Drought", region: "Horn of Africa", severity: "medium", detail: "Below-average rainfall for 3rd consecutive season" },
  { type: "Dust Storm", region: "Northern Sahara", severity: "medium", detail: "Visibility reduced to <500m across desert regions" },
  { type: "Locust Swarm", region: "East Africa", severity: "high", detail: "Desert locust swarms detected moving southward" },
];

const generateWeatherCities = () => [
  { city: "Lagos", country: "Nigeria", temp: randomInt(27, 35), condition: "Partly Cloudy", humidity: randomInt(60, 90), wind: randomInt(5, 20), icon: "🌤️" },
  { city: "Nairobi", country: "Kenya", temp: randomInt(15, 25), condition: "Sunny", humidity: randomInt(40, 70), wind: randomInt(5, 15), icon: "☀️" },
  { city: "Cairo", country: "Egypt", temp: randomInt(20, 38), condition: "Clear", humidity: randomInt(20, 50), wind: randomInt(8, 25), icon: "☀️" },
  { city: "Johannesburg", country: "South Africa", temp: randomInt(12, 28), condition: "Thunderstorms", humidity: randomInt(50, 80), wind: randomInt(10, 30), icon: "⛈️" },
  { city: "Accra", country: "Ghana", temp: randomInt(25, 33), condition: "Humid", humidity: randomInt(70, 95), wind: randomInt(5, 15), icon: "🌥️" },
  { city: "Addis Ababa", country: "Ethiopia", temp: randomInt(10, 22), condition: "Overcast", humidity: randomInt(40, 65), wind: randomInt(5, 15), icon: "☁️" },
  { city: "Casablanca", country: "Morocco", temp: randomInt(15, 28), condition: "Sunny", humidity: randomInt(50, 75), wind: randomInt(10, 25), icon: "☀️" },
  { city: "Dar es Salaam", country: "Tanzania", temp: randomInt(25, 32), condition: "Partly Cloudy", humidity: randomInt(65, 90), wind: randomInt(5, 15), icon: "🌤️" },
];

// ─── COMPONENTS ─────────────────────────────────────────

// Widget wrapper
const Widget = ({ title, icon: Icon, children, className = "", span = 1, color = "#3b82f6", onRefresh, badge }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${span === 2 ? "col-span-1 lg:col-span-2" : ""} ${span === 3 ? "col-span-1 lg:col-span-3" : ""} ${className}`}
         style={{ minHeight: collapsed ? "auto" : "280px" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">{title}</h3>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded" style={{ backgroundColor: color + "22", color }}>{badge}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <button onClick={onRefresh} className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" style={{ position: "relative", zIndex: 10 }}>
              <RefreshCw size={12} />
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" style={{ position: "relative", zIndex: 10 }}>
            {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>
      </div>
      {!collapsed && <div className="p-3">{children}</div>}
    </div>
  );
};

// Severity badge
const SeverityBadge = ({ severity }) => {
  const colors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${colors[severity] || colors.low}`}>
      {severity?.toUpperCase()}
    </span>
  );
};

// Live indicator
const LiveDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
  </span>
);

// Stat card
const StatCard = ({ label, value, change, icon: Icon, color = "#3b82f6" }) => (
  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      {Icon && <Icon size={12} style={{ color }} />}
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
    {change !== undefined && (
      <span className={`text-[11px] font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
        {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
      </span>
    )}
  </div>
);

// ─── AFRICA MAP SVG ─────────────────────────────────────
const AfricaMapWidget = ({ conflicts, earthquakes }) => {
  const markers = [
    ...(conflicts || []).map(c => ({ x: ((c.lng + 20) / 80) * 100, y: ((38 - c.lat) / 75) * 100, color: SEVERITY_COLORS[c.severity], type: "conflict", label: c.country })),
    ...(earthquakes || []).map(e => ({ x: ((e.lng + 20) / 80) * 100, y: ((38 - e.lat) / 75) * 100, color: "#8b5cf6", type: "earthquake", label: `M${e.magnitude}` })),
  ];

  return (
    <div className="relative w-full" style={{ height: "320px" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.1))" }}>
        {/* Simplified Africa outline */}
        <path d="M45,5 L55,3 L62,5 L68,10 L70,15 L72,20 L68,25 L65,22 L62,20 L60,22 L58,28 L60,32 L62,35 L65,38 L67,42 L68,48 L67,52 L65,55 L62,58 L60,62 L58,65 L55,68 L52,72 L48,75 L45,78 L42,82 L40,85 L38,88 L35,90 L32,88 L30,85 L28,80 L27,75 L25,70 L23,65 L22,60 L20,55 L18,50 L17,45 L16,40 L18,35 L20,30 L22,25 L25,20 L28,18 L30,15 L32,12 L35,10 L38,8 L42,6 Z"
              fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
        {/* Madagascar */}
        <path d="M72,60 L74,58 L75,62 L74,66 L72,68 L71,65 L71,62 Z"
              fill="#1e293b" stroke="#334155" strokeWidth="0.3" />
        {/* Grid lines */}
        {[20, 40, 60, 80].map(y => (
          <line key={`h${y}`} x1="10" y1={y} x2="80" y2={y} stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
        ))}
        {[20, 40, 60].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
        ))}
        {/* Markers */}
        {markers.map((m, i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r="1.5" fill={m.color} opacity="0.3">
              <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={m.x} cy={m.y} r="0.8" fill={m.color} />
          </g>
        ))}
      </svg>
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Conflict</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span> Seismic</span>
      </div>
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────────
export default function AfricaDeck() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedNews, setExpandedNews] = useState(null);

  // Data states
  const [conflicts, setConflicts] = useState(generateConflictEvents());
  const [earthquakes, setEarthquakes] = useState(generateEarthquakes());
  const [diseases, setDiseases] = useState(generateDiseaseOutbreaks());
  const [news, setNews] = useState(generateNewsItems());
  const [currencies, setCurrencies] = useState(generateCurrencyData());
  const [exchanges, setExchanges] = useState(generateExchangeData());
  const [commodities, setCommodities] = useState(generateCommodityData());
  const [weatherAlerts, setWeatherAlerts] = useState(generateWeatherAlerts());
  const [weatherCities, setWeatherCities] = useState(generateWeatherCities());

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Rotate some data to simulate live updates
      setCurrencies(generateCurrencyData());
      setCommodities(generateCommodityData());
      setWeatherCities(generateWeatherCities());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshAll = () => {
    setConflicts(generateConflictEvents());
    setEarthquakes(generateEarthquakes());
    setDiseases(generateDiseaseOutbreaks());
    setNews(generateNewsItems());
    setCurrencies(generateCurrencyData());
    setExchanges(generateExchangeData());
    setCommodities(generateCommodityData());
    setWeatherAlerts(generateWeatherAlerts());
    setWeatherCities(generateWeatherCities());
    setLastUpdate(new Date());
  };

  // Stats
  const totalConflicts = conflicts.length;
  const criticalEvents = conflicts.filter(c => c.severity === "critical").length;
  const totalEarthquakes = earthquakes.length;
  const significantQuakes = earthquakes.filter(e => e.magnitude >= 4.5).length;
  const activeOutbreaks = diseases.length;
  const criticalOutbreaks = diseases.filter(d => d.trend === "rising").length;

  // Category filter
  const categories = [
    { id: "all", label: "All Widgets", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "disaster", label: "Disasters", icon: AlertTriangle },
    { id: "economy", label: "Economy", icon: TrendingUp },
    { id: "health", label: "Health", icon: Heart },
    { id: "weather", label: "Weather", icon: Cloud },
  ];

  // Trend data for charts
  const conflictTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    events: randomInt(80, 250),
    fatalities: randomInt(20, 150),
  }));

  const gdpData = [
    { country: "Nigeria", gdp: 477, growth: 3.2 },
    { country: "S. Africa", gdp: 405, growth: 1.8 },
    { country: "Egypt", gdp: 398, growth: 4.1 },
    { country: "Algeria", gdp: 195, growth: 2.9 },
    { country: "Ethiopia", gdp: 164, growth: 6.2 },
    { country: "Kenya", gdp: 113, growth: 5.1 },
    { country: "Morocco", gdp: 143, growth: 3.5 },
    { country: "Ghana", gdp: 76, growth: 4.8 },
  ];

  const conflictByType = CONFLICT_TYPES.map(type => ({
    name: type.length > 15 ? type.slice(0, 15) + "…" : type,
    value: conflicts.filter(c => c.type === type).length || randomInt(1, 5),
  }));
  const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ─── HEADER ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-[1920px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 flex items-center justify-center">
                <Globe size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">
                  <span className="text-green-400">Africa</span>
                  <span className="text-yellow-400">Deck</span>
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Open-Source Intelligence Dashboard</p>
              </div>
            </div>

            {/* Center - Search & Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events, countries, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-8 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-red-400">
                  <Shield size={12} /> <span className="font-semibold">{totalConflicts}</span> <span className="text-gray-500">conflicts</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <Activity size={12} /> <span className="font-semibold">{totalEarthquakes}</span> <span className="text-gray-500">seismic</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Heart size={12} /> <span className="font-semibold">{activeOutbreaks}</span> <span className="text-gray-500">outbreaks</span>
                </div>
              </div>
            </div>

            {/* Right - Status & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500">
                <LiveDot />
                <span>LIVE</span>
                <span>|</span>
                <Clock size={10} />
                <span>{lastUpdate.toLocaleTimeString()}</span>
              </div>
              <button onClick={refreshAll} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer" style={{ position: "relative", zIndex: 10 }} title="Refresh all data">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-1.5 hover:bg-gray-800 rounded-lg text-gray-400">
                {showMobileMenu ? <X size={14} /> : <Menu size={14} />}
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 mt-2 pb-1 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === cat.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent"
                }`}
                style={{ position: "relative", zIndex: 10 }}
              >
                <cat.icon size={11} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─── ALERT BANNER ────────────────────────────── */}
      {criticalEvents > 0 && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-1.5 pointer-events-none" style={{ position: "relative", zIndex: 1 }}>
          <div className="max-w-[1920px] mx-auto flex items-center gap-2 text-[11px]">
            <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="flex gap-8 animate-marquee">
                {conflicts.filter(c => c.severity === "critical").map((c, i) => (
                  <span key={i} className="text-red-300 whitespace-nowrap">
                    <span className="text-red-400 font-bold">ALERT:</span> {c.type} in {c.country} ({c.region}) — {c.description}
                    <span className="mx-4 text-red-500/40">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAT OVERVIEW BAR ───────────────────────── */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <StatCard label="Active Conflicts" value={totalConflicts} icon={Shield} color="#ef4444" />
            <StatCard label="Critical Events" value={criticalEvents} icon={AlertTriangle} color="#f97316" />
            <StatCard label="Seismic Events" value={totalEarthquakes} icon={Activity} color="#8b5cf6" />
            <StatCard label="M4.5+ Quakes" value={significantQuakes} icon={Zap} color="#a855f7" />
            <StatCard label="Disease Outbreaks" value={activeOutbreaks} icon={Heart} color="#eab308" />
            <StatCard label="Rising Outbreaks" value={criticalOutbreaks} icon={TrendingUp} color="#ef4444" />
          </div>
        </div>
      </div>

      {/* ─── MAIN DASHBOARD GRID ─────────────────────── */}
      <main className="max-w-[1920px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

          {/* ─── AFRICA MAP ────────────────────────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Situation Map — Africa" icon={Globe} span={2} color="#3b82f6" badge="LIVE" onRefresh={refreshAll}>
              <AfricaMapWidget conflicts={conflicts} earthquakes={earthquakes} />
            </Widget>
          )}

          {/* ─── CONFLICT & SECURITY FEED ──────────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Conflict & Security Feed" icon={Shield} color="#ef4444" badge={`${totalConflicts} EVENTS`} onRefresh={() => setConflicts(generateConflictEvents())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {conflicts.sort((a, b) => a.time - b.time).map(event => (
                  <div key={event.id} onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)} className="bg-gray-800/40 rounded-lg p-2.5 border border-gray-700/30 hover:border-gray-600/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <SeverityBadge severity={event.severity} />
                        <span className="text-[11px] font-medium text-gray-300">{event.type}</span>
                      </div>
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">{timeAgo(event.time)}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-1">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-0.5"><MapPin size={9} /> {event.country}, {event.region}</span>
                        {event.casualties > 0 && <span className="text-red-400">† {event.casualties}</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {event.verified && <span className="text-[9px] text-green-400 border border-green-500/30 px-1 rounded">✓ Verified</span>}
                        <span className="text-[9px] text-gray-600">{event.source}</span>
                      </div>
                    </div>
                    {selectedEvent?.id === event.id && (
                      <div className="mt-2 pt-2 border-t border-gray-700/50 text-[10px] text-gray-400 space-y-1">
                        <div className="flex gap-4"><span>Lat: {event.lat.toFixed(2)}</span><span>Lng: {event.lng.toFixed(2)}</span></div>
                        <div>Source: <span className="text-blue-400">{event.source}</span></div>
                        <div>Status: {event.verified ? <span className="text-green-400">Verified by multiple sources</span> : <span className="text-yellow-400">Awaiting verification</span>}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── NEWS WIRE ─────────────────────────────── */}
          {(activeFilter === "all") && (
            <Widget title="Africa News Wire" icon={Newspaper} color="#06b6d4" badge="BREAKING" onRefresh={() => setNews(generateNewsItems())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {news.sort((a, b) => a.time - b.time).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-800/50 last:border-0">
                    <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                      item.priority === "critical" ? "bg-red-500" : item.priority === "high" ? "bg-orange-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-300 leading-relaxed">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-600">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{timeAgo(item.time)}</span>
                        <span className="px-1 py-0 bg-gray-800 rounded text-[9px] text-gray-500">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── EARTHQUAKE MONITOR ────────────────────── */}
          {(activeFilter === "all" || activeFilter === "disaster") && (
            <Widget title="Seismic Activity Monitor" icon={Activity} color="#8b5cf6" badge={`${totalEarthquakes} EVENTS`} onRefresh={() => setEarthquakes(generateEarthquakes())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {earthquakes.sort((a, b) => b.magnitude - a.magnitude).map(eq => (
                  <div key={eq.id} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      eq.magnitude >= 5.0 ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                      eq.magnitude >= 4.0 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {eq.magnitude}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-300 truncate">{eq.place}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <span>Depth: {eq.depth}km</span>
                        <span>•</span>
                        <span>{timeAgo(eq.time)}</span>
                        {eq.tsunami && <span className="text-red-400 font-bold">⚠ TSUNAMI</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── CURRENCY TRACKER ──────────────────────── */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="African Currencies vs USD" icon={DollarSign} color="#22c55e" onRefresh={() => setCurrencies(generateCurrencyData())}>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {currencies.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-200">{c.code}</span>
                        <p className="text-[9px] text-gray-600">{c.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-gray-300">{c.rate.toFixed(2)}</span>
                      <p className={`text-[10px] font-medium ${c.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── STOCK EXCHANGES ───────────────────────── */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="African Stock Exchanges" icon={BarChart3} color="#f59e0b" onRefresh={() => setExchanges(generateExchangeData())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {exchanges.map((ex, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{ex.flag}</span>
                        <div>
                          <span className="text-[11px] font-bold text-gray-200">{ex.name}</span>
                          <p className="text-[9px] text-gray-600">{ex.full}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-gray-300">{ex.index.toFixed(0)}</span>
                        <p className={`text-[10px] font-medium ${ex.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {ex.change >= 0 ? "+" : ""}{ex.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ex.sparkline.map((v, j) => ({ v }))}>
                          <Area type="monotone" dataKey="v" stroke={ex.change >= 0 ? "#22c55e" : "#ef4444"} fill={ex.change >= 0 ? "#22c55e11" : "#ef444411"} strokeWidth={1} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-[9px] text-gray-600 mt-0.5">Vol: {ex.volume}</div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── COMMODITIES ───────────────────────────── */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="Commodities — Africa Key Exports" icon={TrendingUp} color="#f97316" onRefresh={() => setCommodities(generateCommodityData())}>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {commodities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-800/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.icon}</span>
                      <span className="text-[11px] text-gray-300">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-gray-200">{c.price.toLocaleString()} <span className="text-[9px] text-gray-600">{c.unit}</span></span>
                      <p className={`text-[10px] font-medium ${c.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── DISEASE OUTBREAKS ─────────────────────── */}
          {(activeFilter === "all" || activeFilter === "health") && (
            <Widget title="Disease Outbreak Tracker" icon={Heart} color="#eab308" badge={`${criticalOutbreaks} RISING`} onRefresh={() => setDiseases(generateDiseaseOutbreaks())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {diseases.sort((a, b) => b.cases - a.cases).map((d, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gray-200">{d.disease}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        d.trend === "rising" ? "bg-red-500/20 text-red-400" :
                        d.trend === "declining" ? "bg-green-500/20 text-green-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {d.trend === "rising" ? "▲ Rising" : d.trend === "declining" ? "▼ Declining" : "— Stable"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span><MapPin size={9} className="inline mr-0.5" />{d.country}</span>
                      <span>Cases: <span className="text-gray-300 font-medium">{d.cases.toLocaleString()}</span></span>
                      <span>Deaths: <span className="text-red-400 font-medium">{d.deaths.toLocaleString()}</span></span>
                    </div>
                    <div className="mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min((d.deaths / d.cases) * 100 * 5, 100)}%`,
                        backgroundColor: d.trend === "rising" ? "#ef4444" : d.trend === "declining" ? "#22c55e" : "#eab308"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── WEATHER ALERTS ─────────────────────────── */}
          {(activeFilter === "all" || activeFilter === "weather") && (
            <Widget title="Severe Weather Alerts" icon={AlertTriangle} color="#f43f5e" onRefresh={() => setWeatherAlerts(generateWeatherAlerts())}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {weatherAlerts.map((alert, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2 border-l-2" style={{ borderLeftColor: SEVERITY_COLORS[alert.severity] }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold text-gray-200">{alert.type}</span>
                      <SeverityBadge severity={alert.severity} />
                    </div>
                    <p className="text-[10px] text-gray-500 mb-0.5">{alert.region}</p>
                    <p className="text-[10px] text-gray-400">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── WEATHER CITIES ─────────────────────────── */}
          {(activeFilter === "all" || activeFilter === "weather") && (
            <Widget title="Major City Weather" icon={Cloud} color="#38bdf8" onRefresh={() => setWeatherCities(generateWeatherCities())}>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {weatherCities.map((w, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/20 text-center">
                    <span className="text-xl">{w.icon}</span>
                    <p className="text-[11px] font-semibold text-gray-200 mt-0.5">{w.city}</p>
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

          {/* ─── CONFLICT TREND CHART ──────────────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Conflict Trend — 12 Months" icon={BarChart3} span={2} color="#ef4444">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conflictTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="events" stackId="1" stroke="#ef4444" fill="#ef444422" name="Events" />
                    <Area type="monotone" dataKey="fatalities" stackId="2" stroke="#f97316" fill="#f9731622" name="Fatalities" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Widget>
          )}

          {/* ─── CONFLICT BY TYPE PIE ──────────────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Events by Type" icon={Eye} color="#8b5cf6">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={conflictByType} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" paddingAngle={2}>
                      {conflictByType.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {conflictByType.map((item, i) => (
                  <span key={i} className="flex items-center gap-1 text-[9px] text-gray-500">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    {item.name}
                  </span>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── GDP CHART ─────────────────────────────── */}
          {(activeFilter === "all" || activeFilter === "economy") && (
            <Widget title="Top African Economies — GDP ($B)" icon={TrendingUp} span={2} color="#22c55e">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gdpData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="country" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }} />
                    <Bar dataKey="gdp" fill="#22c55e" radius={[0, 4, 4, 0]} name="GDP ($B)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Widget>
          )}

          {/* ─── INFRASTRUCTURE & POWER ─────────────────── */}
          {(activeFilter === "all" || activeFilter === "disaster") && (
            <Widget title="Infrastructure & Power" icon={Zap} color="#f59e0b">
              <div className="space-y-3">
                {[
                  { country: "South Africa", status: "Stage 4 Load-shedding", color: "#ef4444", detail: "Rolling blackouts active", pct: 65 },
                  { country: "Nigeria", status: "Grid Partially Stable", color: "#eab308", detail: "3,800 MW generation", pct: 45 },
                  { country: "Kenya", status: "Grid Stable", color: "#22c55e", detail: "Geothermal at capacity", pct: 92 },
                  { country: "Egypt", status: "Grid Stable", color: "#22c55e", detail: "Aswan Dam output normal", pct: 88 },
                  { country: "Ghana", status: "Intermittent Outages", color: "#f97316", detail: "Tema industrial zone affected", pct: 55 },
                  { country: "Ethiopia", status: "Grid Expanding", color: "#3b82f6", detail: "GERD filling continues", pct: 72 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 font-medium">{item.country}</span>
                      <span style={{ color: item.color }} className="text-[10px] font-semibold">{item.status}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-[9px] text-gray-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── MARITIME & AVIATION ───────────────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Maritime & Aviation Intel" icon={Anchor} color="#0ea5e9">
              <div className="space-y-2">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Maritime Zones</div>
                {[
                  { zone: "Gulf of Guinea", threat: "high", detail: "Piracy incidents reported — 3 vessels boarded this week", icon: "🏴‍☠️" },
                  { zone: "Mozambique Channel", threat: "medium", detail: "Insurgent activity near coastal areas", icon: "⚠️" },
                  { zone: "Red Sea / Gulf of Aden", threat: "critical", detail: "Houthi maritime threat — shipping diversions active", icon: "🚨" },
                  { zone: "Suez Canal", threat: "medium", detail: "Traffic delays — vessel queue at 45 ships", icon: "🚢" },
                ].map((z, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-800/30 last:border-0">
                    <span className="text-sm mt-0.5">{z.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-gray-300">{z.zone}</span>
                        <SeverityBadge severity={z.threat} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{z.detail}</p>
                    </div>
                  </div>
                ))}
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-3 mb-1">Aviation</div>
                {[
                  { route: "West Africa Airspace", status: "Active NOTAMs", detail: "Military exercises in Sahel region" },
                  { route: "East Africa Corridor", status: "Normal Operations", detail: "All major airports operational" },
                  { route: "North Africa", status: "Restricted Zones", detail: "Libya airspace partially closed" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-1 text-[10px]">
                    <div>
                      <span className="text-gray-300">{a.route}</span>
                      <p className="text-[9px] text-gray-600">{a.detail}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      a.status.includes("Normal") ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </Widget>
          )}

          {/* ─── DISPLACEMENT & HUMANITARIAN ───────────── */}
          {(activeFilter === "all" || activeFilter === "security") && (
            <Widget title="Displacement & Humanitarian" icon={Users} color="#ec4899">
              <div className="space-y-2">
                {[
                  { country: "Sudan", idps: "9.2M", refugees: "1.8M", crisis: "Armed conflict", severity: "critical" },
                  { country: "DRC", idps: "6.9M", refugees: "920K", crisis: "Armed conflict & Ebola", severity: "critical" },
                  { country: "Somalia", idps: "3.8M", refugees: "780K", crisis: "Drought & conflict", severity: "high" },
                  { country: "South Sudan", idps: "2.3M", refugees: "2.3M", crisis: "Flooding & conflict", severity: "high" },
                  { country: "Ethiopia", idps: "4.5M", refugees: "890K", crisis: "Regional conflicts", severity: "high" },
                  { country: "Nigeria", idps: "3.1M", refugees: "340K", crisis: "Boko Haram & banditry", severity: "medium" },
                  { country: "Mozambique", idps: "1.1M", refugees: "120K", crisis: "Insurgency", severity: "medium" },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-800/30 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-medium text-gray-200">{h.country}</span>
                        <SeverityBadge severity={h.severity} />
                      </div>
                      <p className="text-[9px] text-gray-600 mb-1">{h.crisis}</p>
                      <div className="flex gap-3 text-[10px]">
                        <span className="text-orange-400">IDPs: {h.idps}</span>
                        <span className="text-blue-400">Refugees: {h.refugees}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Widget>
          )}

        </div>
      </main>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-gray-800 bg-gray-900/30 py-3">
        <div className="max-w-[1920px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">AfricaDeck</span>
            <span>v1.0.0 MVP</span>
            <span>|</span>
            <span>Open-Source Intelligence for Africa</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Data Sources: ACLED, USGS, WHO, OCHA, Reuters, AFP, Bloomberg</span>
            <span>|</span>
            <span>Last sync: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>

      {/* ─── CUSTOM STYLES ───────────────────────────── */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        button { cursor: pointer; position: relative; z-index: 2; }
        input { position: relative; z-index: 2; }
        .pointer-events-none { pointer-events: none; }
        [class*="hover:"] { cursor: pointer; }
      `}</style>
    </div>
  );
}
