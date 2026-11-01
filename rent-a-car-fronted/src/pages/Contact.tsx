import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSendMessageMutation } from '../store/api/messagesApi';
import { errorMessage } from '../utils/errorMessage';

const Contact = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage({ name, message }).unwrap();
      toast.success('Mesajınız göndərildi');
      setName('');
      setMessage('');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-white">Əlaqə</h1>
      <p className="mb-6 text-gray-400">+994 50 123 45 67 · info@rentcar.az</p>

      <form onSubmit={handleSubmit} className="card space-y-3">
        <input className="input w-full" placeholder="Adınız" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="input w-full" rows={5} placeholder="Mesajınız" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button className="btn w-full" disabled={isLoading}>Göndər</button>
      </form>
    </div>
  );
};

export default Contact;
