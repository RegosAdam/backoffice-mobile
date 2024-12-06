import CustomButton from '../../components/CustomButton';
import { auth } from '../../../.firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Error logging out the user: ', error);
    }
  };

  return (
    <CustomButton
      title="Log Out"
      onPress={handleLogout}
      fontSize={12}
      padding={6}
      bgColor="black"
      textColor="white"
      borderColor="transparent"
    />
  );
}

export default LogoutButton;
