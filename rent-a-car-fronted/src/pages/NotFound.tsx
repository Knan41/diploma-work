import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="mb-2 text-6xl font-bold text-amber-500">404</h1>
      <p className="mb-6 text-xl text-white">{t('notFound.title')}</p>
      <p className="mb-8 text-gray-400">{t('notFound.text')}</p>
      <Link to="/" className="btn">{t('notFound.back')}</Link>
    </div>
  );
};

export default NotFound;
