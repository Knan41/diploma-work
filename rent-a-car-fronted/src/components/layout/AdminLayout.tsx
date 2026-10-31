import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Uğurla çıxış edildi');
    navigate('/');
  };

  const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/cars', label: 'Maşınlar', icon: Car },
    { to: '/admin/bookings', label: 'Rezervasiyalar', icon: CalendarDays },
    { to: '/admin/users', label: 'İstifadəçilər', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#111111] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-bold text-white">
              RENT<span className="text-amber-500">CAR</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/5 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
            Sayta Qayıt
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            Çıxış
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111111] px-4 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white lg:text-xl">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-white sm:inline">{user?.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
