import React, { useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../.firebase/firebaseConfig';
import SafeArea from '../../components/SafeArea';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import * as LocalAuthentication from 'expo-local-authentication';
import { setItem, getItem } from '../../helpers/storageHelper';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        Alert.alert('Error', 'Please verify your email before logging in.');
        return;
      }

      console.log('User logged in successfully!');

      // User-specific keys
      const promptKey = `biometricPromptShown_${user.uid}`;
      const enabledKey = `biometricEnabled_${user.uid}`;
      const tokenKey = `userToken_${user.uid}`;

      // Check if we have ever shown the biometric prompt to this specific user
      const promptShown = await getItem(promptKey);
      if (promptShown === null) {
        // First verified login for this user, show prompt
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          Alert.alert('Enable Biometric Login?', 'Would you like to use fingerprint/Face ID for future logins?', [
            {
              text: 'No',
              style: 'cancel',
              onPress: async () => {
                await setItem(enabledKey, 'false');
                await setItem(promptKey, 'true');
              },
            },
            {
              text: 'Yes',
              onPress: async () => {
                const token = await user.getIdToken();
                await setItem(tokenKey, token);
                await setItem(enabledKey, 'true');
                await setItem(promptKey, 'true');
              },
            },
          ]);
        } else {
          // No biometric hardware/enrollment for this device
          await setItem(enabledKey, 'false');
          await setItem(promptKey, 'true');
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', message);
    }
  };

  const handleNavigateToRegistration = () => {
    navigation.navigate('Registration');
  };

  const loginDeveloper = async () => {
    const devEmail = 'dummyu013@gmail.com';
    const devPassword = 'Test123';
    try {
      await signInWithEmailAndPassword(auth, devEmail, devPassword);
      console.log('Dev user logged in');
      // Dev user also follows same logic above upon first verified login
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log('Error logging in user:', message);
    }
  };

  return (
    <SafeArea>
      <ScrollView>
        <View style={styles.container}>
          <CustomTextInput label="Email" onChangeText={setEmail} />
          <CustomTextInput label="Password" secureTextEntry onChangeText={setPassword} />
          <View style={styles.doubleButtonWrapper}>
            <CustomButton title="Log in" onPress={handleLogin} />
            <CustomButton title="Create Account" onPress={handleNavigateToRegistration} />
          </View>
          <View style={styles.singleButtonWrapper}>
            <CustomButton title="Dev log in" onPress={loginDeveloper} />
          </View>
        </View>
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  doubleButtonWrapper: {
    flexDirection: 'row',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-around',
  },
  singleButtonWrapper: {
    flexDirection: 'row',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
});

export default LoginScreen;
