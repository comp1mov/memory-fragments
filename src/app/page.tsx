import Link from "next/link";
import {
  fragmentManifest,
  getFeatureCounts,
  getGridFragments,
  getYearLabel
} from "@/lib/fragments";

export default function HomePage() {
  const fragments = getGridFragments();
  const counts = getFeatureCounts();

  return (
    <main className="portal-shell">
      <header className="portal-header">
        <div>
          <p className="kicker">post.pointless archive</p>
          <h1>Spatial Memory Fragments</h1>
        </div>
        <div className="header-actions" aria-label="Portal links">
          <a href={fragmentManifest.source.githubRepository} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={fragmentManifest.source.githubPagesBaseUrl} target="_blank" rel="noopener noreferrer">Fragments</a>
        </div>
      </header>

      <section className="summary-strip" aria-label="Gallery summary">
        <div>
          <span>{counts.total}</span>
          <p>published fragments</p>
        </div>
        <div>
          <span>{counts.places}</span>
          <p>places</p>
        </div>
        <div>
          <span>{counts.audio}</span>
          <p>audio reactive</p>
        </div>
        <div>
          <span>{counts.strudel}</span>
          <p>Strudel enabled</p>
        </div>
      </section>

      <section className="toolbar" aria-label="Gallery filters">
        <div>
          <p className="section-label">Memory grid</p>
          <p className="muted">Public fragments from Point-of-View/MemoryFragments.</p>
        </div>
        <div className="filter-row" aria-label="Available filters">
          <span>public</span>
          <span>legacy HTML</span>
          <span>GitHub Pages</span>
        </div>
      </section>

      <section className="fragment-grid" aria-label="Spatial Memory Fragment gallery">
        {fragments.map((fragment, index) => (
          <article className="fragment-card" key={fragment.id}>
            <Link href={`/fragments/${fragment.slug}`} className="card-link" aria-label={`Open ${fragment.title}`}>
              <div className="card-preview" aria-hidden="true">
                <div className="point-field">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
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
                  <span>{fragment.sourceScan.pointCountEstimate ? `${Math.round(fragment.sourceScan.pointCountEstimate / 100000) / 10}M pts` : "scan"}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
