import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetCarQuery, useGetBookedDatesQuery } from '../store/api/carsApi';
import { useCreateBookingMutation } from '../store/api/bookingsApi';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import Loading from '../components/ui/Loading';
import { errorMessage } from '../utils/errorMessage';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: car, isLoading } = useGetCarQuery(id!);
  const { data: booked = [] } = useGetBookedDatesQuery(id!);
  const [createBooking, { isLoading: saving }] = useCreateBookingMutation();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (isLoading) return <Loading />;
  if (!car) return <p className="p-10 text-gray-400">Maşın tapılmadı.</p>;

  // Neçə gün və ümumi qiymət
  let days = 0;
  if (startDate && endDate && endDate >= startDate) {
    days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000 + 1;
  }

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await createBooking({ carId: car.id, startDate, endDate }).unwrap();
      toast.success('Rezervasiya göndərildi');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-2">
      <img src={car.image} alt={car.model} className="w-full rounded-xl object-cover" />

      <div className="text-white">
        <h1 className="mb-2 text-3xl font-bold">{car.brand} {car.model}</h1>
        <p className="mb-4 text-gray-400">{car.year} · {car.categoryLabel || car.category}</p>
        <p className="mb-6 text-gray-300">{car.description}</p>

        <ul className="mb-6 space-y-1 text-gray-300">
          <li>Mühərrik: {car.engine}</li>
          <li>Güc: {car.horsepower} at gücü</li>
          <li>Yanacaq: {car.fuel}</li>
          <li>Ötürücü: {car.transmission}</li>
          <li>Oturacaq: {car.seats}</li>
        </ul>

        <p className="mb-6 text-2xl font-bold text-amber-500">₼{car.pricePerDay} / gün</p>

        <div className="card space-y-3">
          <h2 className="text-lg font-semibold">Rezerv et</h2>
          <input type="date" className="input w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="input w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {days > 0 && (
            <p className="text-gray-300">{days} gün · Cəmi: ₼{days * car.pricePerDay}</p>
          )}
          <button
            className="btn w-full"
            disabled={!car.available || !startDate || !endDate || saving}
            onClick={handleBook}
          >
            {car.available ? 'Rezerv et' : 'Mövcud deyil'}
          </button>

          {booked.length > 0 && (
            <div className="text-sm text-gray-400">
              <p>Tutulmuş tarixlər:</p>
              {booked.map((b, i) => (
                <p key={i}>{b.startDate} — {b.endDate}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
