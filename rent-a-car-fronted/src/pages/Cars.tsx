import { useState } from 'react';
import { useGetCarsQuery, useGetCarBrandsQuery } from '../store/api/carsApi';
import CarCard from '../components/cars/CarCard';
import Loading from '../components/ui/Loading';

const Cars = () => {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');

  const { data: cars = [], isLoading } = useGetCarsQuery({ search, brand, category });
  const { data: brands = [] } = useGetCarBrandsQuery();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-white">Maşınlar</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        <input
          className="input"
          placeholder="Axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Bütün markalar</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Bütün kateqoriyalar</option>
          <option value="hybrid">Hibrid</option>
          <option value="electric">Elektrik</option>
          <option value="sport">Sport</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : cars.length === 0 ? (
        <p className="text-gray-400">Maşın tapılmadı.</p>
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
