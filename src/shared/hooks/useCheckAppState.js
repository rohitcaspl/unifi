import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

const useCheckAppState = () => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setIsForeground(nextAppState === 'active');
    });

    return () => subscription.remove();
  }, [setIsForeground]);

  return {
    isForeground,
  };
};

export default useCheckAppState;
