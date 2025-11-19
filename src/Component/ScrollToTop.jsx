import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls to top on route change
 * and ensures proper layout rendering
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Use requestAnimationFrame to ensure layout is ready
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    };

    // Execute immediately
    scrollToTop();
    
    // Execute after next frame to catch any delayed layout changes
    requestAnimationFrame(() => {
      scrollToTop();
      // One more frame for safety
      requestAnimationFrame(scrollToTop);
    });

    // Also handle resize to ensure layout stability
    const handleResize = () => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;

