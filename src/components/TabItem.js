import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { StyleSheet, Pressable } from 'react-native';

import CustomText from './CustomText';

const TabItem = ({ item, name, isClicked, onChange }) => {
  const handleClick = () => {
    onChange(item);
  };

  return (
    <Pressable
      style={[isClicked && styles.clicked, styles.container]}
      onPress={handleClick}
    >
      <CustomText style={[isClicked ? styles.clickedText : styles.text]}>
        {name}
      </CustomText>
    </Pressable>
  );
};

TabItem.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func,
  isClicked: PropTypes.bool,
  name: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  clicked: {
    backgroundColor: colors.white,
  },

  text: {
    color: colors.black,
  },

  clickedText: {
    color: colors.orange,
  },
});

export default TabItem;
