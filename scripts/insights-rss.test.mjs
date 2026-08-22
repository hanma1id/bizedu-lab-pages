import assert from "node:assert/strict";
import test from "node:test";
import { parseLatestInsights } from "./insights-rss.mjs";

const sampleRss = `<?xml version="1.0"?><rss><channel>
  <item><category><![CDATA[조직문화]]></category><title><![CDATA[첫 번째 글]]></title><link><![CDATA[https://blog.naver.com/yniccyk/111?fromRss=true]]></link><pubDate>Fri, 21 Aug 2026 09:30:00 +0900</pubDate></item>
  <item><category><![CDATA[리더십]]></category><title><![CDATA[두 번째 글]]></title><link><![CDATA[https://blog.naver.com/yniccyk/222?fromRss=true]]></link><pubDate>Thu, 20 Aug 2026 09:30:00 +0900</pubDate></item>
  <item><category><![CDATA[코칭]]></category><title><![CDATA[세 번째 글]]></title><link><![CDATA[https://blog.naver.com/yniccyk/333?fromRss=true]]></link><pubDate>Wed, 19 Aug 2026 09:30:00 +0900</pubDate></item>
</channel></rss>`;

test("RSS 최신 세 건을 홈페이지 인사이트 형식으로 변환한다", () => {
  const insights = parseLatestInsights(sampleRss);
  assert.equal(insights.length, 3);
  assert.deepEqual(insights[0], {
    category: "조직문화",
    date: "2026. 08. 21",
    title: "첫 번째 글",
    href: "https://m.blog.naver.com/yniccyk/111",
  });
});

test("세 건보다 적은 RSS 항목은 실패 처리한다", () => {
  assert.throws(() => parseLatestInsights(sampleRss.replace(/<item>[\s\S]*?<\/item>\n<\/channel>/, "</channel>")));
});
