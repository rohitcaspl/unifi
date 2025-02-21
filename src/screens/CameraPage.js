import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSharedValue } from 'react-native-reanimated';
import { CameraButton } from '@components/CameraButton';

const CameraPage = () => {
  // Use the new hook for camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const cameraZoom = useSharedValue(0);
  const [isPressing, setIsPressing] = useState(false);

  // In the new API, camera type is a simple string ('front' or 'back')
  const cameraType = 'front';

//   useEffect(() => {
//     (async () => {
//       const { status } = await requestPermission();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

  const handleRecordingFinished = (video) => {
    // Handle the finished video (e.g., preview, upload, etc.)
    console.log('Recording finished:', video);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} type={cameraType} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <CameraButton
            camera={cameraRef}
            onSuccessfulRecording={handleRecordingFinished}
            minZoom={0}
            maxZoom={1}
            cameraZoom={cameraZoom}
            enabled={true}
            setIsPressingButton={setIsPressing}
            style={styles.cameraButton}
          />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  cameraButton: { width: 78, height: 78 },
});

export default CameraPage;
