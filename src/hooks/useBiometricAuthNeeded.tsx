// src/hooks/useBiometricAuthNeeded.ts
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { getItem } from '../helpers/storageHelper';
import useAuthUser from './useAuthUser';

const useBiometricAuthNeeded = (): boolean => {
  const user = useAuthUser();
  const [biometricNeeded, setBiometricNeeded] = useState<boolean>(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      if (!user) {
        setBiometricNeeded(false);
        return;
      }

      // Use user-specific key
      const biometricEnabled = await getItem(`biometricEnabled_${user.uid}`);

      if (biometricEnabled === 'true') {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricNeeded(compatible && enrolled);
      } else {
        setBiometricNeeded(false);
      }
    };

    checkBiometrics();
  }, [user]);

  return biometricNeeded;
};

export default useBiometricAuthNeeded;
