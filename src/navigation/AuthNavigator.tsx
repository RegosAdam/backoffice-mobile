import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from '../authentication/screens/RegistrationScreen';
import LoginScreen from '../authentication/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
