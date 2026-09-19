const configuredAssetBaseUrl = import.meta.env.VITE_ASSET_BASE_URL?.replace(/\/$/, "");

export function assetUrl(filename: string) {
  return configuredAssetBaseUrl ? `${configuredAssetBaseUrl}/${filename}` : `/manus-storage/${filename}`;
}
