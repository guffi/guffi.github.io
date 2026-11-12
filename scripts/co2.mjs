// Builds assets/data/co2.json for the header CO2 widget.
//
// Sources
//   - 800,000-year record: Antarctic ice-core composite (Bereiter et al. 2015), NOAA NCEI
//   - Latest reading and year-on-year change: NOAA GML, Mauna Loa Observatory
//
// Runs in the deploy workflow before Hugo. It never fails the build: if a source
// is unreachable or looks wrong, the previous values (restored from the workflow
// cache) are kept, and if there is nothing to fall back on the widget is omitted.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const OUT = process.env.CO2_OUT || 'assets/data/co2.json';
const ICE = process.env.CO2_ICE_URL ||
  'https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/antarctica2015co2composite.txt';
const DAILY = process.env.CO2_DAILY_URL ||
  'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_daily_mlo.csv';
const MONTHLY = process.env.CO2_MONTHLY_URL ||
  'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv';

// Chart geometry, in SVG viewBox units (viewBox is 0 0 204 44.2).
const W = 200;          // plot width
const Y_TOP = 2.2;      // y of today's reading
const Y_BOTTOM = 30;    // y of FLOOR_PPM
const FLOOR_PPM = 170;
const SPAN_BP = 800000; // years before 1950 shown at the left edge
const BIN_YEARS = 2500;
const SAPIENS_BP = 300000;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function load(src) {
  if (!/^https?:/.test(src)) return readFile(src, 'utf8');
  const res = await fetch(src, {
    headers: { 'user-agent': 'guffi.github.io co2 widget (github actions)' },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`${src} -> HTTP ${res.status}`);
  return res.text();
}

function numericRows(text, splitter) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const cells = t.split(splitter).map((c) => Number(c));
    if (cells.length >= 2 && cells.every((c) => Number.isFinite(c))) rows.push(cells);
  }
  return rows;
}

const plausible = (ppm) => ppm > 300 && ppm < 600;

// year,month,day,decimal date,ppm
function parseDaily(text) {
  const rows = numericRows(text, ',').filter(
    (r) => r.length >= 5 && r[0] > 1970 && r[1] >= 1 && r[1] <= 12 && r[2] >= 1 && r[2] <= 31 && plausible(r[4]),
  );
  if (!rows.length) throw new Error('no usable rows in daily file');
  const [y, m, d, , ppm] = rows[rows.length - 1];
  return { ppm, label: `${d} ${MONTHS[m - 1]} ${y}`, year: y };
}

// year,month,decimal date,average,deseasonalized,...
function parseMonthly(text) {
  const rows = numericRows(text, ',').filter(
    (r) => r.length >= 4 && r[0] > 1950 && r[1] >= 1 && r[1] <= 12 && plausible(r[3]),
  );
  if (rows.length < 13) throw new Error('no usable rows in monthly file');
  const last = rows[rows.length - 1];
  const prev = rows.find((r) => r[0] === last[0] - 1 && r[1] === last[1]);
  if (!prev) throw new Error('no same-month value a year earlier');
  return {
    ppm: last[3],
    label: `${MONTHS[last[1] - 1]} ${last[0]}`,
    year: last[0],
    yoy: last[3] - prev[3],
  };
}

// age (years before 1950), ppm, sigma
function parseIce(text) {
  const rows = numericRows(text, /\s+/).filter(
    (r) => r[0] > -100 && r[0] <= SPAN_BP + 10000 && r[1] > 100 && r[1] < 500,
  );
  if (rows.length < 500) throw new Error(`only ${rows.length} ice-core rows`);
  // Mean per time bin, pre-industrial part only (older than 1700 AD).
  const bins = new Map();
  for (const [age, ppm] of rows) {
    if (age < 250 || age > SPAN_BP) continue;
    const k = Math.floor(age / BIN_YEARS);
    const b = bins.get(k) || { n: 0, age: 0, ppm: 0 };
    b.n += 1; b.age += age; b.ppm += ppm;
    bins.set(k, b);
  }
  const series = [...bins.values()]
    .map((b) => [Math.round(b.age / b.n), Math.round((b.ppm / b.n) * 10) / 10])
    .sort((a, b) => b[0] - a[0]);
  if (series.length < 100) throw new Error(`only ${series.length} ice-core bins`);
  return series;
}

async function attempt(name, fn) {
  try {
    const v = await fn();
    console.log(`co2: ${name} ok`);
    return v;
  } catch (err) {
    console.log(`co2: ${name} FAILED - ${err.message}`);
    return null;
  }
}

const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

async function main() {
  let prev = {};
  try { prev = JSON.parse(await readFile(OUT, 'utf8')); } catch { /* first run */ }

  const [ice, daily, monthly] = await Promise.all([
    attempt('ice core', async () => parseIce(await load(ICE))),
    attempt('daily', async () => parseDaily(await load(DAILY))),
    attempt('monthly', async () => parseMonthly(await load(MONTHLY))),
  ]);

  const series = ice || prev.series;
  const now = daily || monthly;
  const ppm = now ? now.ppm : Number(prev.ppm);
  const asOf = now ? now.label : prev.asOf;
  const year = now ? now.year : new Date().getUTCFullYear();
  const yoy = monthly ? (monthly.yoy >= 0 ? '+' : '−') + f1(Math.abs(monthly.yoy)) : prev.yoy || '';
  const yoyBasis = monthly ? monthly.label : prev.yoyBasis || '';

  if (!series || !plausible(ppm)) {
    console.log('co2: nothing usable and no previous data; widget will be omitted');
    return;
  }

  const span = SPAN_BP + (year - 1950);
  const x = (age) => ((SPAN_BP - age) / span) * W;
  const y = (v) => Y_BOTTOM - ((v - FLOOR_PPM) / (ppm - FLOOR_PPM)) * (Y_BOTTOM - Y_TOP);
  const points = series
    .map(([age, v]) => `${f1(x(age))},${f1(y(v))}`)
    .concat(`${f1(W)},${f1(y(ppm))}`)
    .join(' ');

  const peak = Math.max(...series.map((p) => p[1]));
  const title =
    `Atmospheric CO₂: ${f1(ppm)} ppm at Mauna Loa (${asOf})` +
    (yoy ? `, ${yoy} ppm on a year earlier` : '') +
    `. The line is the last 800,000 years from Antarctic ice cores, where it stayed below 300 ppm (dashed). Source: NOAA.`;

  const out = {
    ppm: f1(ppm),
    asOf,
    yoy,
    yoyBasis,
    title,
    points,
    dotY: f1(y(ppm)),
    y300: f1(y(300)),
    xSapiens: f1(x(SAPIENS_BP)),
    series,
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out));
  console.log(
    `co2: wrote ${OUT} - ${out.ppm} ppm (${asOf}), yoy ${yoy || 'n/a'} (${yoyBasis || 'n/a'}), ` +
    `${series.length} ice-core points, pre-industrial peak ${peak} ppm, ` +
    `sources: ice=${ice ? 'fresh' : 'cached'} now=${daily ? 'daily' : monthly ? 'monthly' : 'cached'}`,
  );
}

main().catch((err) => console.log(`co2: unexpected error - ${err.message}`));
