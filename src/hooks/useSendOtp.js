import otpApi from '@api/legacyApi/otp';
import { useMutation } from '@tanstack/react-query';

const useSendOtp = (options = {}, withEmail = false) =>
  useMutation({
    mutationFn: async (data) => {
      try {
        return withEmail
          ? await otpApi.sendOtpMobileAndEmail(data)
          : await otpApi.sendOtp(data);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });

export default useSendOtp;
