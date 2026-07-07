"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FragmentPreview } from "@/components/fragment-preview";
import type { MemoryFragment } from "@/lib/fragments";

type FragmentGalleryProps = {
  fragments: MemoryFragment[];
};

type FeatureFilter = "all" | "audio" | "strudel";

function getYearLabel(fragment: MemoryFragment): string {
  const match = fragment.dateLabel.match(/\b(20\d{2})\b/);
  return match ? match[1] : "undated";
}

function getPointLabel(fragment: MemoryFragment): string {
  const points = fragment.sourceScan.pointCountEstimate;
  return points ? `${Math.round(points / 100000) / 10}M pts` : "scan";
}

export function FragmentGallery({ fragments }: FragmentGalleryProps) {
  const [category, setCategory] = useState("all");
  const [feature, setFeature] = useState<FeatureFilter>("all");

  const categoryCounts = useMemo(
    () =>
      fragments.reduce<Record<string, number>>((counts, fragment) => {
        counts[fragment.category] = (counts[fragment.category] ?? 0) + 1;
        return counts;
      }, {}),
    [fragments]
  );

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(fragments.map((fragment) => fragment.category))).sort()],
    [fragments]
  );

  const featureCounts: Record<FeatureFilter, number> = useMemo(
    () => ({
      all: fragments.length,
      audio: fragments.filter((fragment) => fragment.features.audioReactive).length,
      strudel: fragments.filter((fragment) => fragment.features.strudel).length
    }),
    [fragments]
  );

  const visibleFragments = useMemo(
    () =>
      fragments.filter((fragment) => {
        const categoryMatch = category === "all" || fragment.category === category;
        const featureMatch =
          feature === "all" ||
          (feature === "audio" && fragment.features.audioReactive) ||
          (feature === "strudel" && fragment.features.strudel);

        return categoryMatch && featureMatch;
      }),
    [category, feature, fragments]
  );

  const filtersActive = category !== "all" || feature !== "all";

  function resetFilters() {
    setCategory("all");
    setFeature("all");
  }

  return (
    <>
      <section className="toolbar archive-toolbar" aria-label="Gallery filters">
        <div>
          <p className="section-label">Memory grid</p>
          <p className="archive-status" aria-live="polite">
            Showing {visibleFragments.length} of {fragments.length} public fragments
          </p>
        </div>

        <div className="filter-stack">
          <div className="filter-row" aria-label="Filter by category">
            {categories.map((item) => (
              <button
                aria-pressed={category === item}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
                <small>{item === "all" ? fragments.length : categoryCounts[item]}</small>
              </button>
            ))}
          </div>
          <div className="filter-row" aria-label="Filter by media behavior">
            {(["all", "audio", "strudel"] as FeatureFilter[]).map((item) => (
              <button
                aria-pressed={feature === item}
                key={item}
                onClick={() => setFeature(item)}
                type="button"
              >
                {item}
                <small>{featureCounts[item]}</small>
              </button>
            ))}
            {filtersActive ? (
              <button className="filter-reset" onClick={resetFilters} type="button">
                reset
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {visibleFragments.length > 0 ? (
        <section className="fragment-grid" aria-label="Spatial Memory Fragment gallery">
          {visibleFragments.map((fragment, index) => (
            <article className="fragment-card" key={fragment.id}>
              <Link href={`/fragments/${fragment.slug}`} className="card-link" aria-label={`Open ${fragment.title}`}>
                <div className="card-preview">
                  <FragmentPreview fragment={fragment} />
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span>{String(index + 1).padStart(2, "0")} / {getYearLabel(fragment)}</span>
                    <span>{fragment.category}</span>
                  </div>
                  <h2>{fragment.title}</h2>
                  <p>{fragment.place}</p>
                  <div className="badge-row">
                    <span>{fragment.player.family}</span>
                    {fragment.features.audioReactive ? <span>audio</span> : null}
                    {fragment.features.strudel ? <span>strudel</span> : null}
                    <span>{getPointLabel(fragment)}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-filter-state" aria-label="No fragments found">
          <p className="section-label">No matching fragments</p>
          <button onClick={resetFilters} type="button">Reset filters</button>
        </section>
      )}
    </>
  );
}
