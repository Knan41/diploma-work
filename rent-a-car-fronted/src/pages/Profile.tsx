import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfileMutation, useDeleteAccountMutation } from '../store/api/authApi';
import { apiSlice } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCurrentUser, setCredentials, logout } from '../store/slices/authSlice';
import { errorMessage } from '../utils/errorMessage';

const Profile = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();
  const navigate = useNavigate();
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t('profile.deleteConfirm'))) return;
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      toast.success(t('profile.deleted'));
      navigate('/');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(password ? { name, password } : { name }).unwrap();
      dispatch(setCredentials({ user: updated, token: token! }));
      setPassword('');
      toast.success(t('profile.updated'));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-white">{t('nav.profile')}</h1>
      <p className="mb-6 text-gray-400">{user?.email}</p>
      <form onSubmit={handleSubmit} className="card space-y-3">
        <input className="input w-full" placeholder={t('common.name')} value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="password" className="input w-full" placeholder={t('profile.newPasswordPh')} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn w-full" disabled={isLoading}>{t('profile.save')}</button>
      </form>

      {user?.role !== 'admin' && (
        <form onSubmit={handleDeleteAccount} className="card mt-6 space-y-3 border-red-500/30">
          <h2 className="text-lg font-semibold text-red-400">{t('profile.deleteTitle')}</h2>
          <p className="text-sm text-gray-400">
            {t('profile.deleteText')}
          </p>
          <input type="password" className="input w-full" placeholder={t('common.password')} value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
          <button className="btn-danger w-full" disabled={deleting}>{t('profile.deleteBtn')}</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
