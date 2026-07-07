import { readFileSync } from "node:fs";
import { URL } from "node:url";

const manifestPath = new URL("../data/fragments.manifest.json", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const allowedVisibility = new Set(["public", "unlisted", "private"]);
const allowedStatus = new Set(["published", "draft", "archived"]);
const errors = [];
const warnings = [];
const ids = new Set();
const slugs = new Set();

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function assertUrl(value, label) {
  if (!isNonEmptyString(value)) {
    addError(`${label} is required`);
    return;
  }

  try {
    new URL(value);
  } catch {
    addError(`${label} must be a valid URL`);
  }
}

if (manifest.schemaVersion !== "memory-fragment-portal-manifest@0.1") {
  addError("schemaVersion must be memory-fragment-portal-manifest@0.1");
}

if (!Array.isArray(manifest.fragments)) {
  addError("fragments must be an array");
} else {
  for (const fragment of manifest.fragments) {
    const label = fragment.slug || fragment.id || "unknown fragment";

    for (const field of [
      "id",
      "slug",
      "title",
      "subtitle",
      "place",
      "dateLabel",
      "category",
      "artistNote"
    ]) {
      if (!isNonEmptyString(fragment[field])) {
        addError(`${label}: ${field} is required`);
      }
    }

    if (ids.has(fragment.id)) {
      addError(`${label}: duplicate id ${fragment.id}`);
    }
    ids.add(fragment.id);

    if (slugs.has(fragment.slug)) {
      addError(`${label}: duplicate slug ${fragment.slug}`);
    }
    slugs.add(fragment.slug);

    if (!allowedVisibility.has(fragment.visibility)) {
      addError(`${label}: visibility must be public, unlisted, or private`);
    }

    if (!allowedStatus.has(fragment.status)) {
      addError(`${label}: status must be published, draft, or archived`);
    }

    if (fragment.visibility === "private" && fragment.status === "published") {
      addWarning(`${label}: published private fragments need protected storage/auth before production`);
    }

    if (fragment.downloadEnabled === true) {
      addWarning(`${label}: downloadEnabled is true; confirm downloadable artifact policy`);
    }

    if (!Array.isArray(fragment.tags)) {
      addError(`${label}: tags must be an array`);
    }

    if (!fragment.player || !isNonEmptyString(fragment.player.family) || !isNonEmptyString(fragment.player.version)) {
      addError(`${label}: player.family and player.version are required`);
    }

    if (!fragment.features || typeof fragment.features.legacyHtml !== "boolean") {
      addError(`${label}: features.legacyHtml boolean is required`);
    }

    if (!fragment.entry) {
      addError(`${label}: entry is required`);
    } else {
      if (!isNonEmptyString(fragment.entry.htmlFile)) {
        addError(`${label}: entry.htmlFile is required`);
      }
      assertUrl(fragment.entry.githubPagesUrl, `${label}: entry.githubPagesUrl`);
      assertUrl(fragment.entry.rawUrl, `${label}: entry.rawUrl`);
    }

    if (!fragment.sourceScan || !Object.hasOwn(fragment.sourceScan, "pointCountEstimate")) {
      addError(`${label}: sourceScan.pointCountEstimate must be present, even when null`);
    }

    if (!fragment.cover || !isNonEmptyString(fragment.cover.status)) {
      addError(`${label}: cover.status is required`);
    } else if (fragment.cover.status !== "needed" && !isNonEmptyString(fragment.cover.url)) {
      addWarning(`${label}: cover.url is empty while cover.status is ${fragment.cover.status}`);
    }
  }
}

const publicFragments = manifest.fragments.filter((fragment) => fragment.visibility === "public" && fragment.status === "published").length;
const unlistedFragments = manifest.fragments.filter((fragment) => fragment.visibility === "unlisted" && fragment.status === "published").length;

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

console.log(`Manifest OK: ${manifest.fragments.length} fragments (${publicFragments} public, ${unlistedFragments} unlisted).`);
