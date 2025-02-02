import { compressImage } from '@shared/helpers';
import { useMediaContext } from 'context/MediaContext';
import { PDFDocument } from 'pdf-lib';
import { useCallback, useState } from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import fontkit from '@pdf-lib/fontkit';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const useSignPdf = () => {
  const [signedPdf, setSignedPdf] = useState();
  const { video } = useMediaContext();

  const signPdf = useCallback(
    async (pdfDoc, pdfData, image, signData) => {
      let signature;
      if (signData.signature !== '') {
        signature = await pdfDoc.embedPng(signData.signature);
      }
      const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
      const fontBytes = await ReactNativeBlobUtil.fetch('GET', url).then(
        res => res.data,
      );
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes);

      pdfData.pdf_fields.map(field => {
        const type = field.type.toLowerCase();
        const fontSize = 12;
        const page = pdfDoc.getPage(field.page - 1);
        const { height } = page.getSize();

        if (type === 'photo') {
          const scaled = image?.scaleToFit(
            field.frame.width,
            field.frame.height,
          );
          page.drawImage(image, {
            x: field.frame.x,
            y: height - field.frame.y - scaled.height,
            width: scaled.width,
            height: scaled.height,
          });
        } else if (type === 'signature') {
          const videOnly = field.settings.video_consent_only;
          if (video || videOnly) {
            page.drawText('Video consent done', {
              size: fontSize,
              x: field.frame.x,
              y: height - field.frame.y,
              height: field.frame.height,
              width: field.frame.width,
              font: font,
            });
          } else
            page.drawImage(signature, {
              x: field.frame.x,
              y: height - field.frame.y,
              height: field.frame.height,
              width: field.frame.width,
            });
        } else
          page.drawText(signData[type] || '', {
            size: fontSize,
            x: field.frame.x,
            y: height - field.frame.y,
            font: font,
          });
      });

      const signedPdfBytes = await pdfDoc.saveAsBase64();

      setSignedPdf(signedPdfBytes);
      if (Platform.OS === 'android') {
        const pdfPath = FileSystem.cacheDirectory + 'file.pdf';

        await FileSystem.writeAsStringAsync(pdfPath, signedPdfBytes, {
          encoding: 'base64',
        });
        return pdfPath;
      }
      return signedPdfBytes;
    },
    [video],
  );

  const handleSignPdf = useCallback(
    async (pdfData, signData) => {
      const pdfBytes = await ReactNativeBlobUtil.fetch('GET', pdfData.url).then(
        res => res.data,
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const resizedImage = await compressImage({
        source: signData.uri,
        width: 400,
        base64: true,
      });

      const image = await pdfDoc.embedJpg(resizedImage?.base64);

      return signPdf(pdfDoc, pdfData, image, signData);
    },
    [signPdf],
  );

  return { handleSignPdf, signedPdf };
};
export default useSignPdf;
