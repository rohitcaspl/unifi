import PropTypes from 'prop-types';
import colors from '@theme/colors';

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import CustomText from '@components/CustomText';

const CustomSwitch = ({
  selectionMode,
  option1,
  option2,
  onSelectSwitch,
  selectionColor,
  disabled,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };
  return (
    <View>
      <View style={[styles.container, disabled && styles.disabled]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          disabled={disabled}
          style={[
            styles.toggleState,
            {
              backgroundColor:
                getSelectionMode === 1 ? colors.white : colors.selectedGray,
            },
          ]}
        >
          <CustomText
            style={{
              color: getSelectionMode === 1 ? colors.orange : colors.black,
            }}
            size={14}
          >
            {option1}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          disabled={disabled}
          style={[
            styles.toggleState,
            {
              backgroundColor:
                getSelectionMode === 2 ? colors.white : colors.selectedGray,
            },
          ]}
        >
          <CustomText
            style={{
              color: getSelectionMode === 2 ? colors.orange : colors.black,
            }}
            size={14}
          >
            {option2}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CustomSwitch.propTypes = {
  selectionMode: PropTypes.number,
  option1: PropTypes.string,
  option2: PropTypes.string,
  onSelectSwitch: PropTypes.func,
  selectionColor: PropTypes.string,
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    height: 46,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,

    backgroundColor: colors.selectedGray,

    borderRadius: 6,
  },

  toggleState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

    borderRadius: 4,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default CustomSwitch;
