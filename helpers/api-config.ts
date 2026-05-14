export const DEV_API_URL =
  process.env.NEXT_PUBLIC_API_URL_DEV ?? "http://localhost:8083/api/v1";

export const PROD_API_URL =
  process.env.NEXT_PUBLIC_API_URL_PROD ??
  "https://be-brevet.tcugapps.com/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? PROD_API_URL : DEV_API_URL);

const inferAssetBaseUrl = (apiUrl: string) => {
  try {
    const url = new URL(apiUrl);
    url.pathname = url.pathname.replace(/\/api\/v\d+\/?$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

export const DEV_ASSET_URL =
  process.env.NEXT_PUBLIC_ASSET_URL_DEV ?? inferAssetBaseUrl(DEV_API_URL);

export const PROD_ASSET_URL =
  process.env.NEXT_PUBLIC_ASSET_URL_PROD ?? inferAssetBaseUrl(PROD_API_URL);

export const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_URL ??
  (process.env.NODE_ENV === "production" ? PROD_ASSET_URL : DEV_ASSET_URL);

export const toAssetUrl = (value?: string | null) => {
  if (!value) return "";
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    return `${ASSET_BASE_URL}${value}`;
  }

  return value;
};
