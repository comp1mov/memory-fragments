import { PointField } from "@/components/point-field";
import type { MemoryFragment } from "@/lib/fragments";

type FragmentPreviewProps = {
  fragment: MemoryFragment;
  variant?: "card" | "detail";
};

function isVideoCover(url: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

export function FragmentPreview({ fragment, variant = "card" }: FragmentPreviewProps) {
  const coverUrl = fragment.cover.url.trim();
  const hasCover = coverUrl.length > 0;
  const label = `${fragment.title} cover`;

  if (!hasCover) {
    return (
      <div className={`preview-placeholder preview-placeholder--${variant}`}>
        <PointField seed={fragment.id} density={variant === "detail" ? "detail" : "card"} />
      </div>
    );
  }

  if (isVideoCover(coverUrl)) {
    return (
      <video
        aria-label={label}
        autoPlay
        className="cover-media"
        loop
        muted
        playsInline
        preload="metadata"
        src={coverUrl}
      />
    );
  }

  return <img className="cover-media" src={coverUrl} alt={label} loading="lazy" />;
}
