import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

import { Platform } from 'react-native';
import { addBase64Prefix } from './base64';

export const onPdfShare = async ({ pdfUrl, pdfBytes, saveToFiles }) => {
  const bytes =
    pdfBytes ||
    (await ReactNativeBlobUtil.fetch('GET', pdfUrl).then(res => res.data));

  const url = addBase64Prefix(bytes);

  try {
    const message = 'PDF Document';
    const baseOptions = {
      type: 'url',
      url: url,
    };

    const shareOptions = saveToFiles
      ? { ...baseOptions, saveToFiles }
      : Platform.select({
          ios: {
            activityItemSources: [
              {
                placeholderItem: {
                  type: 'url',
                  content: url,
                },
                item: {
                  default: {
                    type: 'url',
                    content: url,
                  },
                },
                linkMetadata: {
                  title: message,
                },
              },
            ],
          },
          default: baseOptions,
        });
    await Share.open(shareOptions);
  } catch {}
};
