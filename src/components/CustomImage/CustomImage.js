import PropTypes from 'prop-types';
import { Image as RNImage } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { PLACEHOLDER_AVATAR } from '@shared/constants';

const CustomImage = ({ uri, customStyle }) => {
  return uri ? (
    <Image style={customStyle} uri={uri} />
  ) : (
    <RNImage style={customStyle} source={PLACEHOLDER_AVATAR} />
  );
};

CustomImage.propTypes = {
  uri: PropTypes.string,
  customStyle: PropTypes.object,
};

export default CustomImage;
