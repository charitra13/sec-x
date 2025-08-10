import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SessionPersistenceState {
  isValidating: boolean;
  lastValidation: Date | null;
  validationInterval: number;
}

export const useSessionPersistence = (
  autoValidateInterval: number = 5 * 60 * 1000
) => {
  const { validateSessionPersistence, sessionPersistent, isAuthenticated } = useAuth();
  const [state, setState] = useState<SessionPersistenceState>({
    isValidating: false,
    lastValidation: null,
    validationInterval: autoValidateInterval
  });

  const validateNow = async () => {
    if (state.isValidating) return;
    
    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const isValid = await validateSessionPersistence();
      setState(prev => ({ 
        ...prev, 
        lastValidation: new Date(),
        isValidating: false 
      }));
      return isValid;
    } catch {
      setState(prev => ({ ...prev, isValidating: false }));
      return false;
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        const now = new Date();
        const lastCheck = state.lastValidation;
        
        if (!lastCheck || (now.getTime() - lastCheck.getTime()) > 60000) {
          validateNow();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, state.lastValidation]);

  useEffect(() => {
    if (!isAuthenticated || autoValidateInterval <= 0) return;

    const interval = setInterval(() => {
      validateNow();
    }, autoValidateInterval);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoValidateInterval]);

  return {
    validateNow,
    isValidating: state.isValidating,
    lastValidation: state.lastValidation,
    sessionPersistent,
    isAuthenticated
  };
};

