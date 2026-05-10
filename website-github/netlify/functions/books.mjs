// /api/books — fetches all Full Moon Books data from Notion directly.
// Returns: { id, title, author, year, genre, blurb, hasEpub, cover, createdTime }
// Cover image comes from the first image block on each page.
// Uses batched parallel fetches with concurrency limiting to avoid rate limits.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const DATABASE_ID = "21d5b2e30c7b80b9acbef60b315e7fc9";

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

// Fetch the first image block from a page's content
async function getPageCover(pageId, token) {
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=5`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    for (const block of data.results || []) {
      if (block.type === "image") {
        return block.image?.file?.url || block.image?.external?.url || null;
      }
    }
    return null;
  } catch { return null; }
}

// Run promises with max concurrency to avoid hammering Notion's rate limit
async function withConcurrency(items, limit, fn) {
  const results = [];
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await fn(item).catch(e => ({ error: e.message })));
    }
  });
  await Promise.all(workers);
  return results;
}

function getProperty(props, name, type) {
  const p = props[name];
  if (!p) return null;
  if (type === "title") return p.title?.map(t => t.plain_text).join("") || null;
  if (type === "rich_text") return p.rich_text?.map(t => t.plain_text).join("") || null;
  if (type === "select") return p.select?.name || null;
  if (type === "files") return p.files?.length > 0;
  return null;
}

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "GET")     return new Response("Method not allowed", { status: 405, headers: CORS });

  const token = process.env.NOTION_TOKEN;
  if (!token) return new Response(JSON.stringify({ error: "NOTION_TOKEN not set" }), { status: 500, headers: CORS });

  try {
    // 1. Get all pages from database
    const pages = await queryDatabase(token);

    // 2. Extract properties from each page
    const booksMeta = pages.map(page => ({
      id: page.id,
      createdTime: page.created_time,
      title:  getProperty(page.properties, "Title", "title"),
      author: getProperty(page.properties, "Author", "rich_text"),
      year:   getProperty(page.properties, "Publication Year", "rich_text"),
      genre:  getProperty(page.properties, "Genre", "select"),
      blurb:  getProperty(page.properties, "Three Sentences", "rich_text"),
      hasEpub: getProperty(page.properties, ".epub", "files") || false,
    }));

    // 3. Fetch cover images with concurrency limit of 8
    await withConcurrency(booksMeta, 8, async (book) => {
      book.cover = await getPageCover(book.id, token);
    });

    // 4. Sort newest first by createdTime
    booksMeta.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    return new Response(JSON.stringify(booksMeta), { status: 200, headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
};

export const config = { path: "/api/books" };
