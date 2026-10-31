import toast from 'react-hot-toast';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../store/api/usersApi';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';

const AdminUsers = () => {
  const me = useAppSelector(selectCurrentUser);
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const toggleRole = async (id: number, role: 'user' | 'admin') => {
    try {
      await updateRole({ id, role: role === 'admin' ? 'user' : 'admin' }).unwrap();
      toast.success('Rol dəyişdi');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('İstifadəçi silindi');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <table className="w-full text-left text-sm text-gray-300">
      <thead className="text-gray-400">
        <tr>
          <th className="p-2">Ad</th>
          <th className="p-2">Email</th>
          <th className="p-2">Rol</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-t border-white/10">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">
              <button className="text-amber-500" onClick={() => toggleRole(u.id, u.role)}>{u.role}</button>
            </td>
            <td className="p-2 text-right">
              {u.id === me?.id ? (
                <span className="text-xs text-gray-500">Öz hesabınız</span>
              ) : (
                <button className="btn-danger" onClick={() => handleDelete(u.id)}>Sil</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUsers;
