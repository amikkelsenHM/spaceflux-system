// Waterfall scatter prototype (dummy data)
// Renders a scatter plot: x = Longitude, y = Datetime (days), series = satellites
// Uses Spaceflux design system; tooltip and legend included

function formatTimeHM(d) {
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm} UTC`;
}

function formatDateLabel(d) {
  // e.g., May 11
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function seedRandom(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff;
}

function makeSeedFromString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function daysAround(date, daysBefore = 3, daysAfter = 3) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysBefore));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + daysAfter + 1));
  return { start, end };
}

function generateScatter({ rng, baseDate, seriesCount = 3, pointsPerSeries = 50, lonCenter = 156, lonSpan = 2 }) {
  // Produce multiple series with slightly slanted clusters across days/longitudes
  const { start, end } = daysAround(baseDate, 3, 3);
  const spanMs = end - start;
  const data = [];
  for (let s = 0; s < seriesCount; s++) {
    const series = { key: `NORAD ${35000 + s * 1000 + Math.floor(rng() * 999)}`, points: [] };
    // Small slope across the normalized time [0,1], not per millisecond
    const slope = (rng() - 0.5) * 0.6; // at most ~±0.3 deg across the span
    const baseOffset = (rng() - 0.5) * 0.4; // per-series longitude offset
    for (let i = 0; i < pointsPerSeries; i++) {
      const t = rng();
      const ts = start.getTime() + t * spanMs;
      const jitter = (rng() - 0.5) * 0.12;
      let lon = lonCenter + baseOffset + (t - 0.5) * lonSpan + jitter + slope * (t - 0.5);
      // Clamp slightly beyond domain to keep visible
      const minX = lonCenter - lonSpan / 2 - 0.2;
      const maxX = lonCenter + lonSpan / 2 + 0.2;
      if (lon < minX) lon = minX + (rng() * 0.05);
      if (lon > maxX) lon = maxX - (rng() * 0.05);
      const dt = new Date(ts);
      series.points.push({ x: lon, y: dt });
    }
    data.push(series);
  }
  return { data, yStart: start, yEnd: end, xMin: lonCenter - lonSpan / 2 - 0.5, xMax: lonCenter + lonSpan / 2 + 0.5 };
}

function initWaterfall() {
  const canvas = document.getElementById('waterfall-canvas');
  if (!canvas) return;
  const container = document.getElementById('chart-container');
  const tooltip = document.getElementById('tooltip');
  const ttTitle = document.getElementById('tt-title');
  const ttBody = document.getElementById('tt-body');
  const ttSeries = document.getElementById('tt-series');
  const legend = document.getElementById('legend');

  const locationSel = document.getElementById('location');
  const dateInput = document.getElementById('date');
  const countSel = document.getElementById('count');

  // Default date today
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getUTCFullYear();
    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(today.getUTCDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  const palette = [
    '#a78bfa', // violet
    '#34d399', // emerald
    '#fb7185', // rose
    '#facc15', // amber
    '#22d3ee', // cyan
  ];

  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const ctx = canvas.getContext('2d');

  let state = { series: [], yStart: null, yEnd: null, xMin: 0, xMax: 1, hidden: new Set() };
  let layout = null;

  function seed() {
    const loc = locationSel?.value || 'london';
    const day = dateInput?.value || '2025-01-01';
    const cnt = countSel?.value || '10';
    return makeSeedFromString(`${loc}|${day}|${cnt}`);
  }

  function regenerate() {
    const baseDate = new Date(dateInput?.value || '2025-01-01');
    const rng = seedRandom(seed());
    const seriesCount = Math.min(4, Math.max(3, Math.floor((parseInt(countSel?.value || '10', 10)) / 3)));
    const { data, yStart, yEnd, xMin, xMax } = generateScatter({ rng, baseDate, seriesCount, pointsPerSeries: 48, lonCenter: 156, lonSpan: 2 });
    // decorate colors
    data.forEach((s, i) => (s.color = palette[i % palette.length]));
    state.series = data;
    state.yStart = yStart; state.yEnd = yEnd; state.xMin = xMin; state.xMax = xMax;
    buildLegend();
    requestRender();
  }

  function buildLegend() {
    if (!legend) return;
    legend.innerHTML = '';
    state.series.forEach((s, i) => {
      const item = document.createElement('button');
      item.className = 'badge';
      item.style.backgroundColor = 'rgba(255,255,255,0.06)';
      item.style.border = '1px solid rgba(255,255,255,0.15)';
      item.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${s.color};"></span>${s.key}`;
      item.addEventListener('click', () => {
        if (state.hidden.has(s.key)) state.hidden.delete(s.key); else state.hidden.add(s.key);
        item.style.opacity = state.hidden.has(s.key) ? '0.45' : '1';
        requestRender();
      });
      legend.appendChild(item);
    });
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(460);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    requestRender();
  }

  function timeToY(d) {
    const t0 = state.yStart.getTime();
    const t1 = state.yEnd.getTime();
    return layout.plotBottom - ((d.getTime() - t0) / (t1 - t0)) * layout.plotHeight;
  }
  function lonToX(lon) {
    const { xMin, xMax } = state;
    const t = (lon - xMin) / (xMax - xMin);
    return layout.plotLeft + t * layout.plotWidth;
  }
  function xToLon(x) {
    const { xMin, xMax } = state;
    const t = (x - layout.plotLeft) / layout.plotWidth;
    return xMin + t * (xMax - xMin);
  }
  function yToDate(y) {
    const t0 = state.yStart.getTime();
    const t1 = state.yEnd.getTime();
    const t = (layout.plotBottom - y) / layout.plotHeight;
    return new Date(t0 + t * (t1 - t0));
  }

  function drawAxes() {
    const grid = 'rgba(255,255,255,0.1)';
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    // vertical grid (x) 6 ticks
    for (let i = 0; i <= 6; i++) {
      const x = layout.plotLeft + (i / 6) * layout.plotWidth;
      ctx.moveTo(x, layout.plotTop);
      ctx.lineTo(x, layout.plotBottom);
    }
    // horizontal grid (y) 7 ticks (days)
    for (let i = 0; i <= 7; i++) {
      const y = layout.plotTop + (i / 7) * layout.plotHeight;
      const yy = layout.plotBottom - (i / 7) * layout.plotHeight; // reference
      ctx.moveTo(layout.plotLeft, y);
      ctx.lineTo(layout.plotRight, y);
    }
    ctx.stroke();

    // y labels (left)
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `${12 * dpr}px IBM Plex Sans, system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 7; i++) {
      const t = i / 7;
      const y = layout.plotBottom - t * layout.plotHeight;
      const ms = state.yStart.getTime() + t * (state.yEnd.getTime() - state.yStart.getTime());
      const d = new Date(ms);
      const label = `${d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
      ctx.fillText(label, layout.left + 4 * dpr, y);
    }

    // x labels (bottom)
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const x = layout.plotLeft + t * layout.plotWidth;
      const lon = state.xMin + t * (state.xMax - state.xMin);
      const label = lon.toFixed(1);
      ctx.fillText(label, x - ctx.measureText(label).width / 2, layout.bottom - 10 * dpr);
    }
  }

  function drawPoints(hover) {
    for (const s of state.series) {
      if (state.hidden.has(s.key)) continue;
      ctx.fillStyle = s.color;
      for (const p of s.points) {
        const x = lonToX(p.x);
        const y = timeToY(p.y);
        const r = 3.0 * dpr;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (hover) {
      ctx.strokeStyle = '#c09eff'; // iris outline
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(hover.x, hover.y, 4 * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function draw() {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // If data not ready, skip drawing until regenerate() runs
    if (!state.yStart || !state.yEnd || !state.series.length) return;

    // layout
    const left = 48 * dpr, right = 18 * dpr, top = 12 * dpr, bottom = 28 * dpr;
    const plotLeft = left + 36 * dpr; // leave space for y labels
    const plotTop = top + 12 * dpr;
    const plotRight = width - right;
    const plotBottom = height - bottom;
    const plotWidth = plotRight - plotLeft;
    const plotHeight = plotBottom - plotTop;
    layout = { left, right, top, bottom, plotLeft, plotTop, plotRight, plotBottom, plotWidth, plotHeight };

    drawAxes();
    drawPoints(currentHover);
  }

  function findNearest(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;
    if (!layout) return null;
    let best = null;
    let bestD2 = (12 * dpr) ** 2; // larger pick radius
    for (const s of state.series) {
      if (state.hidden.has(s.key)) continue;
      for (const p of s.points) {
        const px = lonToX(p.x);
        const py = timeToY(p.y);
        const dx = px - x, dy = py - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) { bestD2 = d2; best = { s, p, x: px, y: py }; }
      }
    }
    return best;
  }

  let raf = 0;
  let currentHover = null;
  function requestRender() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function showTooltip(hit, relX, relY) {
  // Only show when hovering a point
  if (!hit) { tooltip.classList.add('hidden'); return; }
  const containerRect = container.getBoundingClientRect();
  // relX/relY are container-relative CSS pixels; hit already has data
  ttSeries.textContent = `${formatDateLabel(hit.p.y)} • ${formatTimeHM(hit.p.y)}`;
  ttTitle.textContent = hit.s.key;
  ttBody.textContent = `Longitude ${hit.p.x.toFixed(3)}°`;
  // Viewport-fixed positioning at the cursor to avoid any container offsets
  const estW = 260; // px
  const estH = 120; // px
  let fx = relX + containerRect.left + 8;   // viewport X
  let fy = relY + containerRect.top + 8;    // viewport Y
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (fx + estW > vw - 8) fx = relX + containerRect.left - estW - 8;
  if (fy + estH > vh - 8) fy = relY + containerRect.top - estH - 8;
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${Math.max(8, fx)}px`;
  tooltip.style.top = `${Math.max(8, fy)}px`;
  tooltip.style.transform = 'translate3d(0,0,0)';
  tooltip.style.willChange = 'top, left';
  tooltip.classList.remove('hidden');
  }

  function handleMove(e) {
    const cRect = container.getBoundingClientRect();
    const relX = e.clientX - cRect.left;
    const relY = e.clientY - cRect.top;
    const hit = findNearest(e.clientX, e.clientY);
    currentHover = hit ? { x: hit.x, y: hit.y } : null;
    requestRender();
    if (hit) showTooltip(hit, relX, relY); else tooltip.classList.add('hidden');
  }

  function handleLeave() {
    currentHover = null;
    requestRender();
    tooltip.classList.add('hidden');
  }

  window.addEventListener('resize', resize);
  container.addEventListener('mousemove', handleMove);
  container.addEventListener('mouseleave', handleLeave);
  locationSel?.addEventListener('change', regenerate);
  dateInput?.addEventListener('change', regenerate);
  // Ensure clicking anywhere in the date input opens the picker
  if (dateInput) {
    dateInput.addEventListener('click', () => {
      if (typeof dateInput.showPicker === 'function') {
        try { dateInput.showPicker(); } catch (_) { dateInput.focus(); }
      } else {
        dateInput.focus();
      }
    });
  }
  countSel?.addEventListener('change', regenerate);

  // Generate data first, then size and render
  regenerate();
  resize();
}

// End of module

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWaterfall);
} else {
  initWaterfall();
}
