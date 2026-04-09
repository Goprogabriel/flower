const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const buildBouquetPath = "/byg-buket/";
export const openBouquetPath = "/open-buket/";

export function createPathWithQuery(path: string, queryString?: string) {
  return queryString ? `${path}?${queryString}` : path;
}

export function createAbsoluteShareUrl(path: string) {
  if (typeof window === "undefined") {
    return `${publicBasePath}${path}`;
  }

  return `${window.location.origin}${publicBasePath}${path}`;
}
