export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,800;1,300&family=DM+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #e8e4dc; --paper: #1a1917; --muted: #888480;
    --border: #333230; --btn-bg: #232220; --btn-hover: #2c2b29;
    --drawer-border: #444240;
    --sans: 'Inter', system-ui, sans-serif;
    --body: 'Inter', system-ui, sans-serif;
    --mono: 'DM Mono', 'Courier New', monospace;
  }
  [data-theme="light"] {
    --ink: #111110; --paper: #f6f4ef; --muted: #6b6860;
    --border: #c8c4bb; --btn-bg: #ffffff; --btn-hover: #f0ede7;
    --drawer-border: #111110;
  }

  html, body { height: 100%; }
  body { background: var(--paper); color: var(--ink); font-family: var(--body); min-height: 100vh; transition: background 0.2s, color 0.2s; }

  .wrap { width: 100%; max-width: 500px; margin: 0 auto; padding: 3.5rem 1.5rem 5rem; }

  /* Header */
  .header-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.3rem; }
  .site-name { font-family: var(--sans); font-size: clamp(1.5rem,5vw,2rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.15; color: var(--ink); cursor: pointer; background: none; border: none; padding: 0; text-align: left; text-decoration: none; display: block; transition: opacity 0.15s; }
  .site-name:hover { opacity: 0.5; }
  .theme-btn { background: none; border: 1px solid var(--border); border-radius: 20px; cursor: pointer; padding: 0.28rem 0.7rem; font-family: var(--mono); font-size: 0.62rem; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; margin-top: 0.3rem; flex-shrink: 0; transition: opacity 0.15s; }
  .theme-btn:hover { opacity: 0.7; }
  .tagline { font-family: var(--mono); font-size: 0.68rem; font-weight: 300; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 2.2rem; }

  /* Back link on subpages */
  .back-link { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--mono); font-size: 0.7rem; color: var(--muted); text-decoration: none; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2rem; border-bottom: 1px solid transparent; transition: color 0.12s, border-color 0.12s; }
  .back-link:hover { color: var(--ink); border-color: var(--muted); }

  /* Page title on subpages */
  .page-title { font-family: var(--sans); font-size: clamp(1.3rem,4vw,1.8rem); font-weight: 800; letter-spacing: -0.04em; color: var(--ink); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
  .page-title .pg-emoji { filter: grayscale(100%); }
  .page-subtitle { font-family: var(--mono); font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2rem; }

  /* Stack */
  .stack { display: flex; flex-direction: column; gap: 0.5rem; }
  .stack-btn, .stack-ext { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.85rem 1.1rem; background: var(--btn-bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; text-align: left; text-decoration: none; transition: background 0.15s, border-color 0.15s; }
  .stack-btn:hover, .stack-ext:hover { background: var(--btn-hover); border-color: var(--muted); }
  .stack-btn.open { background: var(--ink); border-color: var(--ink); border-radius: 6px 6px 0 0; }
  .btn-left { display: flex; align-items: center; gap: 0.6rem; }
  .btn-emoji { font-size: 1rem; line-height: 1; flex-shrink: 0; filter: grayscale(100%); }
  .btn-label { font-family: var(--sans); font-size: 0.95rem; font-weight: 500; color: var(--ink); letter-spacing: -0.01em; }
  .stack-btn.open .btn-label { color: var(--paper); }
  .stack-ext .btn-label { color: var(--ink); }
  .btn-icon { font-family: var(--mono); font-size: 0.82rem; color: var(--muted); flex-shrink: 0; margin-left: 0.8rem; }
  .stack-btn.open .btn-icon { color: #888; }

  /* Smooth drawer — uses inline style height set by ResizeObserver */
  .drawer-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.35s ease; }
  .drawer-wrap.open { grid-template-rows: 1fr; }
  .drawer-wrap > div { overflow: hidden; }
  .drawer-inner { padding: 1.3rem 1.2rem 1.1rem; background: var(--btn-bg); border: 1px solid var(--drawer-border); border-top: none; border-radius: 0 0 6px 6px; transition: background 0.2s, border-color 0.2s; }

  .intro { font-family: var(--body); font-size: 0.88rem; line-height: 1.75; color: var(--muted); margin-bottom: 1.1rem; font-style: italic; }
  .body-text { font-family: var(--body); font-size: 0.9rem; line-height: 1.75; color: var(--ink); margin-bottom: 1rem; }

  /* Book gallery */
  .book-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin-bottom: 1rem; }
  @media (max-width: 420px) { .book-grid { grid-template-columns: repeat(3, 1fr); } }
  .book-card { cursor: pointer; aspect-ratio: 2/3; background: var(--border); border-radius: 3px; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; }
  .book-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
  .book-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .no-cover { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.5rem; text-align: center; gap: 0.3rem; }
  .no-cover span:first-child { font-size: 1.4rem; }
  .no-cover span:last-child { font-family: var(--mono); font-size: 0.5rem; color: var(--muted); line-height: 1.3; }

  /* Book overlay */
  .book-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .book-detail { background: var(--btn-bg); border-radius: 10px; max-width: 420px; width: 100%; max-height: 90vh; overflow-y: auto; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .detail-cover { width: 100%; aspect-ratio: 3/2; overflow: hidden; border-radius: 10px 10px 0 0; background: var(--border); }
  .detail-cover img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .detail-cover .no-cover-lg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
  .detail-body { padding: 1.4rem 1.5rem 1.6rem; }
  .detail-title { font-family: var(--serif); font-size: 1.15rem; font-weight: 700; line-height: 1.3; color: var(--ink); margin-bottom: 0.25rem; }
  .detail-meta { font-family: var(--mono); font-size: 0.68rem; color: var(--muted); letter-spacing: 0.04em; margin-bottom: 0.8rem; }
  .detail-genre { display: inline-block; font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border); border-radius: 20px; padding: 0.15rem 0.55rem; margin-bottom: 0.9rem; }
  .detail-blurb { font-size: 0.88rem; line-height: 1.75; color: var(--ink); font-style: italic; }
  .detail-close { display: block; width: 100%; margin-top: 1.2rem; padding: 0.65rem; font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); background: none; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: background 0.12s; }
  .detail-close:hover { background: var(--btn-hover); }

  /* Speeches */
  .speech-intro { font-size: 0.9rem; line-height: 1.75; color: var(--ink); margin-bottom: 1.2rem; }
  .speech-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .speech-item { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .speech-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; text-decoration: none; transition: background 0.12s; }
  .speech-row:hover { background: var(--btn-hover); }
  .speech-row.no-link { cursor: default; opacity: 0.5; }
  .speech-meta { display: flex; flex-direction: column; gap: 0.1rem; }
  .speech-year { font-family: var(--mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.06em; }
  .speech-title { font-family: var(--serif); font-size: 0.92rem; color: var(--ink); font-style: italic; }
  .speech-arrow { font-family: var(--mono); font-size: 0.75rem; color: var(--muted); flex-shrink: 0; margin-left: 1rem; }

  /* YouTube videos */
  .video-list { display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 1rem; }
  .video-item {}
  .video-title { font-family: var(--serif); font-size: 0.88rem; color: var(--muted); margin-bottom: 0.5rem; font-style: italic; }
  .video-embed { width: 100%; aspect-ratio: 16/9; border-radius: 4px; overflow: hidden; }
  .video-embed iframe { width: 100%; height: 100%; border: none; display: block; }

  /* Crosswords */
  .puzzle-list { display: flex; flex-direction: column; gap: 1.4rem; margin-bottom: 1rem; }
  .puzzle-title { font-family: var(--serif); font-size: 0.88rem; color: var(--muted); margin-bottom: 0.5rem; font-style: italic; }
  .puzzle-embed { width: 100%; height: 500px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .puzzle-embed iframe { width: 100%; height: 100%; border: none; display: block; }

  /* Quotes */
  .quote-list { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1rem; }
  .quote-list li { font-family: var(--body); font-size: 0.88rem; line-height: 1.8; color: var(--ink); padding-left: 0.9rem; border-left: 2px solid var(--border); font-style: italic; }

  /* Drawer links */
  .drawer-links { margin-top: 1rem; padding-top: 0.9rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.4rem; }
  .drawer-link { font-family: var(--mono); font-size: 0.72rem; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; width: fit-content; border-bottom: 1px solid transparent; transition: color 0.12s, border-color 0.12s; }
  .drawer-link:hover { color: var(--ink); border-color: var(--muted); }
  .drawer-link--soon { opacity: 0.4; cursor: default; }

  .loading-msg { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); letter-spacing: 0.05em; padding: 1rem 0; animation: blink 1.1s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  /* Speech list — plain links, no table borders */
  .speech-list { display: flex; flex-direction: column; margin-bottom: 1rem; }
  .speech-item { }
  .speech-link { display: flex; align-items: baseline; gap: 0.75rem; padding: 0.6rem 0; text-decoration: none; border-bottom: 1px solid transparent; transition: opacity 0.12s; }
  .speech-link:hover { opacity: 0.6; }
  .speech-link--disabled { display: flex; align-items: baseline; gap: 0.75rem; padding: 0.6rem 0; opacity: 0.35; }
  .speech-year-tag { font-family: var(--mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.06em; flex-shrink: 0; min-width: 2.8rem; }
  .speech-title-text { font-family: var(--serif); font-size: 0.92rem; color: var(--ink); font-style: italic; flex: 1; }
  .speech-ext { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); flex-shrink: 0; }

  /* YouTube video list */
  .video-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .video-embed { width: 100%; aspect-ratio: 16/9; overflow: hidden; }
  .video-embed iframe { width: 100%; height: 100%; border: none; display: block; }

  /* Crossword puzzle list */
  .puzzle-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .puzzle-embed { width: 100%; height: 500px; border-radius: 0 0 4px 4px; overflow: hidden; }
  .puzzle-embed iframe { width: 100%; height: 100%; border: none; display: block; }

`;

