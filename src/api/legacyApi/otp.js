import axios from './base';

const sendOtp = async (data) => {
  console.log('Sending OTP:', data);
  return axios.post('/otp/send_otp', data);
};

const verifyOtp = async (data) => {
  console.log('Verifying OTP:', data);
  return axios.post('/otp/verify_otp', data);
};

const sendOtpMobileAndEmail = async (data) => {
  console.log('Sending OTP (Mobile & Email):', data);
  return axios.post('/otp/send_mobile_and_email_otp', data);
};

const verifyOtpMobileAndEmail = async (data) => {
  console.log('Verifying OTP (Mobile & Email):', data);
  return axios.post('/otp/verify_mobile_and_email_otp', data);
};

export default {
  sendOtp,
  verifyOtp,
  sendOtpMobileAndEmail,
  verifyOtpMobileAndEmail,
};
