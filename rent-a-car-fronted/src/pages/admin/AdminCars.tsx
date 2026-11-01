import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCarsQuery, useCreateCarMutation, useDeleteCarMutation, useUpdateCarMutation } from '../../store/api/carsApi';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) return reject(new Error('Şəkil 5MB-dan böyük ola bilməz'));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Şəkil oxunmadı'));
    reader.readAsDataURL(file);
  });

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-400">
    {label}
    {children}
  </label>
);

const AdminCars = () => {
  const { data: cars = [], isLoading } = useGetCarsQuery();
  const [createCar, { isLoading: saving }] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [price, setPrice] = useState('');
  const [engine, setEngine] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [fuel, setFuel] = useState('petrol');
  const [transmission, setTransmission] = useState('automatic');
  const [seats, setSeats] = useState('5');
  const [category, setCategory] = useState('hybrid');
  const [image, setImage] = useState('');
  const [fileKey, setFileKey] = useState(0);

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImage(await readFile(file));
    } catch (err) {
      toast.error((err as Error).message);
      e.target.value = '';
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error('Maşının şəklini əlavə edin');
      return;
    }
    try {
      await createCar({
        brand,
        model,
        year: Number(year),
        pricePerDay: Number(price),
        engine: engine || undefined,
        horsepower: horsepower ? Number(horsepower) : undefined,
        fuel,
        transmission,
        seats: Number(seats) || 5,
        category,
        image,
      }).unwrap();
      toast.success('Maşın əlavə edildi');
      setBrand('');
      setModel('');
      setPrice('');
      setEngine('');
      setHorsepower('');
      setFuel('petrol');
      setTransmission('automatic');
      setSeats('5');
      setCategory('hybrid');
      setImage('');
      setFileKey((k) => k + 1);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const changeImage = async (id: number, file?: File) => {
    if (!file) return;
    try {
      const data = await readFile(file);
      await updateCar({ id, data: { image: data } }).unwrap();
      toast.success('Şəkil dəyişdi');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : errorMessage(err));
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
      <form onSubmit={handleAdd} className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">Yeni maşın əlavə et</h2>

        {/* Şəkil */}
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-amber-500/40 p-4 sm:flex-row sm:items-center">
          <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-xs text-gray-500">
            {image ? <img src={image} alt="önbaxış" className="h-full w-full object-cover" /> : 'Şəkil seçilməyib'}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Maşının şəkli <span className="text-red-400">*</span></p>
            <input
              key={fileKey}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={pickImage}
              className="block text-sm text-gray-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-amber-400"
            />
            <p className="text-xs text-gray-500">PNG, JPG və ya WEBP, maksimum 5MB</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Marka">
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </Field>
          <Field label="Model">
            <input className="input" value={model} onChange={(e) => setModel(e.target.value)} required />
          </Field>
          <Field label="İl">
            <input className="input" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
          </Field>
          <Field label="Qiymət (₼ / gün)">
            <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Field>
          <Field label="Mühərrik">
            <input className="input" placeholder="məs. 2.0L" value={engine} onChange={(e) => setEngine(e.target.value)} />
          </Field>
          <Field label="Güc (at gücü)">
            <input className="input" type="number" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} />
          </Field>
          <Field label="Yanacaq">
            <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="petrol">petrol</option>
              <option value="diesel">diesel</option>
              <option value="hybrid">hybrid</option>
              <option value="electric">electric</option>
            </select>
          </Field>
          <Field label="Ötürücü">
            <select className="input" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="automatic">automatic</option>
              <option value="manual">manual</option>
            </select>
          </Field>
          <Field label="Oturacaq">
            <input className="input" type="number" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} />
          </Field>
          <Field label="Kateqoriya">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="hybrid">hybrid</option>
              <option value="electric">electric</option>
              <option value="sport">sport</option>
            </select>
          </Field>
        </div>

        <button className="btn" disabled={saving}>Əlavə et</button>
      </form>

      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-gray-400">
          <tr>
            <th className="p-2">Şəkil</th>
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
              <td className="p-2">
                <img src={car.image} alt={car.model} className="h-12 w-20 rounded object-cover" />
              </td>
              <td className="p-2">{car.brand} {car.model}</td>
              <td className="p-2">{car.year}</td>
              <td className="p-2">₼{car.pricePerDay}</td>
              <td className="p-2">
                <button className="text-amber-500" onClick={() => toggleAvailable(car.id, car.available)}>
                  {car.available ? 'Bəli' : 'Xeyr'}
                </button>
              </td>
              <td className="p-2 text-right">
                <label className="mr-3 cursor-pointer text-amber-500 hover:underline">
                  Şəkli dəyiş
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      changeImage(car.id, e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
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
