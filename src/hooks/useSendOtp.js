import otpApi from '@api/legacyApi/otp';
import { useMutation } from '@tanstack/react-query';

const useSendOtp = (options, withEmail) =>
  useMutation({
    mutationFn: withEmail ? otpApi.sendOtpMobileAndEmail : otpApi.sendOtp,
    mutationKey: ['send_otp', `${withEmail ? 'with_email' : ''}`],
    ...options,
  });

export default useSendOtp;
