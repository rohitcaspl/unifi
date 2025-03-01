import ProjectsList from '@features/project/ProjectsList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignatureLog from '@screens/SignatureLog';
import Profile from '@screens/Profile';
import colors from '@theme/colors';
import FolderIcon from '@assets/icons/folder.svg';
import FormIcon from '@assets/icons/form.svg';
import ProfileIcon from '@assets/icons/profile.svg';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      backBehavior='history'
      sceneContainerStyle={{
        backgroundColor: colors.layout,
      }}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
        },
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.textLightGray,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          marginBottom: 10,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name='ProjectsList'
        component={ProjectsList}
        options={{
          tabBarLabel: 'Doc Space',
          title: 'Doc Space',
          tabBarIcon: ({ focused }) => (
            <FolderIcon
              stroke={focused ? colors.orange : colors.textLightGray}
            />
          ),
        }}
      />
      <Tab.Screen
        name='SignatureLog'
        component={SignatureLog}
        options={{
          tabBarLabel: 'Consent Log',
          title: 'Consent Log',
          tabBarIcon: ({ focused }) => (
            <FormIcon
              width={16}
              height={16}
              stroke={focused ? colors.orange : colors.textLightGray}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              stroke={focused ? colors.orange : colors.textLightGray}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
