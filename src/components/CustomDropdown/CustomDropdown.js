import PropTypes from 'prop-types';
import colors from '@theme/colors';
import ArrowDown from '@assets/icons/arrow-down.svg';
import ArrowUp from '@assets/icons/arrow-up.svg';
import CustomText from '@components/CustomText';

import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';

const CustomDropdown = ({
  options,
  defaultValue,
  selectedValue,
  setSelectedValue,
  labelKey,
  identifier,
  initialIndex,
  customStyle,
  isCountryPicker,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOnSelect = value => {
    setSelectedValue(value);
    setIsOpen(false);
  };
  const [dropdownMeasurement, setDropdownMeasurement] = useState({});

  const buttonStyle = [
    styles.button,
    isOpen ? styles.topBorder : styles.fullBorder,
    customStyle,
  ];

  const dropdownStyle = [
    styles.dropdown,
    options?.length > 4
      ? styles.limitedHeight
      : { minHeight: options?.length * 38 },
    {
      top: dropdownMeasurement.top,
      width: dropdownMeasurement.width || '100%',
    },
  ];
  const DropdownButton = useRef();

  const toggleDropdown = () => {
    isOpen ? setIsOpen(false) : openDropdown();
  };

  const checkIsSelected = item => {
    if (isCountryPicker)
      return (
        item[identifier] &&
        item[identifier]?.includes(selectedValue[identifier])
      );
    else {
      return item[identifier] === selectedValue[identifier];
    }
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownMeasurement({
        top: py + h,
        width: _w,
      });
    });
    setIsOpen(true);
  };

  return (
    <>
      <TouchableOpacity
        ref={DropdownButton}
        style={buttonStyle}
        onPress={toggleDropdown}
      >
        <Modal
          visible={(isOpen && options?.length > 0) ?? false}
          transparent
          statusBarTranslucent
          animationType='fade'
          supportedOrientations={['landscape', 'portrait']}
        >
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsOpen(false)}
          >
            {options?.length > 0 ? (
              <View style={dropdownStyle}>
                <FlashList
                  data={options}
                  initialScrollIndex={initialIndex}
                  estimatedFirstItemOffset={0}
                  nestedScrollEnabled={Platform.OS === 'android'}
                  keyExtractor={item => item[labelKey]}
                  estimatedItemSize={50}
                  alwaysBounceVertical
                  renderItem={({ item, index }) => (
                    <Pressable
                      style={[
                        styles.item,
                        options?.length === index + 1 && styles.lastItem,
                        checkIsSelected(item) && styles.selected,
                      ]}
                      onPress={() => handleOnSelect(item)}
                    >
                      <CustomText>{item[labelKey]}</CustomText>
                    </Pressable>
                  )}
                />
              </View>
            ) : null}
          </TouchableOpacity>
        </Modal>
        <View>
          <CustomText size={12} style={styles.placeholder}>
            {placeholder}
          </CustomText>
          <CustomText>
            {selectedValue[labelKey]
              ? selectedValue[labelKey]
              : defaultValue[labelKey]}
          </CustomText>
        </View>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </TouchableOpacity>
    </>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.object,
  selectedValue: PropTypes.object,
  setSelectedValue: PropTypes.func,
  labelKey: PropTypes.string,
  identifier: PropTypes.string,
  placeholder: PropTypes.string,
  initialIndex: PropTypes.number,
  customStyle: PropTypes.object,
  isCountryPicker: PropTypes.bool,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    height: 54,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderColor: colors.transparentBlack,
    borderWidth: 1,
  },

  dropdown: {
    position: 'absolute',
    flex: 1,
    backgroundColor: colors.white,
    borderColor: colors.transparentBlack,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  limitedHeight: {
    height: 150,
  },

  overlay: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  item: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  selected: {
    backgroundColor: colors.borderGray,
  },

  topBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    borderBottomWidth: 0,
  },

  fullBorder: {
    borderRadius: 10,
  },

  lastItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  placeholder: {
    color: colors.inputDescription,
  },
});

export default CustomDropdown;
