import PropTypes from 'prop-types';
import CustomText from '@components/CustomText';
import colors from '@theme/colors';

import { Pressable, StyleSheet, Modal, View, FlatList } from 'react-native';
import { useRef, useState } from 'react';

const CustomModalDropdown = ({
  icon: Icon,
  label,
  options,
  onSelect,
  selected,
}) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);

  const DropdownButton = useRef();

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = item => {
    onSelect(item);
    setVisible(false);
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <Modal
          visible={visible}
          transparent
          animationType='none'
          statusBarTranslucent
        >
          <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
            <View style={[styles.dropdown, { top: dropdownTop }]}>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={item => item.value.toString()}
              />
            </View>
          </Pressable>
        </Modal>
      );
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.item, selected === item.value ? styles.selected : '']}
      onPress={() => onItemPress(item.value)}
    >
      {item.icon ? (
        <View style={styles.wrapper}>
          <item.icon style={styles.itemIcon} />
          <CustomText>{item.label}</CustomText>
        </View>
      ) : (
        <CustomText>{item.label}</CustomText>
      )}
    </Pressable>
  );
  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={toggleDropdown}
        ref={DropdownButton}
      >
        {renderDropdown()}
        {Icon ? <Icon /> : <CustomText>{label}</CustomText>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 5,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    right: -8,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.white,
    width: '40%',
    right: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.selectedGray,
    paddingVertical: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selected: {
    backgroundColor: colors.selectedGray,
    borderRadius: 6,
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  overlay: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 8,
    color: colors.text,
  },
});

CustomModalDropdown.propTypes = {
  icon: PropTypes.any,
  label: PropTypes.string,
  options: PropTypes.array,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

export default CustomModalDropdown;
