import SlidingUpPanel from 'rn-sliding-up-panel';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import colors from '@theme/colors';
import CameraIcon from '@assets/icons/take-photo.svg';
import GalleryIcon from '@assets/icons/gallery.svg';
import CustomText from '@components/CustomText';

import usePhotosPermission from '@shared/hooks/usePhotosPermission';
import useCameraPermission from '@shared/hooks/useCameraPermission';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PLACEHOLDER from '@assets/placeholder.png';
import {
  BOTTOM_POINT,
  TOP_POINT_WITHOUT_DELETE,
  TOP_POINT_WITH_DELETE,
} from './constats';

const UploadImageModal = ({
  setIsOpen,
  isOpen,
  setImageData,
  imageData,
  hasDelete,
}) => {
  const sheetRef = useRef(null);
  const modalStyle = [
    styles.modal,
    {
      height: hasDelete ? 250 : 200,
    },
  ];

  const [clicked, setClicked] = useState(false);

  const { isGalleryGranted, checkGalleryPermission } = usePhotosPermission();
  const { isCameraGranted, checkCameraPermission } = useCameraPermission();

  const handleLaunchCamera = useCallback(
    isGranted => {
      if (isGranted) {
        launchCamera({ cameraType: 'front' }).then(
          response => response.assets && setImageData(response.assets[0]),
        );
      }
    },
    [setImageData],
  );

  const handleLaunchGallery = useCallback(
    isGranted => {
      if (isGranted) {
        launchImageLibrary().then(
          response => response.assets && setImageData(response.assets[0]),
        );
      }
    },
    [setImageData],
  );

  useEffect(() => {
    if (isOpen) {
      sheetRef?.current?.show();
    } else {
      sheetRef?.current?.hide();
    }
  }, [isOpen]);

  useEffect(() => {
    if (imageData) {
      setIsOpen(false);
    }
  }, [setIsOpen, imageData]);

  useEffect(() => {
    handleLaunchGallery(isGalleryGranted);
  }, [isGalleryGranted, handleLaunchGallery]);

  useEffect(() => {
    handleLaunchCamera(isCameraGranted);
  }, [isCameraGranted, handleLaunchCamera]);

  useEffect(() => {
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  }, [clicked]);

  const openImageGallery = () => {
    checkGalleryPermission();
    handleLaunchGallery(isGalleryGranted);
    setClicked(true);
  };

  const openCamera = () => {
    checkCameraPermission();
    handleLaunchCamera(isCameraGranted);
    setClicked(true);
  };

  return (
    <>
      {isOpen ? (
        <Pressable onPress={() => setIsOpen(false)} style={styles.backdrop} />
      ) : null}
      <View style={styles.modalContainer}>
        <SlidingUpPanel
          draggableRange={{
            top: hasDelete ? TOP_POINT_WITH_DELETE : TOP_POINT_WITHOUT_DELETE,
            bottom: BOTTOM_POINT,
          }}
          snappingPoints={[BOTTOM_POINT, 180]}
          showBackdrop={false}
          ref={sheetRef}
          onBottomReached={() => setIsOpen(false)}
        >
          <View style={modalStyle}>
            <View style={styles.line} />
            <View style={styles.modalItems}>
              <TouchableOpacity
                disabled={clicked}
                onPress={openCamera}
                style={[styles.modalItem, styles.borderTop]}
              >
                <CameraIcon />
                <CustomText style={styles.text} bold textAlign='center'>
                  Take a photo
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={clicked}
                onPress={openImageGallery}
                style={[
                  styles.modalItem,
                  styles.borderTop,
                  styles.borderBottom,
                ]}
              >
                <GalleryIcon />
                <CustomText style={styles.text} bold textAlign='center'>
                  Choose from gallery
                </CustomText>
              </TouchableOpacity>
              {hasDelete ? (
                <TouchableOpacity
                  style={[styles.modalItem, styles.borderBottom]}
                  onPress={() =>
                    setImageData({
                      ...Image.resolveAssetSource(PLACEHOLDER),
                      fileName: 'default_image',
                    })
                  }
                >
                  <CustomText bold style={styles.deleteText}>
                    Delete
                  </CustomText>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </SlidingUpPanel>
      </View>
    </>
  );
};

UploadImageModal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setImageData: PropTypes.func.isRequired,
  imageData: PropTypes.shape({
    uri: PropTypes.string,
    fileName: PropTypes.string,
    type: PropTypes.string,
    base64: PropTypes.string,
  }),
  hasDelete: PropTypes.bool,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 0,
    zIndex: 2,
    top: Platform.OS === 'ios' ? 12 : 2,
  },

  backdrop: {
    height: Dimensions.get('window').height + Constants.statusBarHeight,
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: colors.transparentBlack,
  },

  modal: {
    backgroundColor: colors.white,
    borderRadius: 10,
  },

  line: {
    alignSelf: 'center',
    height: 4,
    width: 120,
    backgroundColor: colors.text,
    marginVertical: 16,
    borderRadius: 50,
  },

  modalItems: {
    flex: 1,
  },

  modalItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,

    padding: 16,

    borderColor: colors.selectedGray,
  },

  text: {
    marginLeft: 16,
  },

  deleteText: {
    color: colors.error,
  },

  borderTop: {
    borderTopWidth: 1,
  },

  borderBottom: {
    borderBottomWidth: 1,
  },
});

export default UploadImageModal;
