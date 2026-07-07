import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/copy-link-button";
import { PointField } from "@/components/point-field";
import {
  getFragmentBySlug,
  getPublishedFragments,
  getYearLabel
} from "@/lib/fragments";
import { getSiteUrl } from "@/lib/site";

type FragmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedFragments().map((fragment) => ({
    slug: fragment.slug
  }));
}

export async function generateMetadata({
  params
}: FragmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fragment = getFragmentBySlug(slug);

  if (!fragment) {
    return {
      title: "Fragment not found"
    };
  }

  const fragmentPath = `/fragments/${fragment.slug}`;

  return {
    title: fragment.title,
    description: `${fragment.subtitle} in ${fragment.place}.`,
    alternates: {
      canonical: fragmentPath
    },
    openGraph: {
      title: fragment.title,
      description: `${fragment.subtitle} in ${fragment.place}.`,
      url: `${getSiteUrl()}${fragmentPath}`,
      type: "article"
    },
    twitter: {
      card: "summary",
      title: fragment.title,
      description: `${fragment.subtitle} in ${fragment.place}.`
    }
  };
}

export default async function FragmentPage({ params }: FragmentPageProps) {
  const { slug } = await params;
  const fragment = getFragmentBySlug(slug);

  if (!fragment) {
    notFound();
  }

  const hasCover = fragment.cover.url.trim().length > 0;

  return (
    <main className="fragment-page">
      <nav className="detail-nav" aria-label="Fragment navigation">
        <Link href="/">Memory grid</Link>
        <span>{fragment.category}</span>
      </nav>

      <section className="selected-fragment">
        <div className="selected-copy">
          <p className="kicker">{fragment.subtitle}</p>
          <h1>{fragment.title}</h1>
          <p className="detail-place">{fragment.place}</p>
          <p className="artist-note">{fragment.artistNote}</p>

          <div className="detail-actions">
            <a
              className="primary-action"
              href={fragment.entry.githubPagesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open fragment
            </a>
            <CopyLinkButton path={`/fragments/${fragment.slug}`} />
          </div>
        </div>

        <div className="selected-preview-panel" aria-label={`${fragment.title} cover`}>
          {hasCover ? (
            <img src={fragment.cover.url} alt={`${fragment.title} cover`} loading="lazy" />
          ) : (
            <div className="preview-placeholder">
              <PointField seed={fragment.id} density="detail" />
            </div>
          )}
        </div>
      </section>

      <section className="detail-grid" aria-label="Fragment metadata">
        <div>
          <span>Date</span>
          <p>{fragment.dateLabel}</p>
        </div>
        <div>
          <span>Visibility</span>
          <p>{fragment.visibility}</p>
        </div>
        <div>
          <span>Player</span>
          <p>{fragment.player.family} / {fragment.player.version}</p>
        </div>
        <div>
          <span>Point estimate</span>
          <p>{fragment.sourceScan.pointCountEstimate ? `${fragment.sourceScan.pointCountEstimate.toLocaleString()} points` : "Unknown"}</p>
        </div>
      </section>

      <section className="technical-strip" aria-label="Technical notes">
        <div>
          <span>Year</span>
          <p>{getYearLabel(fragment)}</p>
        </div>
        <div>
          <span>Tags</span>
          <p>{fragment.tags.join(", ")}</p>
        </div>
        <div>
          <span>Based on</span>
          <p>{fragment.player.basedOn}</p>
        </div>
      </section>
    </main>
  );
}
