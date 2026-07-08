"use client";

import { Fragment, useState } from "react";
import { FragmentPreview } from "@/components/fragment-preview";
import type { MemoryFragment } from "@/lib/fragments";

type FragmentGalleryProps = {
  fragments: MemoryFragment[];
};

function getPointLabel(fragment: MemoryFragment): string {
  const points = fragment.sourceScan.pointCountEstimate;
  return points ? `${Math.round(points / 100000) / 10}M pts` : "scan";
}

function getDateStamp(fragment: MemoryFragment): string {
  const parts = fragment.dateLabel.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return parts ? `${parts[3]}.${parts[2]}.${parts[1]}` : fragment.dateLabel;
}

export function FragmentGallery({ fragments }: FragmentGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  function toggleFragment(slug: string) {
    setSelectedSlug((currentSlug) => (currentSlug === slug ? null : slug));
  }

  return (
    <section className="fragment-grid" aria-label="Memory Fragment scans">
      {fragments.map((fragment, index) => (
        <Fragment key={fragment.id}>
          <article className={`fragment-card${selectedSlug === fragment.slug ? " is-selected" : ""}`}>
            <button
              aria-expanded={selectedSlug === fragment.slug}
              className="card-trigger"
              onClick={() => toggleFragment(fragment.slug)}
              type="button"
            >
              <div className="card-preview">
                <FragmentPreview fragment={fragment} />
                <div className="preview-labels" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{getDateStamp(fragment)}</span>
                </div>
              </div>
              <div className="card-body">
                <h2>{fragment.title}</h2>
                <p>{fragment.place}</p>
                <div className="card-tags" aria-label={`${fragment.title} tags`}>
                  {fragment.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          </article>

          {selectedSlug === fragment.slug ? (
            <article className="fragment-drawer" aria-label={`${fragment.title} details`}>
              <div className="drawer-index">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{getDateStamp(fragment)}</p>
              </div>
              <div className="drawer-copy">
                <h2>{fragment.title}</h2>
                <p>{fragment.artistNote}</p>
                <div className="badge-row">
                  {fragment.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  <span>{fragment.category}</span>
                  <span>{getPointLabel(fragment)}</span>
                </div>
              </div>
              <div className="drawer-actions">
                <a href={fragment.entry.githubPagesUrl} target="_blank" rel="noopener noreferrer">
                  Open fragment
                </a>
              </div>
            </article>
          ) : null}
        </Fragment>
      ))}
    </section>
  );
}
