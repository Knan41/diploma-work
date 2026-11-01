import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetCarsQuery } from '../store/api/carsApi';
import CarCard from '../components/cars/CarCard';
import Loading from '../components/ui/Loading';
import { Shield, Clock, ThumbsUp, Headphones, ArrowRight, Car, Users, CalendarCheck, Star } from 'lucide-react';

const useCountUp = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  return count;
};

const Home = () => {
  const { t } = useTranslation();
  const { data: cars, isLoading } = useGetCarsQuery({});
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const totalCars = useCountUp(150, 2000, statsVisible);
  const happyClients = useCountUp(2500, 2000, statsVisible);
  const totalBookings = useCountUp(5000, 2000, statsVisible);
  const rating = useCountUp(5, 2000, statsVisible);

  const featuredCars = cars?.slice(0, 6) || [];

  return (
    <div className="bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">{t('home.badge')}</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              {t('home.titleA')}{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {t('home.titleB')}
              </span>{' '}
              {t('home.titleC')}
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-400">
              {t('home.heroText')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/cars"
                className="group flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
              >
                {t('home.viewCars')}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-amber-500">
              {t('home.collection')}
            </span>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{t('home.featured')}</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              {t('home.featuredText')}
            </p>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  to="/cars"
                  className="group inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-8 py-4 font-semibold text-amber-500 transition-all hover:bg-amber-500 hover:text-black"
                >
                  {t('home.viewAll')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-[#111111] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-amber-500">
              {t('home.advantages')}
            </span>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{t('home.whyUs')}</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              {t('home.whyUsText')}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: t('home.f1Title'),
                description: t('home.f1Text'),
              },
              {
                icon: Clock,
                title: t('home.f2Title'),
                description: t('home.f2Text'),
              },
              {
                icon: ThumbsUp,
                title: t('home.f3Title'),
                description: t('home.f3Text'),
              },
              {
                icon: Headphones,
                title: t('home.f4Title'),
                description: t('home.f4Text'),
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-black">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Car, value: totalCars, suffix: '+', label: t('home.statCars') },
              { icon: Users, value: happyClients, suffix: '+', label: t('home.statClients') },
              { icon: CalendarCheck, value: totalBookings, suffix: '+', label: t('home.statBookings') },
              { icon: Star, value: rating, suffix: '.0', label: t('home.statRating') },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#111111] p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                    <Icon className="h-7 w-7 text-amber-500" />
                  </div>
                  <div className="mb-1 text-4xl font-bold text-white">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111111] py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {t('home.ctaTitle')}
          </h2>
          <p className="mb-8 text-lg text-gray-400">
            {t('home.ctaText')}
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
          >
            {t('home.viewCars')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
