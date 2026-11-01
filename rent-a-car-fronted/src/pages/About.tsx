import { useTranslation } from 'react-i18next';
const About = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-gray-300">
      <h1 className="mb-6 text-3xl font-bold text-white">{t('nav.about')}</h1>
      <p className="mb-4">
        {t('about.p1')}
      </p>
      <p>
        {t('about.p2')}
      </p>
    </div>
  );
};

export default About;
