/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
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
      if (signData.users[0].signature_type === 'image' && signData.users[0].signature) {
        signature = await pdfDoc.embedPng(signData.users[0].signature);
      }
  
      const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
      const fontBytes = await ReactNativeBlobUtil.fetch('GET', url).then(
        res => res.data,
      );
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes);
  
      pdfData.subjects.forEach(subject => {
        subject.pdf_fields.forEach(field => {
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
            const videoOnly = field.settings.video_consent_only;
            if (signData.users[0].signature_type === 'video' || videoOnly) {
              page.drawText('Video consent done', {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                height: field.frame.height,
                width: field.frame.width,
                font: font,
              });
            } else if (signature) {
              page.drawImage(signature, {
                x: field.frame.x,
                y: height - field.frame.y,
                height: field.frame.height,
                width: field.frame.width,
              });
            }
          } else if (type === 'name' || type === 'text') {
            const value = signData.users[0][type][field.name] || '';
            page.drawText(value, {
              size: fontSize,
              x: field.frame.x,
              y: height - field.frame.y,
              font: font,
            });
          } else if (type === 'phone') {
            const value = signData.users[0].phone || '';
            page.drawText(value, {
              size: fontSize,
              x: field.frame.x,
              y: height - field.frame.y,
              font: font,
            });
          }
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
    async (pdfData, signData,urii) => {
      const pdfBytes = await ReactNativeBlobUtil.fetch('GET', pdfData.url).then(
        res => res.data,
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log("if",signData.uri);
console.log("else",urii);
      const resizedImage = await compressImage({
        source:urii,
        width: 400,
        base64: true,
      });
console.log('pdfData',pdfData);
console.log('signData',signData);

      const image = await pdfDoc.embedJpg(resizedImage?.base64);

      return signPdf(pdfDoc, pdfData, image, signData);
    },
    [signPdf],
  );

  return { handleSignPdf, signedPdf };
};
export default useSignPdf;
