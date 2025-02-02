import PropTypes from 'prop-types';

import colors from '@theme/colors';
import Button from '@components/Button/Button';

import { View, StyleSheet, Image } from 'react-native';

const MediaContainer = ({
  icon: Icon,
  onPress,
  buttonText,
  imageUri,
  isSignature,
}) => {
  const buttonStyle = [
    styles.button,
    imageUri && !isSignature ? styles.retakeBtn : undefined,
    imageUri && isSignature ? styles.signatureRetakeBtn : undefined,
  ];
  const containerStyle = [
    styles.signatureVideoContainer,
    isSignature ? styles.border : !imageUri ? styles.border : undefined,
    isSignature ? styles.landscape : styles.portrait,
  ];
  return (
    <View style={containerStyle}>
      {imageUri ? (
        <Image
          style={[styles.thumbnail, styles.mb]}
          source={{
            uri: imageUri,
          }}
        />
      ) : (
        Icon && <Icon style={styles.mb} />
      )}
      {buttonText ? (
        <Button
          text={buttonText}
          onPress={onPress}
          customStyle={buttonStyle}
          transparent={imageUri && !isSignature}
          customTextStyle={
            imageUri && !isSignature ? styles.btnText : undefined
          }
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  signatureVideoContainer: {
    position: 'relative',
    minHeight: 380,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  portrait: {
    minHeight: 380,
  },

  landscape: {
    minHeight: 200,
  },

  border: {
    borderWidth: 2,
    borderColor: colors.borderGray,
    borderStyle: 'dashed',
  },

  signatureRetakeBtn: {
    width: 85,
    height: 45,
    position: 'absolute',
    bottom: '10%',
  },

  mb: {
    marginBottom: 24,
  },

  button: {
    maxWidth: 145,
    height: 45,
  },

  retakeBtn: {
    position: 'absolute',
    bottom: '-13%',
  },

  btnText: {
    color: colors.orange,
  },

  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

MediaContainer.propTypes = {
  icon: PropTypes.any,
  buttonText: PropTypes.string,
  imageUri: PropTypes.string,
  onPress: PropTypes.func,
  isSignature: PropTypes.bool,
};

export default MediaContainer;
