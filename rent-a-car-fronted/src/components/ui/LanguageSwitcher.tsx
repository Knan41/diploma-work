import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/5"
    >
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
            current === lng ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
