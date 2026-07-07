"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  path: string;
};

export function CopyLinkButton({ path }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = new URL(path, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="secondary-action" type="button" onClick={copyLink}>
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

