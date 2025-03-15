import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import CustomText from '@components/CustomText';
import Button from '@components/Button/Button';
import { useNavigation } from '@react-navigation/native';

import { addBase64Prefix } from '@shared/helpers/base64';
import colors from '@theme/colors';
import Check from '@assets/icons/check-filled.svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import { onPdfShare } from '@shared/helpers';
import Layout from '@components/Layout';
import { BackHandler } from "react-native";
const SuccessModal = ({ route }) => {
  const { signedPdf } = route.params;
  const navigation = useNavigation();

  const [counter, setCounter] = useState(10);
  useEffect(() => {
    const backAction = () => true; // Return true to prevent back action
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  
    return () => backHandler.remove(); // Cleanup on unmount
  }, []);
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 50);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <Layout>
      <View style={styles.centeredView}>
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}>
            <Check />
          </View>
          <CustomText bold size={16} style={styles.mb}>
            Doc Completed!
          </CustomText>

          <Button
            text='Share doc'
            secondary
            onPress={() => onPdfShare({ pdfBytes: signedPdf })}
            textSize={12}
            customStyle={styles.button}
          />
        </View>
        <View style={styles.bottomActions}>
          <Button
            text='Preview'
            disabled={false}
            secondary
            customStyle={styles.preview}
            onPress={() => {
              navigation.navigate('PdfViewer', {
                pdf: addBase64Prefix(signedPdf),
                pdfBytes: signedPdf,
              });
            }}
          />
          <Button
            text='Return to Doc Space'
            disabled={false}
            onPress={() => navigation.navigate('TabNavigator')}
          />
        </View>
      </View>
      <View style={{ opacity: counter / 10 }}>
        <ConfettiCannon
          count={50}
          autoStart
          fadeOut
          explosionSpeed={300}
          origin={{ x: 0, y: 0 }}
        />
      </View>
    </Layout>
  );
};

SuccessModal.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      signedPdf: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 38,
    paddingHorizontal: 16,
  },

  centerContent: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 16,
    borderColor: colors.backgroundDarkGray,
    borderWidth: 1,
    padding: 32,
    alignSelf: 'center',
    maxWidth: 270,
  },

  checkCircle: {
    backgroundColor: colors.green,
    width: 105,
    height: 105,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    maxWidth: 68,
    minWidth: 100,
  },

  preview: {
    marginBottom: 8,
  },

  bottomActions: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 16,
  },

  mb: {
    marginBottom: 16,
  },
});

export default SuccessModal;
