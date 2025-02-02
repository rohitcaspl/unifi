import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { View, StyleSheet } from 'react-native';

const StepCounter = ({ title, nextTitle, step }) => {
  return (
    <View style={styles.container}>
      <View style={styles.step}>
        <CustomText size={14} bold>
          {step} of 4
        </CustomText>
      </View>

      <View style={styles.textContainer}>
        <CustomText bold size={20}>
          {title}
        </CustomText>
        {nextTitle ? (
          <CustomText size={14} style={styles.nextTitle}>
            Next: {nextTitle}
          </CustomText>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  step: {
    marginRight: 16,
    padding: 16,
    backgroundColor: colors.formGray,
    borderRadius: 8,
  },

  textContainer: {
    justifyContent: 'space-between',
  },

  nextTitle: {
    colors: colors.label,
  },
});

StepCounter.propTypes = {
  title: PropTypes.string,
  nextTitle: PropTypes.string,
  step: PropTypes.number,
};

export default StepCounter;
