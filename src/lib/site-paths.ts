import { defaultLanguage, type LanguageCode } from "@/lib/i18n";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const buildBouquetPath = "/byg-buket/";
export const openBouquetPath = "/open-buket/";

export function withBasePath(path: string) {
  if (!publicBasePath) {
    return path;
  }

  return `${publicBasePath}${path}`;
}

export function createPathWithQuery(path: string, queryString?: string) {
  return queryString ? `${path}?${queryString}` : path;
}

export function createLocalizedQueryString(
  queryString: string | undefined,
  language: LanguageCode
) {
  const params = new URLSearchParams(queryString ?? "");

  if (language === defaultLanguage) {
    params.delete("lang");
  } else {
    params.set("lang", language);
  }

  return params.toString();
}

export function createLocalizedPath(
  path: string,
  language: LanguageCode,
  queryString?: string
) {
  return createPathWithQuery(
    path,
    createLocalizedQueryString(queryString, language)
  );
}

export function createAbsoluteShareUrl(path: string) {
  if (typeof window === "undefined") {
    return withBasePath(path);
  }

  return `${window.location.origin}${withBasePath(path)}`;
}
