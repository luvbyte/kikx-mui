const { protocol, hostname, port } = window.location;

// ----------------
export const muiPath = "home://.config/mui";
export const defaultBackground = "images/bg.png";

export const VERSION = "0.3.4";
// ----------------

export const DEV = process.env.NODE_ENV !== "production";

export const apiUrl = DEV
  ? "http://localhost:8000"
  : `${protocol}//${hostname}${port ? `:${port}` : ""}`;

export const wsUrl = DEV
  ? "ws://localhost:8000"
  : `${protocol === "https:" ? "wss:" : "ws:"}//${hostname}${port ? `:${port}` : ""}`;

// ----------------

// Get url
export const getUrl = end => {
  let endUrl = end.startsWith("/") ? end : "/" + end;

  return apiUrl + endUrl;
};

export const getAssetUrl = url => {
  if (url.startsWith("/")) {
    return apiUrl + url;
  } else if (url.startsWith("http")) {
    return url;
  }
  return DEV ? "/" + url : url;
};

export const getImageUrl = url => {
  return getAssetUrl(url);
};

export const getAudioUrl = url => {
  return getAssetUrl(url);
};
