import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

import Constants from 'expo-constants';
import colors from '@theme/colors';
import Button from '@components/Button/Button';
import { onPdfShare } from '@shared/helpers';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ShareIcon from '@assets/icons/share.svg';

const PdfViewer = ({ route }) => {
  const { pdf, pdfBytes } = route.params;
  const navigation = useNavigation();
  const source = {
    uri: pdf,
    cache: true,
  };

  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.wrapper}>
      <Pdf
        source={source}
        style={styles.pdf}
        renderActivityIndicator={() => (
          <ActivityIndicator size='large' color={colors.orange} />
        )}
        trustAllCerts={Platform.OS !== 'android'}
      />

      <View style={styles.buttonsContainer(bottom)}>
        <Button
          text={'Close'}
          secondary
          onPress={() => navigation.goBack()}
          customStyle={styles.closeButtonContainer}
        />
        <View style={styles.widthSpacer} />
        <Button
          icon={<ShareIcon />}
          onPress={() => {
            onPdfShare({ pdfUrl: pdf, pdfBytes: pdfBytes });
          }}
          customStyle={styles.shareButtonContainer}
        />
      </View>
    </View>
  );
};

export default PdfViewer;

PdfViewer.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      pdf: PropTypes.string,
      pdfBytes: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    right: 0,
    padding: 36,
  },

  landscapeButton: {
    right: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,
    top: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
    paddingTop: Platform.OS === 'ios' ? 16 : 0,
  },

  iconContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.black,
    textAlign: 'center',
    backgroundColor: colors.yellow,
  },

  pdf: {
    flex: 1,
    zIndex: -1,
    padding: 16,
    paddingTop: Constants.statusBarHeight + 16,
    backgroundColor: colors.backgroundGray,
  },
  iconStyle: { color: colors.black },
  buttonsContainer: bottom => {
    return {
      flexDirection: 'row',
      paddingBottom: bottom + 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    };
  },
  closeButtonContainer: {
    flex: 9,
  },
  shareButtonContainer: {
    flex: 1,
  },
  widthSpacer: {
    width: 8,
  },
});
