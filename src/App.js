/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { StatusBar, useColorScheme, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { MediaProvider } from 'context/MediaContext';
import { AuthProvider } from 'context/AuthContext';
import 'react-native-gesture-handler';
import useTriggerBiometrics from '@shared/hooks/useTriggerBiometrics';
import TriggerBiometricsModal from '@components/TriggerBiometricsModal';
// import * as Location from 'expo-location';
import config from '@config';
import { useEffect } from 'react';
import { WorkspaceProvider } from 'context/WorkspaceContext';
import { queryClient } from '@api/legacyApi/base';
import useOnlineManager from '@hooks/useOnlineManager';
import colors from '@theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import countries from 'i18n-iso-countries';
import nationalities from 'i18n-nationality';
import ToastProvider from '@components/Toast';

import * as Sentry from '@sentry/react-native';
import Navigation from './navigation';

Sentry.init({
  dsn: 'https://ec0fa917642a473b8cfa9b4eca7a9b51@o4504985781862400.ingest.sentry.io/4504985799688192',
});

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
nationalities.registerLocale(require('i18n-nationality/langs/en.json'));

const App = () => {
  const { triggerBiometrics, dismissed } = useTriggerBiometrics();
  useOnlineManager();

  // useEffect(() => {
  //   Location.setGoogleApiKey(config.googleApiKey);
  // }, []);

  const viewStyle = {
    flex: 1,
    backgroundColor: colors.layout,
  };

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <MediaProvider>
            <StatusBar
              translucent={true}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={'transparent'}
            />
            <View style={viewStyle}>
              <TriggerBiometricsModal
                open={dismissed}
                triggerBiometrics={triggerBiometrics}
              />
              <ToastProvider>
                <SafeAreaProvider>
                  <Navigation />
                </SafeAreaProvider>
              </ToastProvider>
            </View>
          </MediaProvider>
        </WorkspaceProvider>
      </AuthProvider>
     </QueryClientProvider>
  );
};

export default App;
