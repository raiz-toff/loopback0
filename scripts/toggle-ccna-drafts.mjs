#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const ccnaDir = path.join(rootDir, 'content', 'docs', 'ccna-labs');

function findMdxFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseTargetState(arg, currentStatus) {
  if (!arg) return !currentStatus; // toggle if no arg passed
  const normalized = String(arg).trim().toLowerCase();
  if (['draft', 'true', 'yes', 'on', 'hide'].includes(normalized)) {
    return true;
  }
  if (['live', 'false', 'no', 'off', 'show'].includes(normalized)) {
    return false;
  }
  if (normalized === 'toggle') {
    return !currentStatus;
  }
  if (normalized === 'status') {
    return 'status';
  }
  return null;
}

function getDraftStatus(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^draft:\s*(true|false)/m);
  if (!match) return false;
  return match[1] === 'true';
}

function setDraftStatus(filePath, isDraft) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated;
  if (/^draft:\s*(true|false)/m.test(content)) {
    updated = content.replace(/^draft:\s*(true|false)/m, `draft: ${isDraft}`);
  } else {
    // Insert into frontmatter
    updated = content.replace(/^---\r?\n/, `---\ndraft: ${isDraft}\n`);
  }
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function run() {
  if (!fs.existsSync(ccnaDir)) {
    console.error(`Error: CCNA directory not found at ${ccnaDir}`);
    process.exit(1);
  }

  const files = findMdxFiles(ccnaDir).sort();
  if (files.length === 0) {
    console.log('No CCNA MDX files found.');
    return;
  }

  const rawArg = process.argv[2];
  const allDraft = files.every(getDraftStatus);
  const anyDraft = files.some(getDraftStatus);
  const majorityDraft = allDraft || anyDraft;

  const targetState = parseTargetState(rawArg, majorityDraft);

  if (targetState === 'status') {
    console.log(`CCNA Labs Draft Status:`);
    for (const f of files) {
      const rel = path.relative(rootDir, f);
      const isDraft = getDraftStatus(f);
      console.log(`  ${rel}: ${isDraft ? 'DRAFT (hidden)' : 'LIVE (visible)'}`);
    }
    return;
  }

  if (targetState === null) {
    console.log('Usage:');
    console.log('  node scripts/toggle-ccna-drafts.mjs live    (set draft: false -> visible)');
    console.log('  node scripts/toggle-ccna-drafts.mjs draft   (set draft: true  -> hidden)');
    console.log('  node scripts/toggle-ccna-drafts.mjs toggle  (switches between live and draft)');
    console.log('  node scripts/toggle-ccna-drafts.mjs status  (inspect current state)');
    return;
  }

  let modifiedCount = 0;
  for (const f of files) {
    const changed = setDraftStatus(f, targetState);
    if (changed) modifiedCount++;
    const rel = path.relative(rootDir, f);
    console.log(`  [${targetState ? 'DRAFT' : 'LIVE'}] ${rel}`);
  }

  console.log('');
  console.log(
    `Updated ${modifiedCount} file(s). All CCNA labs are now ${
      targetState ? 'marked as DRAFT (hidden in production).' : 'marked as LIVE (visible).'
    }`
  );
}

run();
