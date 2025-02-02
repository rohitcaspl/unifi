const formatPhoneNumberObject = (fullNumber, countryCode) => ({
  mobile: fullNumber,
  country: `+${countryCode}`,
  phone: fullNumber.replace(`+${countryCode}`, ''),
});

export default formatPhoneNumberObject;
