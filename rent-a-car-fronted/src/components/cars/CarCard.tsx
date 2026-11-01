import { Link } from 'react-router-dom';
import type { Car } from '../../types';
import { Fuel, Settings2, Users, ArrowRight } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="relative h-52 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black">
          {car.category}
        </span>
        {!car.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-bold text-white">
              Mövcud deyil
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-1 text-sm text-gray-400">{car.year}</div>
        <h3 className="mb-3 text-lg font-bold text-white">
          {car.brand} {car.model}
        </h3>

        <div className="mb-4 flex items-center gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Fuel className="h-4 w-4 text-amber-500" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Settings2 className="h-4 w-4 text-amber-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Users className="h-4 w-4 text-amber-500" />
            <span>{car.seats}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-amber-500">₼{car.pricePerDay}</span>
            <span className="text-sm text-gray-400"> / gün</span>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Ətraflı
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
