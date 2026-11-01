import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto max-w-xl px-4 py-24 text-center">
    <h1 className="mb-2 text-6xl font-bold text-amber-500">404</h1>
    <p className="mb-6 text-xl text-white">Not found</p>
    <p className="mb-8 text-gray-400">Axtardığınız səhifə tapılmadı.</p>
    <Link to="/" className="btn">Əsas səhifəyə qayıt</Link>
  </div>
);

export default NotFound;
