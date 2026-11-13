#!/usr/bin/env node
// Tells IndexNow engines (Bing, Yandex, Seznam, Naver, …) which pages changed.
//
//   node scripts/indexnow.mjs            # pages whose sitemap lastmod is within 3 days
//   node scripts/indexnow.mjs --all      # every page in the sitemap
//   node scripts/indexnow.mjs --dry-run  # print the URL list, send nothing
//
// Reads the LIVE sitemap, so run it after a production deploy (the GitHub
// workflow does). The key file public/<KEY>.txt proves the site owns the key.
// Env: SITE_URL (default https://www.rajkumarneupane.com).

const KEY = "c65793c36963f2fedc533c172cb9f543";
const SITE = (process.env.SITE_URL || "https://www.rajkumarneupane.com").replace(/\/$/, "");
const RECENT_DAYS = 3;
const ALWAYS = ["/", "/blog", "/docs"];

const args = new Set(process.argv.slice(2));
const all = args.has("--all");
const dryRun = args.has("--dry-run");

const res = await fetch(`${SITE}/sitemap.xml`);
if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
const xml = await res.text();

const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));

const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
const changed = entries
  .filter((e) => e.loc && (all || (e.lastmod && Date.parse(e.lastmod) >= cutoff)))
  .map((e) => e.loc);
const urlList = [...new Set([...ALWAYS.map((p) => SITE + (p === "/" ? "/" : p)), ...changed])];

console.log(`${urlList.length} URL(s)${all ? " (all)" : ` changed in the last ${RECENT_DAYS} days`}:`);
urlList.forEach((u) => console.log(`  ${u}`));
if (dryRun) process.exit(0);

const submit = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted, key check pending. Anything else is an error.
console.log(`IndexNow answered ${submit.status} ${submit.statusText}`);
if (submit.status !== 200 && submit.status !== 202) {
  console.error(await submit.text());
  process.exit(1);
}
