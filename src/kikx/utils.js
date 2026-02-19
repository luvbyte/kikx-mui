// Generate UUID
export function generateUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r =
      (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >>
      (c === "x" ? 0 : 4);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Get cookie
export const getCookie = name =>
  document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1] || null;

// setCookie
export const setCookie = (name, value) => {
  document.cookie = `${name}=${value}; path=/`;
};

export async function blobToText(blob) {
  const text = await blob.text();
  // console.log(text);
  return text;
}

export function parseArgsAndKwargs(...args) {
  if (
    args.length &&
    typeof args[args.length - 1] === "object" &&
    !Array.isArray(args[args.length - 1])
  ) {
    return { args: args.slice(0, -1), options: args[args.length - 1] };
  }
  return { args, options: {} };
}

export function isAndroidWebView() {
  const ua = navigator.userAgent || "";
  return (
    /\bwv\b/.test(ua) ||
    (/Version\/[\d.]+/.test(ua) && /Chrome\/[\d.]+/.test(ua))
  );
}
