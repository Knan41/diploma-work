import i18n from '../i18n';

// Serverdən gələn xəta mesajını götürür
export function errorMessage(err: unknown): string {
  const e = err as { data?: { message?: string } };
  return e?.data?.message || i18n.t('common.error');
}
