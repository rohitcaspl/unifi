import { addEventListener } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';

const useOnlineManager = () => {
  useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });
  }, []);
};

export default useOnlineManager;
