import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@assets/icons/arrow-right.svg';

import { View, Pressable, StyleSheet } from 'react-native';

const FormItem = ({ item }) => {
  return (
    <Pressable onPress={item.onPress} style={styles.mbLg}>
      <View style={styles.container}>
        <View>
          <CustomText size={16} bold style={styles.mb}>
            {item.name}
          </CustomText>
          <CustomText style={styles.language}>{item.language}</CustomText>
        </View>
        <ArrowRightIcon />
      </View>
    </Pressable>
  );
};

FormItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  }),
};

const styles = StyleSheet.create({
  container: {
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.formGray,
    padding: 16,
    justifyContent: 'space-between',
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  language: { color: colors.label },

  mb: {
    marginBottom: 10,
  },

  mbLg: {
    marginBottom: 16,
  },
});

export default FormItem;
