import otpApi from '@api/legacyApi/otp';
import { useMutation } from '@tanstack/react-query';

const useVerifyOtp = (options = {}, withEmail = false) =>
  useMutation({
    mutationFn: async (data) => {
      try {
        return withEmail
          ? await otpApi.verifyOtpMobileAndEmail(data)
          : await otpApi.verifyOtp(data);
      } catch (error) {
        throw error; // Ensure errors are caught in component
      }
    },
    ...options,
  });

export default useVerifyOtp;
