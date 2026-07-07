import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="kicker">404</p>
      <h1>Fragment not found</h1>
      <p className="muted">This Memory Fragment is not in the current portal manifest.</p>
      <Link href="/">Return to memory grid</Link>
    </main>
  );
}

