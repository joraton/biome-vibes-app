import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour faire défiler automatiquement vers le haut
 * lors des changements de route
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
};

/**
 * Fonction utilitaire pour faire défiler vers le haut manuellement
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};