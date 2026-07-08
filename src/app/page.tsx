import { FragmentGallery } from "@/components/fragment-gallery";
import { getGridFragments } from "@/lib/fragments";

export default function HomePage() {
  const fragments = getGridFragments();

  return (
    <main className="portal-shell">
      <header className="portal-header">
        <h1>Memory fragments</h1>
      </header>

      <FragmentGallery fragments={fragments} />
    </main>
  );
}
