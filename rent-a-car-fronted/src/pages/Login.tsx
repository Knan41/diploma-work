import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../store/api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { errorMessage } from '../utils/errorMessage';

const Login = () => {
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
      toast.success('Xoş gəldiniz!');
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-white">Daxil ol</h1>
      <form onSubmit={handleSubmit} className="card space-y-3">
        <input type="email" className="input w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="input w-full" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn w-full" disabled={isLoading}>Daxil ol</button>
        <p className="text-sm text-gray-400">
          Hesabınız yoxdur? <Link to="/register" className="text-amber-500">Qeydiyyat</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
