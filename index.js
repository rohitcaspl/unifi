/**
 * @format
 */
import 'react-native-gesture-handler';
import { Platform, AppRegistry } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

process.env.EXPO_OS = Platform.OS;

import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
