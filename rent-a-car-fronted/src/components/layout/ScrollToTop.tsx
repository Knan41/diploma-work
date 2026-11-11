import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Səhifə dəyişəndə həmişə yuxarıdan (header-dən) başlasın
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
