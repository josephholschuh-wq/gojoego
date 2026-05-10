import { useState, useEffect } from "react";
import { BOOKS, SPEECHES, YOUTUBE_VIDEOS, CROSSWORD_PUZZLES, WISDOM, COMMONPLACE, SECTIONS } from "./data.js";
import { css } from "./styles.js";

// ─── Books data from Notion ──────────────────────────────────────────────────
// /api/books returns all book data (properties + cover images) sorted newest first.
// Falls back to static BOOKS data if the API is unavailable.
async function fetchBooks() {
  try {
    const res = await fetch("/api/books");
    if (!res.ok) { console.error("books fetch failed:", res.status); return null; }
    const data = await res.json();
    if (data.error) { console.error("books API error:", data.error); return null; }
    return data;
  } catch (e) {
    console.error("fetchBooks error:", e);
    return null;
  }
}

// ─── SEO ──────────────────────────────────────────────────────────────────────
function SEO({ path }) {
  useEffect(() => {
    const titles = {
      "/": "Joe Holschuh — English Teacher and Other Things",
      "/books": "Full Moon Books — Joe Holschuh",
      "/speeches": "Speeches — Joe Holschuh",
      "/crosswords": "Crosswords — Joe Holschuh",
      "/podcast": "Podcast — Joe Holschuh",
      "/youtube": "YouTube — Joe Holschuh",
      "/essays": "Essays — Joe Holschuh",
      "/wisdom": "The Wisdom Project — Joe Holschuh",
      "/projects": "Projects — Joe Holschuh",
    };
    document.title = titles[path] || titles["/"];
    const m = (n, c, p = false) => {
      const a = p ? "property" : "name";
      let el = document.querySelector(`meta[${a}="${n}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(a, n); document.head.appendChild(el); }
      el.setAttribute("content", c);
    };
    m("description", "Joe Holschuh is an English teacher, podcaster, and crossword constructor in Kimberly and Appleton, Wisconsin. Host of You Don't Know Lit.");
    m("author", "Joe Holschuh");
    m("keywords", "Joe Holschuh, Joseph Holschuh, Mr. Holschuh, Joe Holschuh Kimberly, Joe Holschuh Appleton, You Don't Know Lit, YDKL, crossword constructor, English teacher Wisconsin");
    m("robots", "index, follow");
    m("og:title", titles[path] || titles["/"], true);
    m("og:description", "Host of You Don't Know Lit. English teacher in Kimberly and Appleton, WI. Crossword constructor.", true);
    m("og:type", "website", true);
    m("og:url", `https://gojoego.co${path}`, true);
    m("twitter:card", "summary");
    let can = document.querySelector("link[rel='canonical']");
    if (!can) { can = document.createElement("link"); can.setAttribute("rel", "canonical"); document.head.appendChild(can); }
    can.setAttribute("href", `https://gojoego.co${path}`);
    if (path === "/") {
      const jld = {
        "@context": "https://schema.org", "@type": "Person",
        "name": "Joe Holschuh", "alternateName": ["Joseph Holschuh", "Mr. Holschuh"],
        "url": "https://gojoego.co",
        "jobTitle": ["English Teacher", "Podcaster", "Crossword Constructor"],
        "worksFor": { "@type": "Organization", "name": "Kimberly Area School District" },
        "address": [
          { "@type": "PostalAddress", "addressLocality": "Kimberly", "addressRegion": "WI", "addressCountry": "US" },
          { "@type": "PostalAddress", "addressLocality": "Appleton", "addressRegion": "WI", "addressCountry": "US" }
        ],
        "sameAs": ["https://www.instagram.com/josephholschuh/", "https://www.youtube.com/@JosephHolschuh", "https://www.youdontknowlitpodcast.com/", "https://crosshare.org/gojoego", "https://roboholschuh.netlify.app"],
      };
      let s = document.querySelector("script[data-seo='joe']");
      if (!s) { s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-seo", "joe"); document.head.appendChild(s); }
      s.textContent = JSON.stringify(jld);
    }
  }, [path]);
  return null;
}

// ─── Smooth drawer ────────────────────────────────────────────────────────────
function Drawer({ open, children }) {
  return (
    <div className={`drawer-wrap${open ? " open" : ""}`}>
      <div><div className="drawer-inner">{children}</div></div>
    </div>
  );
}

function DrawerLinks({ links, onNav }) {
  if (!links?.length) return null;
  return (
    <div className="drawer-links">
      {links.map((l, i) => {
        if (!l.url) return <span key={i} className="drawer-link drawer-link--soon">{l.text} — coming soon</span>;
        if (l.internal && onNav) return (
          <a key={i} href={l.url} className="drawer-link" onClick={e => { e.preventDefault(); onNav(l.url); }}>{l.text} ↗</a>
        );
        return <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="drawer-link">{l.text} ↗</a>;
      })}
    </div>
  );
}

// ─── Crosswords ───────────────────────────────────────────────────────────────
function CrosswordsContent() {
  return (
    <>
      <p className="body-text">My very first job after college was for a defense contractor. We had a lot of downtime. Each day, someone would photocopy the USA Today crossword puzzle and we would race. I've been doing crosswords ever since, but I first tried my hand at constructing when Puzzmo ran its first Open Submission week. While that first puzzle didn't get accepted, creating it unlocked something in my brain.</p>
      <DrawerLinks links={[
        ...CROSSWORD_PUZZLES.map(p => ({
          text: p.title,
          url: p.comingSoon ? null : `https://crosshare.org/crosswords/${p.slug}`,
        })),
        { text: "All my puzzles on Crosshare", url: "https://crosshare.org/gojoego" },
        { text: "Puzzmo", url: "https://www.puzzmo.com/today/" },
      ]} />
    </>
  );
}

// ─── Speeches ─────────────────────────────────────────────────────────────────
function SpeechesContent() {
  return (
    <>
      <p className="body-text">From time to time, I've been asked by the senior class to deliver the end-of-year commencement address. I'm extremely flattered every time this happens, and I end up proud of what I write.</p>
      <DrawerLinks links={[
        ...SPEECHES.map(s => s.url
          ? { text: `${s.year} — ${s.title}`, url: s.url }
          : { text: `${s.year} — ${s.title}`, url: null }
        ),
        { text: "YouTube channel", url: "https://www.youtube.com/@JosephHolschuh" },
      ]} />
    </>
  );
}

// ─── YouTube ──────────────────────────────────────────────────────────────────
function YouTubeContent() {
  return (
    <>
      <p className="body-text">Every once in a while, I get a bug to make a video. I don't pretend that these are done with any skill, but I often think they're fun.</p>
      <DrawerLinks links={[
        ...YOUTUBE_VIDEOS.map(v => ({ text: v.title, url: v.url })),
        { text: "YouTube channel", url: "https://www.youtube.com/@JosephHolschuh" },
      ]} />
    </>
  );
}

// ─── Books (home drawer version) ──────────────────────────────────────────────
function HomeBookGallery({ onNav, books, loading }) {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <p className="intro">Inspired by Adam Aaronson's Full Moon Albums — most recent first. Click any cover.</p>
      {loading && <div className="loading-msg">loading from Notion…</div>}
      {!loading && books.length > 0 && (
        <div className="book-grid">
          {books.map(book => (
            <div key={book.id} className="book-card" onClick={() => setSelected(book)} title={book.title}>
              {book.cover
                ? <img src={book.cover} alt={book.title} loading="lazy" />
                : <div className="no-cover"><span>🌕</span><span>{book.title}</span></div>
              }
            </div>
          ))}
        </div>
      )}
      <div className="drawer-links">
        <a href="https://aaronson.org/full-moon-albums/" target="_blank" rel="noopener noreferrer" className="drawer-link">Inspired by Aaron Aaronson's Full Moon Albums ↗</a>
        <a href="/books" className="drawer-link" onClick={e => { e.preventDefault(); onNav("/books"); }}>View full page ↗</a>
      </div>
      {selected && (
        <div className="book-overlay" onClick={() => setSelected(null)}>
          <div className="book-detail" onClick={e => e.stopPropagation()}>
            <div className="detail-cover">
              {selected.cover ? <img src={selected.cover} alt={selected.title} /> : <div className="no-cover-lg">🌕</div>}
            </div>
            <div className="detail-body">
              <div className="detail-title">{selected.title}</div>
              <div className="detail-meta">{selected.author}{selected.year ? ` · ${selected.year}` : ""}</div>
              {selected.genre && <div className="detail-genre">{selected.genre}</div>}
              {selected.blurb && <p className="detail-blurb">{selected.blurb}</p>}
              <button className="detail-close" onClick={() => setSelected(null)}>close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Generic content ──────────────────────────────────────────────────────────
function GenericContent({ section, onNav }) {
  if (section.type === "quotes") return (
    <>
      <p className="intro">{section.intro}</p>
      <ul className="quote-list">{section.quotes.slice(0, 5).map((q, i) => <li key={i}>{typeof q === "string" ? q : q.quote}{q.attr ? ` — ${q.attr}` : ""}</li>)}</ul>
      <DrawerLinks links={[
        ...( section.links || [] ),
        section.slug ? { text: `View all ${section.quotes.length} entries`, url: `/${section.slug}`, internal: true } : null
      ].filter(Boolean)} onNav={onNav} />
    </>
  );
  return (
    <>
      <p className="body-text">{section.body}</p>
      <DrawerLinks links={section.links} />
    </>
  );
}

function HomeSectionContent({ section, onNav, books, booksLoading }) {
  if (section.type === "crosswords") return <CrosswordsContent />;
  if (section.type === "speeches")   return <SpeechesContent />;
  if (section.type === "youtube")    return <YouTubeContent />;
  if (section.type === "books")      return <HomeBookGallery onNav={onNav} books={books} loading={booksLoading} />;
  return <GenericContent section={section} onNav={onNav} />;
}

function SubSectionContent({ section }) {
  if (section.type === "crosswords") return <CrosswordsContent />;
  if (section.type === "speeches")   return <SpeechesContent />;
  if (section.type === "youtube")    return <YouTubeContent />;
  return <GenericContent section={section} />;
}

// ─── Full Moon Books page ─────────────────────────────────────────────────────
const bpCss = `
  .bp-wrap { max-width: 1000px; margin: 0 auto; padding: 3rem 2rem 6rem; }

  /* Top bar */
  .bp-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3.5rem; }
  .bp-back { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid transparent; transition: color 0.12s, border-color 0.12s; }
  .bp-back:hover { color: var(--ink); border-color: var(--muted); }

  /* Header */
  .bp-header { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; margin-bottom: 3.5rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border); }
  @media (max-width: 640px) { .bp-header { grid-template-columns: 1fr; gap: 1.5rem; } }
  .bp-header-left {}
  .bp-moon-title { font-family: 'Inter', system-ui, sans-serif; font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.0; color: var(--ink); margin-bottom: 0.5rem; }
  .bp-moon-emoji { display: block; font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 0.35rem; line-height: 1; }
  .bp-moon-sub { font-family: var(--mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .bp-header-right {}
  .bp-intro-text { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; line-height: 1.85; color: var(--muted); }
  .bp-intro-text a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
  .bp-intro-text p { margin-bottom: 0.9rem; }
  .bp-intro-text p:last-child { margin-bottom: 0; }
  .bp-stats { display: flex; gap: 2rem; margin-top: 2rem; }
  .bp-stat { display: flex; flex-direction: column; gap: 0.15rem; }
  .bp-stat-n { font-family: var(--serif); font-size: 2rem; font-weight: 700; color: var(--ink); line-height: 1; }
  .bp-stat-l { font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

  /* Controls */
  .bp-controls { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 2rem; }
  .bp-count { font-family: var(--mono); font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em; }
  .bp-select {
    font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--ink); background: var(--btn-bg); border: 1px solid var(--border);
    border-radius: 6px; padding: 0.35rem 2rem 0.35rem 0.7rem; cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888480'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.6rem center;
    transition: border-color 0.12s;
  }
  .bp-select:hover { border-color: var(--muted); }
  .bp-select:focus { outline: none; border-color: var(--ink); }

  /* Grid — 4 across */
  .bp-loading { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); padding: 4rem 0; animation: blink 1.1s ease infinite; }
  .bp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem 1.6rem; }
  @media (max-width: 700px) { .bp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 420px) { .bp-grid { grid-template-columns: repeat(2, 1fr); gap: 1.2rem 0.8rem; } }

  /* Card */
  .bp-card { background: var(--btn-bg); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; padding: 0; text-align: left; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s; }
  .bp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); border-color: var(--muted); }
  .bp-card-img { aspect-ratio: 2/3; background: var(--border); overflow: hidden; }
  .bp-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
  .bp-card:hover .bp-card-img img { transform: scale(1.03); }
  .bp-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
  .bp-card-body { padding: 0.85rem 0.9rem 1rem; }
  .bp-card-title { font-family: 'Inter', system-ui, sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--ink); line-height: 1.3; margin-bottom: 0.2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .bp-card-author { font-family: var(--mono); font-size: 0.6rem; color: var(--muted); margin-bottom: 0.65rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bp-card-blurb { font-family: 'Inter', system-ui, sans-serif; font-size: 0.72rem; line-height: 1.6; color: var(--muted); font-style: italic; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  /* Modal */
  .bp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.18s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .bp-modal { background: var(--btn-bg); border-radius: 14px; width: 100%; max-width: 580px; max-height: 92vh; overflow-y: auto; display: grid; grid-template-columns: 200px 1fr; animation: slideUp 0.22s ease; position: relative; }
  @media (max-width: 500px) { .bp-modal { grid-template-columns: 1fr; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .bp-modal-close { position: absolute; top: 0.9rem; right: 1rem; background: none; border: none; font-size: 1.1rem; color: var(--muted); cursor: pointer; z-index: 10; line-height: 1; transition: color 0.12s; }
  .bp-modal-close:hover { color: var(--ink); }
  .bp-modal-cover { background: var(--border); border-radius: 14px 0 0 14px; overflow: hidden; }
  @media (max-width: 500px) { .bp-modal-cover { border-radius: 14px 14px 0 0; aspect-ratio: 3/2; max-height: 220px; } }
  .bp-modal-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bp-modal-fallback { width: 100%; height: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
  .bp-modal-info { padding: 2rem 1.8rem 2rem 1.6rem; display: flex; flex-direction: column; }
  .bp-modal-n { font-family: var(--mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.12em; margin-bottom: 0.7rem; }
  .bp-modal-title { font-family: 'Inter', system-ui, sans-serif; font-size: 1.2rem; font-weight: 700; line-height: 1.25; color: var(--ink); letter-spacing: -0.03em; margin-bottom: 0.3rem; }
  .bp-modal-author { font-family: 'Inter', system-ui, sans-serif; font-size: 0.88rem; font-weight: 400; color: var(--muted); margin-bottom: 0.4rem; }
  .bp-modal-meta { font-family: var(--mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1.1rem; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
  .bp-epub-badge { background: var(--border); border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.58rem; letter-spacing: 0.05em; }
  .bp-modal-blurb { font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem; line-height: 1.75; color: var(--ink); font-style: italic; flex: 1; }
`;

function BooksPage({ onNav, dark, setDark }) {
  const [books, setBooks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    fetchBooks().then(data => { if (data) setBooks(data); }).finally(() => setLoading(false));
  }, []);

  const genres = ["all", ...Array.from(new Set(books.map(b => b.genre).filter(Boolean))).sort()];
  const shown  = filter === "all" ? books : books.filter(b => b.genre === filter);

  return (
    <>
      <style>{css}</style>
      <style>{bpCss}</style>
      <SEO path="/books" />
      <div className="bp-wrap">
        {/* Top bar */}
        <div className="bp-topbar">
          <a href="/" className="bp-back" onClick={e => { e.preventDefault(); onNav("/"); }}>← gojoego.co</a>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? "☀ light" : "☾ dark"}</button>
        </div>

        {/* Header */}
        <div className="bp-header">
          <div className="bp-header-left">
            <h1 className="bp-moon-title"><span className="bp-moon-emoji">🌕</span>Full Moon Books</h1>
            <div className="bp-moon-sub">Joe Holschuh</div>
            {!loading && (
              <div className="bp-stats">
                <div className="bp-stat">
                  <span className="bp-stat-n">{books.length}</span>
                  <span className="bp-stat-l">books</span>
                </div>
                <div className="bp-stat">
                  <span className="bp-stat-n">{books.filter(b => b.hasEpub).length}</span>
                  <span className="bp-stat-l">with epub</span>
                </div>
              </div>
            )}
          </div>
          <div className="bp-header-right">
            <div className="bp-intro-text">
              <p>Inspired by <a href="https://aaronson.org/full-moon-albums/" target="_blank" rel="noopener noreferrer">Aaron Aaronson's Full Moon Albums</a>, this is a place where I log some of the best books that I read each year.</p>
              <p>Because of my job (English teacher), my demeanor (outgoing and bookish), and my podcast (<a href="https://www.youdontknowlitpodcast.com/" target="_blank" rel="noopener noreferrer">You Don't Know Lit</a>), I end up reading…and then recommending…a good deal of books. I often, though, find myself at a loss when people ask me about my favorites.</p>
              <p>This page is meant to solve that problem.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div>
          {loading
            ? <div className="bp-loading">loading from Notion…</div>
            : <>
                <div className="bp-controls">
                  <div className="bp-count">{shown.length} book{shown.length !== 1 ? "s" : ""}</div>
                  <select className="bp-select" value={filter} onChange={e => setFilter(e.target.value)}>
                    {genres.map(g => (
                      <option key={g} value={g}>{g === "all" ? "All genres" : g}</option>
                    ))}
                  </select>
                </div>
                <div className="bp-grid">
                  {shown.map(book => (
                    <button key={book.id} className="bp-card" onClick={() => setSelected(book)}>
                      <div className="bp-card-img">
                        {book.cover
                          ? <img src={book.cover} alt={book.title} loading="lazy" />
                          : <div className="bp-fallback">🌕</div>
                        }
                      </div>
                      <div className="bp-card-body">
                        <div className="bp-card-title">{book.title}</div>
                        <div className="bp-card-author">{book.author}</div>
                        {book.blurb && <div className="bp-card-blurb">{book.blurb}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </>
          }
      </div>

      {/* Modal */}
      {selected && (
        <div className="bp-overlay" onClick={() => setSelected(null)}>
          <div className="bp-modal" onClick={e => e.stopPropagation()}>
            <button className="bp-modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="bp-modal-cover">
              {selected.cover
                ? <img src={selected.cover} alt={selected.title} />
                : <div className="bp-modal-fallback">🌕</div>
              }
            </div>
            <div className="bp-modal-info">
              <div className="bp-modal-n">#{String(books.indexOf(selected) + 1).padStart(2, "0")}</div>
              <h2 className="bp-modal-title">{selected.title}</h2>
              <div className="bp-modal-author">{selected.author}</div>
              <div className="bp-modal-meta">
                {selected.year && <span>{selected.year}</span>}
                {selected.genre && <span>{selected.genre}</span>}
                {selected.hasEpub && <span className="bp-epub-badge">epub</span>}
              </div>
              {selected.blurb && <p className="bp-modal-blurb">{selected.blurb}</p>}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}


// ─── Dedicated Quotes page (Wisdom Project + Commonplace Book) ───────────────
const qpCss = `
  .qp-wrap { max-width: 900px; margin: 0 auto; padding: 3rem 2rem 6rem; }
  .qp-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3.5rem; }
  .qp-back { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid transparent; transition: color 0.12s, border-color 0.12s; }
  .qp-back:hover { color: var(--ink); border-color: var(--muted); }
  .qp-header { margin-bottom: 3rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border); }
  .qp-emoji { display: block; font-size: 2.5rem; margin-bottom: 0.4rem; line-height: 1; filter: grayscale(100%); }
  .qp-title { font-family: 'Inter', system-ui, sans-serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; color: var(--ink); margin-bottom: 0.8rem; }
  .qp-intro { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; line-height: 1.8; color: var(--muted); max-width: 560px; }
  .qp-intro a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
  .qp-count { font-family: var(--mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1.2rem; }
  .qp-section { margin-top: 2.5rem; }
  .qp-section:first-of-type { margin-top: 0; }
  .qp-section-head { display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 0.6rem; }
  .qp-section-title { font-family: var(--mono); font-size: 0.72rem; font-weight: 400; letter-spacing: 0.04em; color: var(--muted); text-transform: lowercase; }
  .qp-section-count { font-family: var(--mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.04em; opacity: 0.7; }
  .qp-list { display: flex; flex-direction: column; gap: 0; }
  .qp-item { padding: 1rem 0; border-bottom: 1px solid var(--border); }
  .qp-item:last-child { border-bottom: none; }
  .qp-quote { font-family: 'Inter', system-ui, sans-serif; font-size: 0.92rem; line-height: 1.65; color: var(--ink); font-style: italic; font-weight: 300; }
  .qp-attr  { font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.06em; color: var(--muted); text-transform: uppercase; margin-top: 0.45rem; }
  .qp-attr::before { content: "— "; opacity: 0.6; }
  @media (max-width: 600px) { .qp-quote { font-size: 0.88rem; } }
`;

function QuotesPage({ section, onNav, dark, setDark }) {
  return (
    <>
      <style>{css}</style>
      <style>{qpCss}</style>
      <SEO path={"/" + section.slug} />
      <div className="qp-wrap">
        <div className="qp-topbar">
          <a href="/" className="qp-back" onClick={e => { e.preventDefault(); onNav("/"); }}>← gojoego.co</a>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? "☀ light" : "☾ dark"}</button>
        </div>
        <div className="qp-header">
          <span className="qp-emoji">{section.emoji}</span>
          <h1 className="qp-title">{section.label}</h1>
          <p className="qp-intro">{section.intro}</p>
          {section.links?.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="qp-intro" style={{display:"block", marginTop:"0.5rem", color:"var(--ink)", textDecoration:"underline", textUnderlineOffset:"3px"}}>{l.text} ↗</a>
          ))}
          <div className="qp-count">{section.quotes.length} entries · {section.themes ? section.themes.length + " themes" : ""}</div>
        </div>
        {section.themes
          ? section.themes.map(theme => {
              const items = section.quotes.filter(q => q.theme === theme);
              if (!items.length) return null;
              return (
                <div key={theme} className="qp-section">
                  <div className="qp-section-head">
                    <span className="qp-section-title">{theme}</span>
                    <span className="qp-section-count">{items.length}</span>
                  </div>
                  <div className="qp-list">
                    {items.map((q, i) => (
                      <div key={i} className="qp-item">
                        <p className="qp-quote">{q.quote}</p>
                        {q.attr && <div className="qp-attr">{q.attr}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          : <div className="qp-list">
              {section.quotes.map((q, i) => (
                <div key={i} className="qp-item">
                  <p className="qp-quote">{typeof q === "string" ? q : q.quote}</p>
                  {q.attr && <div className="qp-attr">{q.attr}</div>}
                </div>
              ))}
            </div>
        }
      </div>
    </>
  );
}

// ─── Sub-page ─────────────────────────────────────────────────────────────────
function SubPage({ section, onNav, dark, setDark }) {
  return (
    <div className="wrap">
      <div className="header-row">
        <a href="/" className="site-name" onClick={e => { e.preventDefault(); onNav("/"); }}>Hey, I'm Joe.</a>
        <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? "☀ light" : "☾ dark"}</button>
      </div>
      <a href="/" className="back-link" onClick={e => { e.preventDefault(); onNav("/"); }}>← back</a>
      <div className="page-title"><span className="pg-emoji">{section.emoji}</span>{section.label}</div>
      <div className="page-subtitle">gojoego.co/{section.slug}</div>
      <SubSectionContent section={section} />
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage({ dark, setDark, onNav }) {
  const [open, setOpen]               = useState(null);
  const [books, setBooks]             = useState([]);
  const [booksLoading, setBLoading]   = useState(false);

  const toggle = label => {
    const next = open === label ? null : label;
    setOpen(next);
    if (next === "Full Moon Books" && books.length === 0) {
      setBLoading(true);
      fetchBooks().then(data => { if (data) setBooks(data); }).finally(() => setBLoading(false));
    }
  };

  const internal = SECTIONS.filter(s => s.type !== "external");
  const external = SECTIONS.filter(s => s.type === "external");

  return (
    <div className="wrap">
      <div className="header-row">
        <button className="site-name" onClick={() => setOpen(null)}>Hey, I'm Joe.</button>
        <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? "☀ light" : "☾ dark"}</button>
      </div>
      <p className="tagline">…and these are some of the things I do.</p>
      <div className="sr-only" aria-hidden="true">
        <h1>Joe Holschuh</h1>
        <p>Joe Holschuh, also known as Joseph Holschuh or Mr. Holschuh, is an English teacher, podcaster, crossword constructor, and commencement speaker based in Kimberly and Appleton, Wisconsin. Co-host of You Don't Know Lit (YDKL). Constructs crossword puzzles on Crosshare and Puzzmo. Delivers commencement addresses at Kimberly High School.</p>
        <p>Keywords: Joe Holschuh, Joseph Holschuh, Mr. Holschuh, Joe Holschuh Kimberly WI, Joe Holschuh Appleton WI, You Don't Know Lit, YDKL podcast, crossword constructor Wisconsin, English teacher Kimberly, gojoego, ROBOHolschuh.</p>
      </div>
      <div className="stack">
        {internal.map(s => {
          const isOpen = open === s.label;
          return (
            <div key={s.label}>
              <button className={`stack-btn${isOpen ? " open" : ""}`} onClick={() => toggle(s.label)}>
                <span className="btn-left">
                  <span className="btn-emoji">{s.emoji}</span>
                  <span className="btn-label">{s.label}</span>
                </span>
                <span className="btn-icon">{isOpen ? "−" : "+"}</span>
              </button>
              <Drawer open={isOpen}>
                {isOpen && <HomeSectionContent section={s} onNav={onNav} books={books} booksLoading={booksLoading} />}
              </Drawer>
            </div>
          );
        })}
        {external.map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="stack-ext">
            <span className="btn-left">
              <span className="btn-emoji">{s.emoji}</span>
              <span className="btn-label">{s.label}</span>
            </span>
            <span className="btn-icon">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const onNav = (p) => {
    window.history.pushState({}, "", p);
    setPath(p);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  if (path === "/books") return <BooksPage onNav={onNav} dark={dark} setDark={setDark} />;
  const wisdomSection = SECTIONS.find(s => s.slug === "wisdom");
  if (path === "/wisdom" && wisdomSection) return <QuotesPage section={wisdomSection} onNav={onNav} dark={dark} setDark={setDark} />;
  if (path === "/commonplace") { window.history.replaceState({}, "", "/wisdom"); setPath("/wisdom"); }

  const sub = SECTIONS.find(s => s.slug && `/${s.slug}` === path);
  return (
    <>
      <style>{css}</style>
      <SEO path={path} />
      {sub
        ? <SubPage section={sub} onNav={onNav} dark={dark} setDark={setDark} />
        : <HomePage dark={dark} setDark={setDark} onNav={onNav} />
      }
    </>
  );
}
