import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './.firebase/firebaseConfig';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainAppNavigator from './src/navigation/MainAppNavigator';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(user !== null);
    });

    return unsubscribe;
  }, []);

  return <NavigationContainer>{isSignedIn ? <MainAppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

export default App;
