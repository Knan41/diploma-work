import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCarsQuery, useCreateCarMutation, useDeleteCarMutation, useUpdateCarMutation } from '../../store/api/carsApi';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/categoriesApi';
import Loading from '../../components/ui/Loading';
import { errorMessage } from '../../utils/errorMessage';
import i18n from '../../i18n';

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) return reject(new Error(i18n.t('adminCars.imageTooBig')));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(i18n.t('adminCars.imageReadFail')));
    reader.readAsDataURL(file);
  });

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-400">
    {label}
    {children}
  </label>
);

const AdminCars = () => {
  const { t } = useTranslation();
  const { data: cars = [], isLoading } = useGetCarsQuery();
  const [createCar, { isLoading: saving }] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const created = await createCategory({ label: newCategory }).unwrap();
      setCategory(created.value);
      setNewCategory('');
      toast.success(t('adminCars.categoryAdded'));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDeleteCategory = async (id: number, value: string) => {
    if (!confirm(t('adminCars.categoryDeleteConfirm'))) return;
    try {
      await deleteCategory(id).unwrap();
      if (category === value) setCategory('hybrid');
      toast.success(t('adminCars.categoryDeleted'));
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

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
      toast.error(t('adminCars.imageRequired'));
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
      toast.success(t('adminCars.carAdded'));
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
      toast.success(t('adminCars.imageChanged'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : errorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      await deleteCar(id).unwrap();
      toast.success(t('adminCars.carDeleted'));
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
        <h2 className="text-lg font-semibold text-white">{t('adminCars.addCar')}</h2>

        {/* Şəkil */}
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-amber-500/40 p-4 sm:flex-row sm:items-center">
          <div className="flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-xs text-gray-500">
            {image ? <img src={image} alt={t('adminCars.preview')} className="h-full w-full object-cover" /> : t('adminCars.noImage')}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">{t('adminCars.carImage')} <span className="text-red-400">*</span></p>
            <input
              key={fileKey}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={pickImage}
              className="block text-sm text-gray-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-amber-400"
            />
            <p className="text-xs text-gray-500">{t('adminCars.imageHint')}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t('adminCars.brand')}>
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </Field>
          <Field label={t('adminCars.model')}>
            <input className="input" value={model} onChange={(e) => setModel(e.target.value)} required />
          </Field>
          <Field label={t('adminCars.year')}>
            <input className="input" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
          </Field>
          <Field label={t('adminCars.priceLabel')}>
            <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Field>
          <Field label={t('carDetail.engine')}>
            <input className="input" placeholder={t('adminCars.enginePh')} value={engine} onChange={(e) => setEngine(e.target.value)} />
          </Field>
          <Field label={t('adminCars.hpLabel')}>
            <input className="input" type="number" value={horsepower} onChange={(e) => setHorsepower(e.target.value)} />
          </Field>
          <Field label={t('carDetail.fuel')}>
            <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="petrol">{t('fuel.petrol')}</option>
              <option value="diesel">{t('fuel.diesel')}</option>
              <option value="hybrid">{t('fuel.hybrid')}</option>
              <option value="electric">{t('fuel.electric')}</option>
            </select>
          </Field>
          <Field label={t('carDetail.transmission')}>
            <select className="input" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="automatic">{t('transmission.automatic')}</option>
              <option value="manual">{t('transmission.manual')}</option>
            </select>
          </Field>
          <Field label={t('carDetail.seats')}>
            <input className="input" type="number" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} />
          </Field>
          <Field label={t('adminCars.category')}>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Kateqoriyalar */}
        <div className="space-y-2 rounded-lg border border-white/10 p-4">
          <p className="text-sm font-medium text-white">{t('adminCars.categories')}</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-300">
                {c.label}
                <button type="button" className="text-red-400 hover:text-red-300" title={t('common.delete')} onClick={() => handleDeleteCategory(c.id, c.value)}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder={t('adminCars.newCategoryPh')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <button type="button" className="btn" onClick={handleAddCategory}>{t('adminCars.addCategory')}</button>
          </div>
        </div>

        <button className="btn" disabled={saving}>{t('adminCars.add')}</button>
      </form>

      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-gray-400">
          <tr>
            <th className="p-2">{t('adminCars.thImage')}</th>
            <th className="p-2">{t('adminCars.thCar')}</th>
            <th className="p-2">{t('adminCars.year')}</th>
            <th className="p-2">{t('adminCars.thPrice')}</th>
            <th className="p-2">{t('adminCars.thAvailable')}</th>
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
                  {car.available ? t('adminCars.yes') : t('adminCars.no')}
                </button>
              </td>
              <td className="p-2 text-right">
                <label className="mr-3 cursor-pointer text-amber-500 hover:underline">
                  {t('adminCars.changeImage')}
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
                <button className="btn-danger" onClick={() => handleDelete(car.id)}>{t('common.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCars;
