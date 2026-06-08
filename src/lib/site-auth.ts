const AUTH_COOKIE = "site-auth";
const AUTH_SALT = "badwrx-site-access-v1";

export { AUTH_COOKIE };

export async function siteAuthToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${AUTH_SALT}:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isSiteAuthCookieValid(
  cookieValue: string | undefined,
  password: string | undefined,
): Promise<boolean> {
  if (!cookieValue || !password) return false;
  const expected = await siteAuthToken(password);
  return cookieValue === expected;
}

export function sitePasswordEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD?.length);
}
