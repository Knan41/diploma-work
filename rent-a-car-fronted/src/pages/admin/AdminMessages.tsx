import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useGetMessagesQuery, useDeleteMessageMutation } from '../../store/api/messagesApi';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';

const AdminMessages = () => {
  const { t } = useTranslation();
  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleDelete = async (id: number) => {
    if (!confirm(t('adminMessages.deleteConfirm'))) return;
    try {
      await deleteMessage(id).unwrap();
      toast.success(t('adminMessages.deleted'));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      {messages.length === 0 && <p className="text-gray-400">{t('adminMessages.empty')}</p>}
      {messages.map((m) => (
        <div key={m.id} className="card">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-white">{m.name}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{m.createdAt}</span>
              <button className="btn-danger" onClick={() => handleDelete(m.id)}>{t('common.delete')}</button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-gray-300">{m.message}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
