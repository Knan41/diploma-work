import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../store/api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { errorMessage } from '../utils/errorMessage';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success(t('auth.welcome'));
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-white">{t('nav.login')}</h1>
      <form onSubmit={handleSubmit} className="card space-y-3">
        <input type="email" className="input w-full" placeholder={t('common.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="input w-full" placeholder={t('common.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn w-full" disabled={isLoading}>{t('nav.login')}</button>
        <p className="text-sm text-gray-400">
          {t('auth.noAccount')} <Link to="/register" className="text-amber-500">{t('nav.register')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
