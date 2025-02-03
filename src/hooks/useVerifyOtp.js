import otpApi from '@api/legacyApi/otp';
import { useMutation } from '@tanstack/react-query';

const useVerifyOtp = (options, withEmail) =>
  useMutation({
    mutationFn: withEmail ? otpApi.verifyOtpMobileAndEmail : otpApi.verifyOtp,
    key: ['verify_otp', `${withEmail ? 'with_email' : ''}`],
    ...options,
  });

export default useVerifyOtp;
