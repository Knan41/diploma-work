import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUpdateCarMutation } from '../../store/api/carsApi';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import { errorMessage } from '../../utils/errorMessage';
import { readImageFile } from '../../utils/imageFile';
import { localizeDescription } from '../../utils/carText';
import type { Car } from '../../types';

interface CarEditFormProps {
  car: Car;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-400">
    {label}
    {children}
  </label>
);

const CarEditForm = ({ car }: CarEditFormProps) => {
  const { t, i18n } = useTranslation();
  const lang: 'az' | 'en' = i18n.resolvedLanguage === 'en' ? 'en' : 'az';
  const currentDescription = localizeDescription(car, lang);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [updateCar, { isLoading }] = useUpdateCarMutation();

  const [brand, setBrand] = useState(car.brand);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(String(car.year));
  const [price, setPrice] = useState(String(car.pricePerDay));
  const [engine, setEngine] = useState(car.engine ?? '');
  const [horsepower, setHorsepower] = useState(car.horsepower ? String(car.horsepower) : '');
  const [fuel, setFuel] = useState(car.fuel);
  const [transmission, setTransmission] = useState(car.transmission);
  const [seats, setSeats] = useState(String(car.seats));
  const [category, setCategory] = useState(car.category);
  const [description, setDescription] = useState(currentDescription);
  const [image, setImage] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const [available, setAvailable] = useState(car.available);

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImage(await readImageFile(file));
    } catch (err) {
      toast.error((err as Error).message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCar({
        id: car.id,
        data: {
          brand,
          model,
          year: Number(year),
          pricePerDay: Number(price),
          engine,
          horsepower: horsepower ? Number(horsepower) : undefined,
          fuel,
          transmission,
          seats: Number(seats),
          category,
          ...(description !== currentDescription ? { description, descriptionLang: lang } : {}),
          image: image || undefined,
          available,
        },
      }).unwrap();
      toast.success(t('carDetail.saved'));
      setImage('');
      setFileKey((k) => k + 1);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <h2 className="text-lg font-semibold">{t('carDetail.editTitle')}</h2>

      <div className="flex items-center gap-4 rounded-lg border border-dashed border-white/30 p-3">
        <img
          src={image || car.image}
          alt={`${car.brand} ${car.model}`}
          className="h-20 w-32 shrink-0 rounded-lg object-cover"
        />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">{t('adminCars.image')}</p>
          <input
            key={fileKey}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={pickImage}
            className="block text-sm text-gray-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-500">{t('adminCars.imageHint')}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
              <option key={c.value} value={c.value}>{t(`categories.${c.value}`, { defaultValue: c.label })}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t('carDetail.description')}>
        <textarea
          className="input"
          rows={4}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <span className="text-xs text-gray-500">{t('carDetail.descriptionHint')}</span>
      </Field>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
        {t('adminCars.thAvailable')}
      </label>

      <button className="btn w-full" disabled={isLoading}>{t('profile.save')}</button>
    </form>
  );
};

export default CarEditForm;
