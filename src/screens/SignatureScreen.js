import Signature from 'react-native-signature-canvas';
import PropTypes from 'prop-types';
import CustomText from '@components/CustomText';

import Button from '@components/Button/Button';

import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useMediaContext } from 'context/MediaContext';
import { useNavigation } from '@react-navigation/native';

const SignatureScreen = () => {
  const [isClear, setIsClear] = useState(true);

  const ref = useRef();
  const navigation = useNavigation();

  const { signature, setSignature, setVideo } = useMediaContext();

  useEffect(() => {
    setSignature();
    setVideo();
  }, [setSignature, setVideo]);

  const handleClear = () => {
    ref.current.clearSignature();
    ref.current.readSignature();
    setIsClear(true);
  };

  const handleEnd = () => {
    ref.current.readSignature();
    setIsClear(false);
  };

  const signatureStyle = `
    .m-signature-pad {
      max-height: 300;
      border: none;
    }

    .m-signature-pad--footer {
      display: none;
    }

    @media screen and (min-device-width: 768px) and (max-device-width: 1024px) {
      .m-signature-pad {
        margin: 0;
      }
    }
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.text}>
        <CustomText bold size={20}>
          Sign here
        </CustomText>
      </View>

      <Signature
        ref={ref}
        onOK={value => setSignature(value)}
        onEnd={handleEnd}
        webStyle={signatureStyle}
        trimWhitespace={true}
      />

      <View style={styles.wrapper}>
        {!isClear ? (
          <Button
            text='Clear'
            transparent={true}
            onPress={handleClear}
            customStyle={styles.button}
          />
        ) : null}

        <View style={styles.buttons}>
          <Button
            text='Cancel'
            secondary={true}
            onPress={() => navigation.goBack()}
            customStyle={styles.button}
          />
          <Button
            text='Apply'
            onPress={() => navigation.goBack()}
            customStyle={styles.button}
            disabled={!signature}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    height: '95%',
    paddingHorizontal: 70,
  },

  wrapper: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'flex-end',
  },

  text: {
    width: '100%',
    textAlign: 'left',
    marginBottom: 20,
  },

  buttons: { flexDirection: 'row', justifyContent: 'space-between' },

  button: {
    width: 94,
    marginRight: 8,
  },
});

SignatureScreen.propTypes = {
  setSignature: PropTypes.func,
  setIsScrollDisabled: PropTypes.func,
};

export default SignatureScreen;
