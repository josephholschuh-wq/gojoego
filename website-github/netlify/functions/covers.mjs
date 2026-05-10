// Fetches cover images for a list of Notion page IDs directly via the Notion API.
// Each page has a cover image as the first block of content (a paragraph with an image).
// We retrieve the page blocks and find the first image URL.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

async function getPageBlocks(pageId, token) {
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

function extractImageUrl(blocksData) {
  if (!blocksData?.results) return null;
  for (const block of blocksData.results) {
    // Direct image block
    if (block.type === "image") {
      const img = block.image;
      return img?.file?.url || img?.external?.url || null;
    }
    // Paragraph containing an image (some Notion exports embed images in paragraphs)
    if (block.type === "paragraph") {
      for (const rt of block.paragraph?.rich_text || []) {
        if (rt.type === "text" && rt.text?.link?.url?.match(/\.(png|jpg|jpeg|webp|gif)/i)) {
          return rt.text.link.url;
        }
      }
    }
  }
  return null;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS });
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "NOTION_TOKEN not set" }), { status: 500, headers: CORS });
  }

  let ids;
  try {
    const body = await req.json();
    ids = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) throw new Error("ids must be a non-empty array");
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: CORS });
  }

  // Fetch all pages in parallel
  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const blocks = await getPageBlocks(id, token);
      const url = extractImageUrl(blocks);
      return { id, url };
    })
  );

  const covers = {};
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.url) {
      covers[r.value.id] = r.value.url;
    }
  }

  return new Response(JSON.stringify(covers), { status: 200, headers: CORS });
};

export const config = { path: "/api/covers" };
