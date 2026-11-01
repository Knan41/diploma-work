import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../store/api/bookingsApi';
import Loading from '../components/ui/Loading';
import { errorMessage } from '../utils/errorMessage';

const MyBookings = () => {
  const { t } = useTranslation();
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id).unwrap();
      toast.success(t('myBookings.cancelled'));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-white">{t('nav.myBookings')}</h1>

      {bookings.length === 0 && <p className="text-gray-400">{t('myBookings.empty')}</p>}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="card flex items-center gap-4">
            <img src={b.car.image} alt={b.car.model} className="h-20 w-32 rounded-lg object-cover" />
            <div className="flex-1 text-gray-300">
              <p className="font-semibold text-white">{b.car.brand} {b.car.model}</p>
              <p>{b.startDate} — {b.endDate}</p>
              <p>₼{b.totalPrice} · {t(`status.${b.status}`)}</p>
            </div>
            {b.status === 'pending' && (
              <button className="btn-danger" onClick={() => handleCancel(b.id)}>{t('myBookings.cancel')}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
