/* Minimal inline-SVG charts. One baseline, thin capped bars with a 4px rounded data end,
   hairline grid, values on the caps, per-bar hover tips via data-tip. */
(function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function niceStep(max, count) {
    const raw = max / Math.max(1, count);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
    return step * mag;
  }

  // Path for a bar whose data end (top) is rounded and baseline end is square.
  function columnPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }
  function rowPath(x, y, w, h, r) {
    r = Math.min(r, h / 2, w);
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }

  /* Vertical columns. data: [{ label, value, display, tip }] */
  function columns(data, opts = {}) {
    const W = opts.width || 680, H = opts.height || 240;
    const pad = { top: 22, right: 8, bottom: 26, left: 52 };
    const fmt = opts.format || ((v) => String(v));
    const vals = data.map((d) => Math.max(0, d.value || 0));
    const max = Math.max(...vals, 0) || 1;
    const step = niceStep(max, 4);
    const top = Math.ceil(max / step) * step;
    const iw = W - pad.left - pad.right, ih = H - pad.top - pad.bottom;
    const band = iw / data.length;
    const bw = Math.min(24, band * 0.6);
    const y = (v) => pad.top + ih - (v / top) * ih;
    let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Chart')}">`;
    for (let t = 0; t <= top + 1e-9; t += step) {
      const yy = y(t).toFixed(1);
      out += `<line class="${t === 0 ? 'baseline' : 'grid'}" x1="${pad.left}" x2="${W - pad.right}" y1="${yy}" y2="${yy}"/>`;
      out += `<text class="axis-label" x="${pad.left - 8}" y="${yy}" text-anchor="end" dominant-baseline="middle">${esc(fmt(t))}</text>`;
    }
    data.forEach((d, i) => {
      const v = Math.max(0, d.value || 0);
      const cx = pad.left + band * i + band / 2;
      const x = cx - bw / 2;
      const h = Math.max(v > 0 ? 1.5 : 0, (v / top) * ih);
      const yy = pad.top + ih - h;
      const cls = d.cls || opts.cls || 'mark-public';
      out += `<g class="bar" data-tip="${esc(d.tip || `${d.label}: ${d.display || fmt(v)}`)}">`;
      out += `<rect class="hit" x="${(cx - band / 2).toFixed(1)}" y="${pad.top}" width="${band.toFixed(1)}" height="${ih}"/>`;
      if (h > 0) out += `<path class="mark ${cls}" d="${columnPath(x, yy, bw, h, 4)}"/>`;
      out += `<text class="value-label" x="${cx.toFixed(1)}" y="${(yy - 6).toFixed(1)}" text-anchor="middle">${esc(d.display || fmt(v))}</text>`;
      out += `<text x="${cx.toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>`;
      out += `</g>`;
    });
    return out + `</svg>`;
  }

  /* Horizontal bars, one highlighted. data: [{ label, value, display, highlight, tip }] */
  function rows(data, opts = {}) {
    const W = opts.width || 680;
    const rowH = 26, gap = 6;
    const pad = { top: 6, right: 70, bottom: 6, left: opts.labelWidth || 150 };
    const H = pad.top + pad.bottom + data.length * (rowH + gap) - gap;
    const fmt = opts.format || ((v) => String(v));
    const max = Math.max(...data.map((d) => Math.max(0, d.value || 0)), 0) || 1;
    const iw = W - pad.left - pad.right;
    const bh = 14;
    let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Chart')}">`;
    out += `<line class="baseline" x1="${pad.left}" x2="${pad.left}" y1="${pad.top - 2}" y2="${H - pad.bottom + 2}"/>`;
    data.forEach((d, i) => {
      const v = Math.max(0, d.value || 0);
      const yy = pad.top + i * (rowH + gap);
      const w = Math.max(v > 0 ? 1.5 : 0, (v / max) * iw);
      const cls = d.highlight ? (opts.cls || 'mark-public') : 'mark-muted';
      const label = d.label.length > 22 ? d.label.slice(0, 21) + '…' : d.label;
      out += `<g class="bar" data-tip="${esc(d.tip || `${d.label}: ${d.display || fmt(v)}`)}">`;
      out += `<rect class="hit" x="0" y="${yy}" width="${W}" height="${rowH}"/>`;
      out += `<text x="${pad.left - 10}" y="${yy + rowH / 2}" text-anchor="end" dominant-baseline="middle"${d.highlight ? ' class="value-label"' : ''}>${esc(label)}</text>`;
      if (w > 0) out += `<path class="mark ${cls}" d="${rowPath(pad.left, yy + (rowH - bh) / 2, w, bh, 4)}"/>`;
      out += `<text class="${d.highlight ? 'value-label' : ''}" x="${(pad.left + w + 8).toFixed(1)}" y="${yy + rowH / 2}" dominant-baseline="middle">${esc(d.display || fmt(v))}</text>`;
      out += `</g>`;
    });
    return out + `</svg>`;
  }

  window.DTMCharts = { columns, rows };
})();
