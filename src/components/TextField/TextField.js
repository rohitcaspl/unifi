import PropTypes from 'prop-types';
import colors from '@theme/colors';
import InputError from '@components/InputError/InputError';
import CustomText from '@components/CustomText';

import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { useState, useRef } from 'react';

const TextField = ({
  name,
  placeholder,
  customStyle,
  customInputStyle,
  control,
  validations,
  type,
  disabled,
  showEdited,
  multiline,
}) => {
  const ref = useRef();
  const [isFocused, setIsFocused] = useState(false);

  const onInputFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      ref.current.focus();
    }
  };

  const onInputBlur = () => {
    setIsFocused(false);
    ref.current.blur();
  };

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    customInputStyle && customInputStyle,
    disabled && styles.disabled,
    {
      height: multiline ? 140 : 52,

      flexGrow: 1,
    },
  ];

  const inputStyle = [
    styles.input,
    {
      height: multiline ? '85%' : 20,
    },
  ];

  const dirtyStyle = isDirty =>
    isDirty && showEdited
      ? {
          ...styles.changedFormValueStyle,
          ...styles.changedFormValueBorderStyle,
        }
      : {};

  const errorStyle = invalid =>
    invalid
      ? {
          ...styles.invalidFormValue,
          ...styles.invalidFormValueBorderStyle,
        }
      : {};

  return (
    <View style={customStyle}>
      <Controller
        control={control}
        name={name}
        rules={{ ...validations }}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error, isDirty, invalid },
        }) => {
          return (
            <>
              <TouchableOpacity
                style={[
                  inputContainerStyle,
                  dirtyStyle(isDirty),
                  errorStyle(invalid),
                ]}
                activeOpacity={1}
                onPress={onInputFocus}
              >
                <CustomText
                  size={isFocused || !!value ? 12 : 16}
                  style={[
                    styles.placeholder,
                    isFocused || !!value ? styles.placeholderOnFocus : {},
                  ]}
                >
                  {placeholder}
                </CustomText>
                <TextInput
                  editable={!disabled}
                  ref={ref}
                  onBlur={() => {
                    onBlur();
                    onInputBlur();
                  }}
                  keyboardType={type}
                  value={value}
                  onChangeText={onChange}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  autoCapitalize={name === 'email' ? 'none' : 'sentences'}
                  multiline={multiline}
                />
              </TouchableOpacity>
              <InputError message={error?.message} />
            </>
          );
        }}
      />
    </View>
  );
};

TextField.propTypes = {
  placeholder: PropTypes.string,
  customStyle: PropTypes.object,
  customInputStyle: PropTypes.object,
  control: PropTypes.object,
  validations: PropTypes.object,
  error: PropTypes.object,
  type: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  showEdited: PropTypes.bool,
  multiline: PropTypes.bool,
};

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: colors.borderGray,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    position: 'absolute',
    bottom: 7,
    left: 16,
    padding: 0,
    color: colors.text,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: colors.orange,
  },
  placeholder: {
    position: 'absolute',
    top: 14,
    left: 16,
    color: colors.label,
  },
  placeholderOnFocus: {
    top: 8,
    fontSize: 12,
  },
  disabled: {
    backgroundColor: colors.accentGray,
    borderWidth: 0,
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

export default TextField;
