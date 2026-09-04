/**
 * O Supabase Auth sempre precisa de um e-mail por baixo dos panos, mas a
 * tela de login do admin só pede um usuário — não há fluxo self-service de
 * "esqueci a senha" aqui de qualquer forma (contas são criadas manualmente
 * no dashboard do Supabase, ver CLAUDE.md), então uma caixa de e-mail real
 * não traria benefício algum. Usuários são mapeados para
 * `<username>@ADMIN_LOGIN_DOMAIN` e de volta.
 */
export const ADMIN_LOGIN_DOMAIN = "login.matiasimoveisgo.com.br";

export const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/;

export function usernameToEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${ADMIN_LOGIN_DOMAIN}`;
}

/** Remove o domínio sintético para exibição — retorna o valor bruto para qualquer conta que não o utilize (ex.: criada antes desta convenção). */
export function emailToUsername(email: string): string {
  const suffix = `@${ADMIN_LOGIN_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email;
}
