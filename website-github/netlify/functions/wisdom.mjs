// /api/wisdom — fetches all Wisdom Project quotes from Notion directly.
// Returns: [{ quote, attr, theme, order }] sorted by order descending
// (highest Order first — matches the site's top-to-bottom display order).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const DATABASE_ID = "cf868f533a794893b04ffb80ab8bc66c";

// Fetch all pages from the database (handles pagination)
async function queryDatabase(token) {
  const pages = [];
  let cursor = undefined;
  do {
    const body = cursor ? { start_cursor: cursor } : {};
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Database query failed: ${res.status} ${err}`);
    }
    const data = await res.json();
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return pages;
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "GET")     return new Response("Method not allowed", { status: 405, headers: CORS });

  const token = process.env.NOTION_TOKEN;
  if (!token) return new Response(JSON.stringify({ error: "NOTION_TOKEN not set" }), { status: 500, headers: CORS });

  try {
    const pages = await queryDatabase(token);

    const quotes = pages.map(page => {
      const p = page.properties;
      return {
        quote: p["Quote"]?.title?.map(t => t.plain_text).join("") || "",
        attr:  p["Attribution"]?.rich_text?.map(t => t.plain_text).join("") || null,
        theme: p["Theme"]?.select?.name || null,
        order: p["Order"]?.number ?? null,
      };
    }).filter(q => q.quote);

    // Highest Order first; anything unnumbered sinks to the bottom.
    quotes.sort((a, b) => {
      if (a.order != null && b.order != null) return b.order - a.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return 0;
    });

    return new Response(JSON.stringify(quotes), { status: 200, headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
};

export const config = { path: "/api/wisdom" };
