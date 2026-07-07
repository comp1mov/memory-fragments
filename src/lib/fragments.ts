import manifest from "../../data/fragments.manifest.json";

export type FragmentManifest = typeof manifest;
export type MemoryFragment = FragmentManifest["fragments"][number];
export type FragmentVisibility = MemoryFragment["visibility"];

export const fragmentManifest = manifest;

export function getAllFragments(): MemoryFragment[] {
  return [...manifest.fragments];
}

export function getPublishedFragments(): MemoryFragment[] {
  return manifest.fragments.filter((fragment) => fragment.status === "published");
}

export function getGridFragments(): MemoryFragment[] {
  return getPublishedFragments().filter((fragment) => fragment.visibility === "public");
}

export function getFragmentBySlug(slug: string): MemoryFragment | undefined {
  return getPublishedFragments().find((fragment) => fragment.slug === slug);
}

export function getUniquePlaces(): string[] {
  return [...new Set(getGridFragments().map((fragment) => fragment.place))].sort();
}

export function getFeatureCounts() {
  const fragments = getGridFragments();

  return {
    total: fragments.length,
    audio: fragments.filter((fragment) => fragment.features.audioReactive).length,
    strudel: fragments.filter((fragment) => fragment.features.strudel).length,
    places: getUniquePlaces().length
  };
}

export function getYearLabel(fragment: MemoryFragment): string {
  const match = fragment.dateLabel.match(/\b(20\d{2})\b/);
  return match ? match[1] : "undated";
}
