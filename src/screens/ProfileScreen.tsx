import React, { useState } from 'react';
import { Text, Alert, View, StyleSheet, ScrollView } from 'react-native';
import SafeArea from '../components/SafeArea';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { auth } from '../../.firebase/firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

function ProfileScreen() {
  const user = auth.currentUser;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (user) {
      if (!user.email) {
        Alert.alert('Error', 'Email not found. Please login again.');
        return;
      }

      if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirm password do not match.');
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Your password has been updated.', [
          {
            text: 'OK',
            onPress: () => {
              setShowChangePassword(false);
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
            },
          },
        ]);
      } catch (error: any) {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Old password is incorrect.');
        } else {
          Alert.alert('Error', error.message);
        }
      }
    } else {
      Alert.alert('Error', 'User not found. Please login again.');
    }
  };

  return (
    <SafeArea>
      <ScrollView>
        <View style={styles.container}>
          {/* <CustomHeader username={user?.displayName || "User"} /> */}
          <Ionicons name={'person-circle-outline' as keyof typeof Ionicons.glyphMap} size={80} color={'#000'} />
          <Text>{user?.displayName}</Text>
          {/* <Text>User Details:</Text> */}
          <Text>{user?.email}</Text>
        </View>
        {!showChangePassword && (
          <View style={styles.singleButtonWrapper}>
            <CustomButton title="Change Password" onPress={() => setShowChangePassword(true)} />
          </View>
        )}

        {showChangePassword && (
          <>
            <CustomTextInput
              label="Old Password"
              secureTextEntry
              onChangeText={(text: string) => setOldPassword(text)}
            />
            <CustomTextInput
              label="New Password"
              secureTextEntry
              onChangeText={(text: string) => setNewPassword(text)}
            />
            <CustomTextInput
              label="Confirm Password"
              secureTextEntry
              onChangeText={(text: string) => setConfirmPassword(text)}
            />

            <View style={styles.doubleButtonWrapper}>
              <CustomButton title="Update Password" onPress={handlePasswordChange} />
              <CustomButton
                title="Cancel"
                onPress={() => {
                  setShowChangePassword(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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

export default ProfileScreen;
