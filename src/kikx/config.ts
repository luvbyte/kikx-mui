export const apiUrl = "http://localhost:8000";

export const finalUrl = (end: string) => {
  let endUrl = end.startsWith("/") ? end : "/" + end

  return apiUrl + endUrl;
};
