import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, logout } from '../../store/slices/authSlice';
import { Menu, X, ChevronDown, User, CalendarDays, LogOut, Shield, Car } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hər hansı linkə klik ediləndə menyuları bağla
  const closeMenus = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) {
      setIsMobileOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Uğurla çıxış edildi');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Əsas Səhifə' },
    { to: '/cars', label: 'Maşınlar' },
    { to: '/about', label: 'Haqqımızda' },
    { to: '/contact', label: 'Əlaqə' },
  ];

  return (
    <nav
      onClick={closeMenus}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-amber-500" />
          <span className="text-2xl font-bold tracking-tight text-white">
            RENT<span className="text-amber-500">CAR</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                location.pathname === link.to ? 'text-amber-500' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-amber-500/30 hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Rezervasiyalarım
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-amber-500 transition-colors hover:bg-amber-500/10"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-white/10 p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıxış
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-amber-500/30 hover:bg-white/5"
              >
                Daxil ol
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
              >
                Qeydiyyat
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 md:hidden"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5 ${
                  location.pathname === link.to ? 'text-amber-500' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <div className="my-2 border-t border-white/10" />
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/5"
                >
                  <CalendarDays className="h-4 w-4" />
                  Rezervasiyalarım
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/5"
                >
                  <User className="h-4 w-4" />
                  Profil
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-amber-500 transition-colors hover:bg-amber-500/10"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-white/10" />
                <div className="flex gap-3 px-4 py-2">
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg border border-white/10 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/5"
                  >
                    Daxil ol
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 rounded-lg bg-amber-500 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-amber-400"
                  >
                    Qeydiyyat
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
