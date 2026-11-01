import i18n from '../i18n';

// Backend-in göndərdiyi (azərbaycanca) mesajları seçilmiş dilə çevirir
const SERVER_MESSAGES: Record<string, string> = {
  'Server xətası': 'server.serverError',
  'Səhifə tapılmadı': 'server.pageNotFound',
  'Ad ən azı 2 simvol olmalıdır': 'server.nameShort',
  'Admin hesabı silinə bilməz': 'server.adminNoDelete',
  'Başlama tarixi keçmişdə ola bilməz': 'server.startPast',
  'Bitmə tarixi başlama tarixindən əvvəl ola bilməz': 'server.endBeforeStart',
  'Bu email artıq qeydiyyatdadır': 'server.emailTaken',
  'Bu kateqoriya artıq var': 'server.categoryExists',
  'Bu kateqoriyada maşınlar var, əvvəlcə onları başqa kateqoriyaya keçirin': 'server.categoryHasCars',
  'Bu maşın hazırda mövcud deyil': 'server.carUnavailable',
  'Bu maşın seçilmiş tarixlərdə artıq götürülüb': 'server.carBooked',
  'Bu əməliyyat yalnız admin üçündür': 'server.adminOnly',
  'Email düzgün deyil': 'server.emailInvalid',
  'Email və parol daxil edin': 'server.emailPasswordRequired',
  'Email və ya parol yanlışdır': 'server.wrongCredentials',
  'Giriş tələb olunur': 'server.loginRequired',
  'Kateqoriya adı düzgün deyil': 'server.categoryNameInvalid',
  'Kateqoriya adı ən azı 2 simvol olmalıdır': 'server.categoryNameShort',
  'Kateqoriya tapılmadı': 'server.categoryNotFound',
  'Maşın tapılmadı': 'server.carNotFound',
  'Maşının şəkli mütləqdir': 'server.carImageRequired',
  'Mesaj tapılmadı': 'server.messageNotFound',
  'Mesaj çox qısadır': 'server.messageShort',
  'Parol yanlışdır': 'server.wrongPassword',
  'Parol ən azı 6 simvol olmalıdır': 'server.passwordShort',
  'Rezervasiya tapılmadı': 'server.bookingNotFound',
  'Token etibarsızdır və ya vaxtı bitib': 'server.tokenInvalid',
  'Təsdiq üçün parolu daxil edin': 'server.confirmPassword',
  'Yalnız gözləyən rezervasiyanı ləğv etmək olar': 'server.onlyPendingCancel',
  'carId, startDate və endDate (YYYY-MM-DD) lazımdır': 'server.bookingFields',
  'status: pending, approved və ya cancelled olmalıdır': 'server.statusInvalid',
  "role: 'user' və ya 'admin' olmalıdır": 'server.roleInvalid',
  'Öz hesabınızı silə bilməzsiniz': 'server.noDeleteSelf',
  'Öz rolunuzu dəyişə bilməzsiniz': 'server.noChangeOwnRole',
  'İstifadəçi tapılmadı': 'server.userNotFound',
  'İstifadəçinin ləğv etdiyi rezervasiyanı bərpa etmək olmaz': 'server.noRestoreUserCancelled',
  'Əlaqə nömrəsi düzgün deyil': 'server.phoneInvalid',
  'brand, model, year və pricePerDay mütləqdir': 'server.carFieldsRequired',
  'Qiymət 0-dan böyük olmalıdır': 'server.priceInvalid',
  'İl düzgün deyil': 'server.yearInvalid',
  'At gücü düzgün deyil': 'server.hpInvalid',
  'Sürətlənmə düzgün deyil': 'server.accelInvalid',
  'Belə kateqoriya yoxdur': 'server.noSuchCategory',
};

// Serverdən gələn xəta mesajını götürür və dilə uyğun göstərir
export function errorMessage(err: unknown): string {
  const message = (err as { data?: { message?: string } })?.data?.message;
  if (!message) return i18n.t('common.error');
  const key = SERVER_MESSAGES[message];
  return key ? i18n.t(key) : message;
}
