import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import LogoutButton from '../authentication/components/LogoutButton';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainScreen from '../screens/MainScreen';

const Tab = createBottomTabNavigator();

const TAB_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Main: 'home',
  Calendar: 'calendar',
  Profile: 'person',
};

type ScreenOptionsProps = {
  route: RouteProp<Record<string, object | undefined>, string>;
};

const createScreenOptions = ({ route }: ScreenOptionsProps): BottomTabNavigationOptions => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />
    ),
    tabBarActiveTintColor: 'black',
    tabBarInactiveTintColor: 'gray',
    tabBarStyle: [
      {
        display: 'flex',
      },
      null,
    ],
  };
};

function MainAppNavigator() {
  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={() => ({
          headerRight: () => {
            return <LogoutButton />;
          },
        })}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={() => ({
          headerRight: () => {
            return <LogoutButton />;
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          headerRight: () => {
            return <LogoutButton />;
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default MainAppNavigator;
