import { manipulateAsync } from 'expo-image-manipulator';

export const compressImage = async ({
  source,
  width,
  height,
  compress = 0.8,
  base64 = false,
}) => {
  try {console.log("Image source:", source);

    const response = await manipulateAsync(
      source,
      [{ resize: { width, height } }],
      {
        compress,
        base64,
      },
    );
    console.log('Image manipulation successful:', response);
    return response;
  } catch (error) {
    console.error('Error during image manipulation:', error);
    return null;
  }
};
