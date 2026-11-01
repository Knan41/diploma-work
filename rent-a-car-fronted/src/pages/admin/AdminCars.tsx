import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCarsQuery, useCreateCarMutation, useDeleteCarMutation, useUpdateCarMutation } from '../../store/api/carsApi';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';

const AdminCars = () => {
  const { data: cars = [], isLoading } = useGetCarsQuery();
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [price, setPrice] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCar({ brand, model, year: Number(year), pricePerDay: Number(price) }).unwrap();
      toast.success('Maşın əlavə edildi');
      setBrand('');
      setModel('');
      setPrice('');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
    try {
      await deleteCar(id).unwrap();
      toast.success('Maşın silindi');
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const toggleAvailable = async (id: number, available: boolean) => {
    try {
      await updateCar({ id, data: { available: !available } }).unwrap();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="card flex flex-wrap gap-3">
        <input className="input" placeholder="Marka" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <input className="input" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
        <input className="input w-24" type="number" placeholder="İl" value={year} onChange={(e) => setYear(e.target.value)} required />
        <input className="input w-32" type="number" placeholder="Qiymət/gün" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button className="btn">Əlavə et</button>
      </form>

      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-gray-400">
          <tr>
            <th className="p-2">Maşın</th>
            <th className="p-2">İl</th>
            <th className="p-2">Qiymət</th>
            <th className="p-2">Mövcud</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border-t border-white/10">
              <td className="p-2">{car.brand} {car.model}</td>
              <td className="p-2">{car.year}</td>
              <td className="p-2">₼{car.pricePerDay}</td>
              <td className="p-2">
                <button className="text-amber-500" onClick={() => toggleAvailable(car.id, car.available)}>
                  {car.available ? 'Bəli' : 'Xeyr'}
                </button>
              </td>
              <td className="p-2 text-right">
                <button className="btn-danger" onClick={() => handleDelete(car.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCars;
