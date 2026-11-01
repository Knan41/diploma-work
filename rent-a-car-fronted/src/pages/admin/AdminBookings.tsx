import toast from 'react-hot-toast';
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from '../../store/api/bookingsApi';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';
import type { Booking } from '../../types';

const AdminBookings = () => {
  const { data: bookings = [], isLoading } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const changeStatus = async (id: number, status: Booking['status']) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Status dəyişdi');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <table className="w-full text-left text-sm text-gray-300">
      <thead className="text-gray-400">
        <tr>
          <th className="p-2">Müştəri</th>
          <th className="p-2">Maşın</th>
          <th className="p-2">Tarix</th>
          <th className="p-2">Qiymət</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id} className="border-t border-white/10">
            <td className="p-2">{b.user.name}</td>
            <td className="p-2">{b.car.brand} {b.car.model}</td>
            <td className="p-2">{b.startDate} — {b.endDate}</td>
            <td className="p-2">₼{b.totalPrice}</td>
            <td className="p-2">
              <select
                className="input"
                value={b.status}
                onChange={(e) => changeStatus(b.id, e.target.value as Booking['status'])}
              >
                <option value="pending">Gözləyir</option>
                <option value="approved">Təsdiqlənib</option>
                <option value="cancelled">Ləğv edilib</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminBookings;
