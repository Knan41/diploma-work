import { useGetStatsQuery } from '../../store/api/statsApi';
import Loading from '../../components/ui/Loading';

const Dashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();

  if (isLoading || !stats) return <Loading />;

  const items = [
    { label: 'Maşınlar', value: stats.totalCars },
    { label: 'Mövcud maşınlar', value: stats.availableCars },
    { label: 'İstifadəçilər', value: stats.totalUsers },
    { label: 'Rezervasiyalar', value: stats.totalBookings },
    { label: 'Gözləyən', value: stats.pendingBookings },
    { label: 'Təsdiqlənən', value: stats.approvedBookings },
    { label: 'Ləğv edilən', value: stats.cancelledBookings },
    { label: 'Gəlir', value: '₼' + stats.revenue },
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
