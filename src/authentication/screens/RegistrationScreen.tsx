import React, { useState } from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../../../.firebase/firebaseConfig';
import SafeArea from '../../components/SafeArea';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { doc, setDoc } from 'firebase/firestore';

const RegistrationScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: userCredential.user.displayName,
        logs: null,
      });
      await sendEmailVerification(userCredential.user);
      navigation.navigate('Login');
      Alert.alert('Registration Successful', 'Please verify your email and then log in.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeArea>
      <ScrollView>
        <View style={styles.container}>
          <CustomTextInput label="Username" onChangeText={setUsername} />
          <CustomTextInput label="Email" onChangeText={setEmail} />
          <CustomTextInput label="Password" secureTextEntry onChangeText={setPassword} />
          <CustomTextInput label="Confirm Password" secureTextEntry onChangeText={setConfirmPassword} />
          <View style={styles.buttonWrapper}>
            <CustomButton title="Create Account" onPress={handleRegistration} />
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
  buttonWrapper: {
    flexDirection: 'row',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
});

export default RegistrationScreen;
