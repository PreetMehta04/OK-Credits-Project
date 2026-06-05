// notion-sync/sync.js
// Usage: node sync.js
// Config: edit the three variables below, or set as env vars

const NOTION_TOKEN = process.env.NOTION_TOKEN || "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";
const PAGE_ID      = process.env.PAGE_ID      || "37597d9adbe980949327f23d83811913";
const BASE_DIR     = process.env.BASE_DIR     || "/home/ice/jeevan yahi hai/Random_P/OK_Credit_Project";

// ─────────────────────────────────────────────────────────────────────────────

const https = require("https");
const fs    = require("fs");
const path  = require("path");

function apiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.notion.com",
      path: endpoint,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Failed to parse response: " + data)); }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// Extracts plain text from a Notion rich_text array
function richTextToString(richTextArr) {
  if (!richTextArr) return "";
  return richTextArr.map(t => t.plain_text || "").join("");
}

// Recursively extracts all text content from blocks
function blockToText(block) {
  const type = block.type;
  const data = block[type];
  if (!data) return "";

  const lines = [];

  // Grab text from the block itself
  if (data.rich_text) {
    const text = richTextToString(data.rich_text);
    if (text) {
      // Preserve code blocks as-is, add prefix chars for others
      if (type === "code")           lines.push(text);
      else if (type === "heading_1") lines.push(`# ${text}`);
      else if (type === "heading_2") lines.push(`## ${text}`);
      else if (type === "heading_3") lines.push(`### ${text}`);
      else if (type === "bulleted_list_item") lines.push(`- ${text}`);
      else if (type === "numbered_list_item") lines.push(`1. ${text}`);
      else                           lines.push(text);
    }
  }

  // Handle children (nested blocks)
  if (block.has_children && block._children) {
    for (const child of block._children) {
      const childText = blockToText(child);
      if (childText) lines.push(childText);
    }
  }

  return lines.join("\n");
}

async function fetchAllBlocks(blockId) {
  const blocks = [];
  let cursor = undefined;

  do {
    const url = `/v1/blocks/${blockId}/children` + (cursor ? `?start_cursor=${cursor}` : "");
    const res = await apiRequest(url);

    if (res.object === "error") {
      throw new Error(`Notion API error: ${res.message}`);
    }

    for (const block of res.results) {
      if (block.has_children) {
        block._children = await fetchAllBlocks(block.id);
      }
      blocks.push(block);
    }

    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

async function sync() {
  console.log("🔄 Fetching page from Notion...");

  // 1. Get the page to read its title
  const page = await apiRequest(`/v1/pages/${PAGE_ID}`);
  if (page.object === "error") {
    throw new Error(`Could not fetch page: ${page.message}`);
  }

  // Title lives in properties.title
  const titleProp = page.properties?.title?.title
                 || page.properties?.Name?.title
                 || [];
  const relativePath = richTextToString(titleProp).trim();

  if (!relativePath) {
    throw new Error("Page title is empty — set it to the relative file path, e.g. src/main.go");
  }

  const normalizedPath = relativePath.replace(/\\/g, "/");

  console.log(`📄 File path from title: ${normalizedPath}`);

  // 2. Fetch all blocks (the file content)
  const blocks = await fetchAllBlocks(PAGE_ID);

  const contentLines = [];
  for (const block of blocks) {
    const text = blockToText(block);
    if (text) contentLines.push(text);
  }

  const content = contentLines.join("\n");

  if (!content.trim()) {
    console.warn("⚠️  Page body is empty. File will be created but empty.");
  }

  // 3. Resolve output path and write
  const outputPath = path.join(BASE_DIR, normalizedPath);
  const outputDir  = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, content, "utf8");

  console.log(`✅ Written to: ${outputPath}`);
  console.log(`   (${content.length} chars, ${content.split("\n").length} lines)`);
}

sync().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});