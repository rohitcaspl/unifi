import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import useSetNavigationOptions from '@navigation/hooks/useSetNavigationOptions';
import useGetOrientation from '@shared/hooks/useGetOrientation';
import { ORIENTATION } from '@shared/constants';

const Layout = ({
  children,
  title,
  headerRight,
  defaultNav,
  disableBack,
  isLogin,
  customStyle,
  backdrop,
  headerLeftIcon,
  headerLeftStyle,
}) => {
  useSetNavigationOptions({
    title,
    headerRight,
    defaultNav,
    disableBack,
    isLogin,
    backdrop,
    headerLeftIcon,
    headerLeftStyle,
  });
  const orientation = useGetOrientation();

  const layoutStyle = [
    styles.background,
    !isLogin && defaultNav ? styles.smallerOffset : styles.biggerOffset,

    orientation === ORIENTATION.landscape && styles.maxWidth,
    customStyle,
  ];

  return (
    <>
      {isLogin ? (
        <View style={styles.fullHeight}>
          <ImageBackground
            fadeDuration={Platform.OS === 'ios' ? 0 : 500}
            source={require('@assets/background.png')}
            resizeMode='stretch'
          >
            {children}
          </ImageBackground>
        </View>
      ) : (
        <SafeAreaView style={styles.background}>
          <View style={layoutStyle}>{children}</View>
        </SafeAreaView>
      )}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  headerRight: PropTypes.node,
  defaultNav: PropTypes.bool,
  isLogin: PropTypes.bool,
  disableBack: PropTypes.bool,
  backdrop: PropTypes.bool,
  customStyle: PropTypes.object,
  headerLeftIcon: PropTypes.node,
  headerLeftStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  fullHeight: {
    flex: 1,
  },

  maxWidth: {
    maxWidth: '80%',
    alignSelf: 'center',
  },

  biggerOffset: {
    paddingTop: 22,
  },

  smallerOffset: {
    paddingTop: 16,
  },
});

export default Layout;
