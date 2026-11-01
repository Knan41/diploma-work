import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRegisterMutation } from '../store/api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { errorMessage } from '../utils/errorMessage';

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, phone, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-white">{t('nav.register')}</h1>
      <form onSubmit={handleSubmit} className="card space-y-3">
        <input className="input w-full" placeholder={t('common.name')} value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" className="input w-full" placeholder={t('common.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="tel" className="input w-full" placeholder={t('auth.phonePh')} value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="password" className="input w-full" placeholder={t('auth.passwordMinPh')} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn w-full" disabled={isLoading}>{t('auth.signUpBtn')}</button>
        <p className="text-sm text-gray-400">
          {t('auth.haveAccount')} <Link to="/login" className="text-amber-500">{t('nav.login')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
