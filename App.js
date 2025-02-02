/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';


const App=()=> {
  useEffect(() => {
    // When your app is ready, hide the splash screen
    SplashScreen.hide();
  }, []);

  return (
<View><Text>jhifbkhjfjkjkjkjf</Text></View>
  );
}


export default App;
