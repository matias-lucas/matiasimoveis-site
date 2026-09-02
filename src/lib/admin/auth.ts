/**
 * Supabase Auth always needs an email under the hood, but the admin login
 * screen only asks for a username — there's no self-service "forgot
 * password" flow here anyway (accounts are created manually in the
 * Supabase dashboard, see CLAUDE.md), so a real mailbox buys nothing.
 * Usernames are mapped to `<username>@ADMIN_LOGIN_DOMAIN` and back.
 */
export const ADMIN_LOGIN_DOMAIN = "login.matiasimoveisgo.com.br";

export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${ADMIN_LOGIN_DOMAIN}`;
}

/** Strips the synthetic domain back off for display — falls back to the raw value for any account that isn't using it (e.g. created before this convention). */
export function emailToUsername(email: string): string {
  const suffix = `@${ADMIN_LOGIN_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email;
}
