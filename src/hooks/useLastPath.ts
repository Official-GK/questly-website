import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useLastPath() {
  const location = useLocation();
  const { setLastPath } = useAuth();

  useEffect(() => {
    // Only save paths that we want to return to
    const pathsToSave = ['/dashboard', '/courses', '/profile', '/ai', '/flashcards', '/summary', '/quiz', '/mock-test'];
    if (pathsToSave.includes(location.pathname)) {
      setLastPath(location.pathname);
    }
  }, [location, setLastPath]);
}
