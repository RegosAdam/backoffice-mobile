import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './.firebase/firebaseConfig';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainAppNavigator from './src/navigation/MainAppNavigator';
import useAuthUser from './src/hooks/useAuthUser';
import useBiometricAuthNeeded from './src/hooks/useBiometricAuthNeeded';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const user = useAuthUser();
  const biometricNeeded = useBiometricAuthNeeded();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setIsSignedIn(usr !== null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const runBiometricCheck = async () => {
      if (isSignedIn && biometricNeeded && user) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate',
        });
        if (!result.success) {
          Alert.alert('Authentication Failed', 'Please log in with your password.');
          await signOut(auth);
          setIsSignedIn(false);
        }
      }
    };

    runBiometricCheck();
  }, [isSignedIn, biometricNeeded, user]);

  return <NavigationContainer>{isSignedIn ? <MainAppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

export default App;
