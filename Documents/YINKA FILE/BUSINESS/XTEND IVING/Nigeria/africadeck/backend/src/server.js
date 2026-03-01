import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const cache = new NodeCache({ stdTTL: 300 }); // 5-minute cache

app.use(cors());
app.use(express.json());

// ─── HEALTH CHECK ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'AfricaDeck API' });
});

// ─── EARTHQUAKES (USGS) ────────────────────────────────
// Africa bounding box: lat -35 to 38, lng -20 to 52
app.get('/api/earthquakes', async (req, res) => {
  const cacheKey = 'earthquakes';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=-35&maxlatitude=38&minlongitude=-20&maxlongitude=55&limit=50&orderby=time'
    );
    const data = await response.json();
    const earthquakes = data.features.map(f => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: f.properties.time,
      depth: f.geometry.coordinates[2],
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      tsunami: f.properties.tsunami === 1,
      url: f.properties.url,
    }));
    cache.set(cacheKey, earthquakes);
    res.json(earthquakes);
  } catch (error) {
    console.error('Earthquake API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

// ─── WEATHER (Open-Meteo — free, no API key) ───────────
app.get('/api/weather', async (req, res) => {
  const cacheKey = 'weather';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  // Major African cities
  const cities = [
    { name: 'Lagos', country: 'Nigeria', lat: 6.45, lon: 3.40 },
    { name: 'Nairobi', country: 'Kenya', lat: -1.29, lon: 36.82 },
    { name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24 },
    { name: 'Johannesburg', country: 'South Africa', lat: -26.20, lon: 28.04 },
    { name: 'Accra', country: 'Ghana', lat: 5.56, lon: -0.19 },
    { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.02, lon: 38.75 },
    { name: 'Casablanca', country: 'Morocco', lat: 33.57, lon: -7.59 },
    { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.79, lon: 39.28 },
    { name: 'Kinshasa', country: 'DRC', lat: -4.32, lon: 15.31 },
    { name: 'Luanda', country: 'Angola', lat: -8.84, lon: 13.23 },
  ];

  try {
    const results = await Promise.all(
      cities.map(async (city) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=relative_humidity_2m`
        );
        const data = await response.json();
        return {
          ...city,
          temp: data.current_weather?.temperature,
          windspeed: data.current_weather?.windspeed,
          weathercode: data.current_weather?.weathercode,
          humidity: data.hourly?.relative_humidity_2m?.[0],
        };
      })
    );
    cache.set(cacheKey, results);
    res.json(results);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ─── EXCHANGE RATES (exchangerate.host — free) ─────────
app.get('/api/currencies', async (req, res) => {
  const cacheKey = 'currencies';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const africanCurrencies = ['NGN', 'ZAR', 'KES', 'EGP', 'GHS', 'ETB', 'MAD', 'TZS', 'UGX', 'XOF', 'XAF', 'DZD', 'AOA', 'MZN'];

  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${africanCurrencies.join(',')}`);
    const data = await response.json();
    cache.set(cacheKey, data.rates);
    res.json(data.rates);
  } catch (error) {
    console.error('Currency API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch currency data' });
  }
});

// ─── CONFLICT DATA (ACLED-style) ───────────────────────
// Note: ACLED requires registration for API access.
// This endpoint serves as a proxy once you have an API key.
app.get('/api/conflicts', async (req, res) => {
  const cacheKey = 'conflicts';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const ACLED_KEY = process.env.ACLED_API_KEY;
  const ACLED_EMAIL = process.env.ACLED_EMAIL;

  if (!ACLED_KEY || !ACLED_EMAIL) {
    return res.json({
      note: 'ACLED API key required. Register at https://acleddata.com/register/',
      data: [],
    });
  }

  try {
    const response = await fetch(
      `https://api.acleddata.com/acled/read?key=${ACLED_KEY}&email=${ACLED_EMAIL}&region=1&region=2&region=3&region=4&region=5&limit=100&fields=event_date|event_type|sub_event_type|actor1|country|admin1|latitude|longitude|fatalities|source`
    );
    const data = await response.json();
    cache.set(cacheKey, data.data);
    res.json(data.data);
  } catch (error) {
    console.error('ACLED API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch conflict data' });
  }
});

// ─── DISEASE OUTBREAKS (WHO / ReliefWeb) ────────────────
app.get('/api/health-alerts', async (req, res) => {
  const cacheKey = 'health-alerts';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await fetch(
      'https://api.reliefweb.int/v1/reports?appname=africadeck&filter[field]=country.iso3&filter[value]=NGA,ZAF,KEN,ETH,COD,SDN,SOM,MOZ,TZA,UGA&filter[operator]=OR&filter[field]=theme.name&filter[value]=Health&limit=20&sort[]=date:desc'
    );
    const data = await response.json();
    const reports = data.data?.map(r => ({
      id: r.id,
      title: r.fields?.title,
      date: r.fields?.date?.created,
      source: r.fields?.source?.[0]?.name,
      country: r.fields?.country?.[0]?.name,
      url: r.fields?.url,
    }));
    cache.set(cacheKey, reports);
    res.json(reports || []);
  } catch (error) {
    console.error('ReliefWeb API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// ─── NEWS (GDELT or RSS aggregation) ────────────────────
app.get('/api/news', async (req, res) => {
  const cacheKey = 'news';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Using GDELT GKG for Africa-related news
    const response = await fetch(
      'https://api.gdeltproject.org/api/v2/doc/doc?query=Africa&mode=artlist&maxrecords=25&format=json&sourcelang=english'
    );
    const data = await response.json();
    const articles = data.articles?.map(a => ({
      title: a.title,
      url: a.url,
      source: a.domain,
      date: a.seendate,
      language: a.language,
      image: a.socialimage,
    }));
    cache.set(cacheKey, articles);
    res.json(articles || []);
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ─── START SERVER ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   AfricaDeck API Server                  ║
  ║   Running on http://localhost:${PORT}       ║
  ║   Endpoints:                             ║
  ║     GET /api/health                      ║
  ║     GET /api/earthquakes                 ║
  ║     GET /api/weather                     ║
  ║     GET /api/currencies                  ║
  ║     GET /api/conflicts                   ║
  ║     GET /api/health-alerts               ║
  ║     GET /api/news                        ║
  ╚══════════════════════════════════════════╝
  `);
});
