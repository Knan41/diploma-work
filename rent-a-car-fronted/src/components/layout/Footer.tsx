import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook as Facebook, FaInstagram as Instagram, FaTwitter as Twitter, FaYoutube as Youtube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <Car className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-bold tracking-tight text-white">
                RENT<span className="text-amber-500">CAR</span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Premium avtomobil kirayə xidməti. Ən yaxşı maşınları ən sərfəli qiymətlərlə icarəyə götürün.
              Rahatlığınız və təhlükəsizliyiniz bizim üçün önəmlidir.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/not-found"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                to="/not-found"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                to="/not-found"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                to="/not-found"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Sürətli Keçidlər</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Əsas Səhifə' },
                { to: '/cars', label: 'Maşınlar' },
                { to: '/about', label: 'Haqqımızda' },
                { to: '/contact', label: 'Əlaqə' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 transition-colors hover:text-amber-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Xidmətlər</h3>
            <ul className="space-y-3">
              {[
                'Günlük Kirayə',
                'Aylıq Kirayə',
                'Hava Limanı Transferi',
                'VIP Xidmət',
                'Korporativ Kirayə',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Əlaqə</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <span className="text-sm text-gray-400">
                  Bakı şəhəri, Nəsimi rayonu, Nizami küçəsi 25
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-amber-500" />
                <a href="tel:+994501234567" className="text-sm text-gray-400 transition-colors hover:text-amber-500">
                  +994 50 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-amber-500" />
                <a href="mailto:info@rentcar.az" className="text-sm text-gray-400 transition-colors hover:text-amber-500">
                  info@rentcar.az
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RENTCAR. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
