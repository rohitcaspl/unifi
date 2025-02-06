/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-quotes */
import PropTypes from 'prop-types';
import PhoneInput from 'react-native-phone-input';

import colors from '@theme/colors';
import InputError from '@components/InputError/InputError';

import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import CustomText from '@components/CustomText';
import { Controller } from 'react-hook-form';

const InputPhone = ({
  phoneRef,
  customStyle,
  autofillValue,
  disabled,
  placeholder,
  control,
  name,
  validations,
  showEdited,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.phoneInput,
    isFocused && styles.focused,
    disabled && styles.disabled,
    customStyle ? customStyle : {},
  ];

  useEffect(() => {
    if (autofillValue && phoneRef.current?.state?.value !== autofillValue) {
      phoneRef.current?.setValue(autofillValue);
    }
  }, [autofillValue, phoneRef]);

  const dirtyStyles = (isDirty, invalid) => {
    return isDirty && !invalid && showEdited
      ? {
          ...styles.changedFormValueStyle,
          ...styles.changedFormValueBorderStyle,
        }
      : invalid
      ? {
          ...styles.invalidFormValue,
          ...styles.invalidFormValueBorderStyle,
        }
      : {};
  };

  return (
    <View>
      <Controller
        control={control}
        name={name}
        rules={{
          validate: value =>
            phoneRef.current?.isValidNumber(value) ||
            'Enter a valid mobile phone number',
          ...validations,
        }}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { invalid, isDirty, error },
        }) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => phoneRef.current?.focus()}
                activeOpacity={1}
              >
                <PhoneInput
                  ref={phoneRef}
                  style={[inputStyle, dirtyStyles(isDirty, invalid)]}
                  initialCountry='us'
                  textProps={{
                    placeholder: 'Phone number',
                    onFocus: () => setIsFocused(true),
                    onBlur: () => setIsFocused(false),
                  }}
                  initialValue={autofillValue || value}
                  value={value}
                  onChangePhoneNumber={onChange}
                  disabled={disabled}
                  textStyle={styles.textStyle}
                />
                <CustomText size={12} style={styles.placeholder}>
                  {placeholder}
                </CustomText>
              </TouchableOpacity>
              <InputError message={error?.message} />
            </>
          );
        }}
      />
    </View>
  );
};

InputPhone.propTypes = {
  phoneRef: PropTypes.object,
  customStyle: PropTypes.object,
  value: PropTypes.string,
  autofillValue: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  control: PropTypes.object,
  validations: PropTypes.object,
  name: PropTypes.string,
  showEdited: PropTypes.bool,
};

const styles = StyleSheet.create({
  phoneInput: {
    borderColor: colors.borderGray,
    borderRadius: 10,
    borderWidth: 1,
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white, // Set background color
  },

  focused: {
    borderColor: colors.orange,
  },
  disabled: {
    backgroundColor: colors.accentGray,
    borderWidth: 0,
  },
  placeholder: {
    position: 'absolute',
    left: 65,
    top: 9,
    color: colors.label,
  },

  textStyle: {
    position: 'absolute',
    left: 8,
    bottom: -18,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    color: colors.black, // Set text color to black
  },
  changedFormValueStyle: {
    backgroundColor: colors.lightYellow,
    borderRadius: 10,
  },
  changedFormValueBorderStyle: {
    borderWidth: 1,
    borderColor: colors.yellow,
  },

  invalidFormValue: {
    borderRadius: 10,
  },
  invalidFormValueBorderStyle: {
    borderWidth: 1,
    borderColor: colors.error,
  },
});

export default InputPhone;
