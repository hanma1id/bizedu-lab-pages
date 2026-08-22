const NAVER_BLOG_RSS_URL = "https://rss.blog.naver.com/yniccyk.xml";

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";

  return decodeEntities(
    match[1]
      .trim()
      .replace(/^<!\[CDATA\[/, "")
      .replace(/\]\]>$/, "")
      .trim(),
  );
}

function formatKoreanDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid RSS date: ${value}`);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;

  return `${part("year")}. ${part("month")}. ${part("day")}`;
}

function normalizePostUrl(value) {
  const url = new URL(value);
  url.protocol = "https:";
  url.hostname = "m.blog.naver.com";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function parseLatestInsights(xml) {
  const entries = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, 3)
    .map((match) => {
      const block = match[1];
      return {
        category: extractTag(block, "category") || "블로그",
        date: formatKoreanDate(extractTag(block, "pubDate")),
        title: extractTag(block, "title"),
        href: normalizePostUrl(extractTag(block, "link")),
      };
    });

  if (entries.length !== 3 || entries.some((entry) => !entry.title || !entry.href)) {
    throw new Error("RSS did not provide three complete blog entries.");
  }

  return entries;
}

export async function fetchLatestInsights(fetchImpl = fetch) {
  const response = await fetchImpl(NAVER_BLOG_RSS_URL, {
    headers: { "User-Agent": "bizedulab-insights-updater/1.0" },
  });
  if (!response.ok) throw new Error(`RSS request failed: ${response.status}`);

  return parseLatestInsights(await response.text());
}
