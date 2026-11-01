import { useTranslation } from 'react-i18next';
import { useGetStatsQuery } from '../../store/api/statsApi';
import Loading from '../../components/ui/Loading';

const Dashboard = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetStatsQuery();

  if (isLoading || !stats) return <Loading />;

  const items = [
    { label: t('nav.cars'), value: stats.totalCars },
    { label: t('admin.availableCars'), value: stats.availableCars },
    { label: t('admin.users'), value: stats.totalUsers },
    { label: t('admin.bookings'), value: stats.totalBookings },
    { label: t('admin.pending'), value: stats.pendingBookings },
    { label: t('admin.approved'), value: stats.approvedBookings },
    { label: t('admin.cancelled'), value: stats.cancelledBookings },
    { label: t('admin.revenue'), value: '₼' + stats.revenue },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card">
          <p className="text-sm text-gray-400">{item.label}</p>
          <p className="text-3xl font-bold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
