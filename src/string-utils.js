// From https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings
// ucs-2 string to base64 encoded ascii
export function utoa(str) {
  return btoa(unescape(encodeURIComponent(str)))
}
// base64 encoded ascii to ucs-2 string
export function atou(str) {
  return decodeURIComponent(escape(atob(str)))
}
