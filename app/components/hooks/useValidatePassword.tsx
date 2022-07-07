import { useCallback } from 'react';
import SecureKeychain from '../../core/SecureKeychain';

const useValidatePassword = (): [(input: string) => Promise<boolean>] => {
  const doesPasswordMatch = useCallback(async (input: string) => {
    try {
      const credentials = await SecureKeychain.getGenericPassword();
      if (credentials) {
        if (credentials.password === input) {
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  return [doesPasswordMatch];
};

export default useValidatePassword;
