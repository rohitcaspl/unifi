import ProjectDetails from '@screens/ProjectDetails';
import FormDetails from '@screens/FormDetails';
import Login from '@screens/Login';
import NewSignature from '@screens/NewSignature';
import VerifyPhoneNumber from '@screens/VerifyPhoneNumber';
import CameraPage from '@screens/CameraPage';
import Browser from '@screens/Browser';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignatureScreen from '@screens/SignatureScreen';
import Profile from '@screens/Profile';
import EditProfile from '@screens/EditProfile';
import Support from '@screens/Support';
import SignatureDetails from '@screens/SignatureDetails';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '@theme/colors';
import SuccessModal from '@features/signature/newSignature/SuccessModal';
import PdfViewer from '@screens/PdfViewer';
import TabNavigator from './navigators/TabNavigator';
import { useAuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { enteredPhoneNumber, userData } = useAuthContext();

  if (userData === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={colors.orange} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerTitle: '',
          contentStyle: {
            backgroundColor: colors.layout,
          },

          headerShadowVisible: false,
        }}
      >
        {enteredPhoneNumber ? (
          <Stack.Group>
            <Stack.Screen
              name='TabNavigator'
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name='ProjectDetails' component={ProjectDetails} />
            <Stack.Screen name='FormDetails' component={FormDetails} />
            <Stack.Screen name='NewSignature' component={NewSignature} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen
              name='PdfViewer'
              component={PdfViewer}
              options={{ animation: 'slide_from_bottom', headerShown: false }}
            />
            <Stack.Screen
              name='SuccessModal'
              component={SuccessModal}
              options={{ animation: 'slide_from_bottom', headerShown: false }}
            />
            <Stack.Screen
              name='CameraPage'
              component={CameraPage}
              options={{
                headerShown: false,
                orientation: 'portrait_up',
              }}
            />
            <Stack.Screen name='Browser' component={Browser} />
            <Stack.Screen
              name='SignatureDetails'
              component={SignatureDetails}
            />
            <Stack.Screen
              name='SignatureScreen'
              component={SignatureScreen}
              options={{
                orientation: 'landscape',
                headerShown: false,
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name='Login'
              component={Login}
              options={{
                orientation: 'portrait_up',
              }}
            />
            <Stack.Screen name='Support' component={Support} />
            <Stack.Screen
              options={{
                headerShown: true,
                orientation: 'portrait_up',
              }}
              name='Verify'
              component={VerifyPhoneNumber}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export default Navigation;
