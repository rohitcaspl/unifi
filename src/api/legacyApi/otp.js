import axios from './base';

const sendOtp = data => axios.post('/otp/send_otp', data);
const verifyOtp = data => axios.post('/otp/verify_otp', data);

const sendOtpMobileAndEmail = data =>
  axios.post('otp/send_mobile_and_email_otp', data);

const verifyOtpMobileAndEmail = data =>
  axios.post('otp/verify_mobile_and_email_otp', data);

export default {
  sendOtp,
  verifyOtp,
  sendOtpMobileAndEmail,
  verifyOtpMobileAndEmail,
};
