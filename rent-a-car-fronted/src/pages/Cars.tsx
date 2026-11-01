import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useGetCarsQuery, useGetCarBrandsQuery } from '../store/api/carsApi';
import { useGetCategoriesQuery } from '../store/api/categoriesApi';
import CarCard from '../components/cars/CarCard';
import Loading from '../components/ui/Loading';

const Cars = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');

  const { data: cars = [], isLoading } = useGetCarsQuery({ search, brand, category });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetCarBrandsQuery();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-white">{t('nav.cars')}</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        <input
          className="input"
          placeholder={t('cars.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">{t('cars.allBrands')}</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{t('cars.allCategories')}</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : cars.length === 0 ? (
        <p className="text-gray-400">{t('common.carNotFound')}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;
