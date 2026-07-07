import type { MetadataRoute } from "next";
import { fragmentManifest, getGridFragments } from "@/lib/fragments";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date(fragmentManifest.updatedAt);

  return [
    {
      url: siteUrl,
      lastModified
    },
    ...getGridFragments().map((fragment) => ({
      url: `${siteUrl}/fragments/${fragment.slug}`,
      lastModified
    }))
  ];
}
