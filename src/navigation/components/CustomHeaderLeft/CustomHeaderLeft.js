import PropTypes from 'prop-types';

import colors from '@theme/colors';
import HeaderBackIcon from '@assets/icons/headerBack.svg';
import CustomText from '@components/CustomText';

import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import useGetOrientation from '@shared/hooks/useGetOrientation';
import { ORIENTATION } from '@shared/constants';

const CustomHeaderLeft = ({
  children,
  customStyle,
  disableBack,
  headerLeftIcon,
}) => {
  const nav = useNavigation();
  const orientation = useGetOrientation();
  return (
    <View
      style={[
        styles.headerLeftContainer,
        orientation === ORIENTATION.portrait && styles.limitContainer,
        customStyle,
      ]}
    >
      <Pressable
        style={styles.backButton}
        onPress={() => (disableBack ? null : nav.goBack())}
      >
        {headerLeftIcon ? headerLeftIcon : <HeaderBackIcon />}
      </Pressable>
      <CustomText
        size={16}
        bold
        style={{
          ...styles.title,
          ...(orientation === ORIENTATION.portrait && { flex: 1 }),
        }}
        numOfLines={1}
      >
        {children}
      </CustomText>
    </View>
  );
};

CustomHeaderLeft.propTypes = {
  children: PropTypes.node,
  customStyle: PropTypes.object,
  disableBack: PropTypes.bool,
  headerLeftIcon: PropTypes.node,
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  limitContainer: {
    width: Dimensions.get('window').width * 0.7,
  },

  backButton: {
    zIndex: 3,
    padding: 12,
    paddingRight: 16,
    marginLeft: -12,
  },

  title: {
    color: colors.text,
  },
});

export default CustomHeaderLeft;
