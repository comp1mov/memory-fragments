const fallbackSiteUrl = "https://memoryfragments.vercel.app";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl;

  return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`;
}
