import { FragmentGallery } from "@/components/fragment-gallery";
import {
  fragmentManifest,
  getFeatureCounts,
  getGridFragments
} from "@/lib/fragments";

export default function HomePage() {
  const fragments = getGridFragments();
  const counts = getFeatureCounts();

  return (
    <main className="portal-shell">
      <header className="portal-header">
        <div className="portal-title">
          <p className="kicker">post.pointless archive</p>
          <h1>Memory Fragments</h1>
          <p className="archive-deck">A contact sheet of spatial scans, standalone players, and lightweight covers.</p>
        </div>
        <div className="header-actions" aria-label="Portal links">
          <a href={fragmentManifest.source.portalRepository} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`${fragmentManifest.source.githubRepository}/tree/main/MemoryFragments`} target="_blank" rel="noopener noreferrer">Source</a>
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

      <FragmentGallery fragments={fragments} />
    </main>
  );
}
