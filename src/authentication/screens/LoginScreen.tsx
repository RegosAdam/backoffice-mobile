import React, { useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../.firebase/firebaseConfig';
import SafeArea from '../../components/SafeArea';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log('User logged in successfully!');
      } else {
        await signOut(auth);
        Alert.alert('Error', 'Please verify your email before logging in.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleNavigateToRegistration = () => {
    navigation.navigate('Registration');
  };

  const loginDeveloper = async () => {
    const email = 'dummyu013@gmail.com';
    const password = 'Test123';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in');
    } catch (error) {
      console.log('Error logging in user:', error);
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
}
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
