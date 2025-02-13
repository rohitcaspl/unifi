import CameraButton from '@components/CameraButton';
import useCheckAppState from '@shared/hooks/useCheckAppState';
import colors from '@theme/colors';
import SwitchCamera from '@assets/icons/switch-camera.svg';

import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useMediaContext } from 'context/MediaContext';

const CameraPage = () => {
  // const [cameraPosition, setCameraPosition] = useState('front');
  // const [isCameraInitialized, setIsCameraInitialized] = useState(false);

  // const { setVideo, setSignature } = useMediaContext();

  // const camera = useRef(null);
  // const navigation = useNavigation();
  // const isFocused = useIsFocused();
  // const { isForeground } = useCheckAppState();
  // const isActive = isFocused && isForeground;

  // const isPressingButton = useSharedValue(false);
  // const zoom = useSharedValue(0);

  // // const devices = useCameraDevices();
  // // const device = Array.isArray(devices)
  // //     ? devices.find((d) => d.position === cameraPosition) // Array format
  // //     : devices?.[cameraPosition]; // Object format (old behavior)
  // // useEffect(() => {
  // //   console.log('Available devices:', devices);
  // //   console.log('Selected device:', device);
  // // }, [devices, device]);
  // const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
  // Reanimated.addWhitelistedNativeProps({
  //   zoom: true,
  // });

  // const minZoom = device?.minZoom ?? 1;
  // const maxZoom = Math.min(device?.maxZoom ?? 1, 20);

  // const cameraAnimatedProps = useAnimatedProps(() => {
  //   const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
  //   return {
  //     zoom: z,
  //   };
  // }, [maxZoom, minZoom, zoom]);

  // const supportsCameraFlipping = useMemo(
  //   () => devices.back != null && devices.front != null,
  //   [devices.back, devices.front],
  // );

  // const setIsPressingButton = useCallback(
  //   _isPressingButton => {
  //     isPressingButton.value = _isPressingButton;
  //   },
  //   [isPressingButton],
  // );

  // const onInitialized = useCallback(() => {
  //   setIsCameraInitialized(true);
  // }, []);
  // const onFlipCameraPressed = useCallback(() => {
  //   setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  // }, []);

  // const onDoubleTap = useCallback(() => {
  //   onFlipCameraPressed();
  // }, [onFlipCameraPressed]);

  // const neutralZoom = device?.neutralZoom ?? 1;
  // useEffect(() => {
  //   zoom.value = neutralZoom;
  // }, [neutralZoom, zoom]);

  // const onPinchGesture = useAnimatedGestureHandler({
  //   onStart: (_, context) => {
  //     context.startZoom = zoom.value;
  //   },
  //   onActive: (event, context) => {
  //     const startZoom = context.startZoom ?? 0;
  //     const scale = interpolate(
  //       event.scale,
  //       [1 - 1 / 3, 1, 3],
  //       [-1, 0, 1],
  //       Extrapolate.CLAMP,
  //     );
  //     zoom.value = interpolate(
  //       scale,
  //       [-1, 0, 1],
  //       [minZoom, startZoom, maxZoom],
  //       Extrapolate.CLAMP,
  //     );
  //   },
  // });

  // const onSuccessfulRecording = video => {
  //   setVideo(video);
  //   navigation.goBack();
  // };

  // useEffect(() => {
  //   setSignature();
  // }, [setSignature]);

  return (
    <View style={styles.container}>
      {/* {device ? (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                lowLightBoost={device.supportsLowLightBoost}
                isActive={isActive}
                onInitialized={onInitialized}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                video={true}
                audio={true}
                orientation='portrait'
                preset='vga-640x480'
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      ) : null}

      <CameraButton
        style={styles.captureButton}
        camera={camera}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        enabled={isCameraInitialized}
        setIsPressingButton={setIsPressingButton}
        onSuccessfulRecording={onSuccessfulRecording}
      />

      <View style={styles.buttons}>
        {supportsCameraFlipping ? (
          <Pressable
            style={styles.button}
            onPress={onFlipCameraPressed}
            disabledOpacity={0.4}
          >
            <SwitchCamera />
          </Pressable>
        ) : null}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: colors.black,
  },

  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 32,
  },
  button: {
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: colors.cameraBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    position: 'absolute',
    right: 24,
    bottom: 35,
  },
});

export default CameraPage;
