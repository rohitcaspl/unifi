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
    async (pdfDoc, pdfData, image, signData, signature,loca,selectsu) => {
      const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
      const fontBytes = await ReactNativeBlobUtil.fetch('GET', url).then(
        res => res.data
      );
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes);
  console.log('adfData',pdfData);
  console.log('signdta',signData);
  let filteredSubjects;
  if (signData.formType === 'multiple_subject') {
    filteredSubjects = pdfData.subjects.filter(subject => subject.title === selectsu);
  } else {
    filteredSubjects = pdfData.subjects;
  }
      for (const subject of filteredSubjects) {
        for (const field of subject.pdf_fields) {
          const type = field.type.toLowerCase();
          const fontSize = 12;
          const page = pdfDoc.getPage(field.page - 1);
          const { height } = page.getSize();
  
          switch (type) {
            case 'photo': {
              const scaled = image?.scaleToFit(field.frame.width, field.frame.height);
              page.drawImage(image, {
                x: field.frame.x,
                y: height - field.frame.y - scaled.height,
                width: scaled.width,
                height: scaled.height,
              });
              break;
            }
            case 'signature': {
        
  
              if (signature) {
                try {
                  const signatureImage = await pdfDoc.embedPng(signature);
                  page.drawImage(signatureImage, {
                    x: field.frame.x,
                    y: height - field.frame.y,
                    height: field.frame.height,
                    width: field.frame.width,
                  });
                } catch (err) {
                  console.error('Error embedding signature:', err);
                  page.drawText('Signature Error', {
                    size: fontSize,
                    x: field.frame.x,
                    y: height - field.frame.y,
                    font: font,
                  });
                }
              } else if (signData.users[0].signature_type === 'video') {
                page.drawText('Video consent done', {
                  size: fontSize,
                  x: field.frame.x,
                  y: height - field.frame.y,
                  font: font,
                });
              }
              break;
            }
            case 'name': {
              let nameValue = '';
              const nameData = signData.users[0].name;
              if (typeof nameData === 'string') {
                // Directly use the string if no formats
                nameValue = nameData;
              } else {
                // Handle object with formats
                const hasFormats = field.formats && (
                  field.formats.first_name || 
                  field.formats.middle_name || 
                  field.formats.last_name
                );
            
                if (hasFormats) {
                  if (field.formats.first_name) {
                    nameValue = nameData.firstName || '';
                  } else if (field.formats.middle_name) {
                    nameValue = nameData.middleName || '';
                  } else if (field.formats.last_name) {
                    nameValue = nameData.lastName || '';
                  }
                } else {
                  // Fallback if formats exist but none are matched (shouldn't happen)
                  nameValue = '';
                }
              }
              page.drawText(nameValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            }
            case 'text': {
              const textValue = signData.users[0].text[field.name] || '';
              page.drawText(textValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            
            }
            case 'phone': {
              const phoneValue = signData.users[0].phone_number || '';
              page.drawText(phoneValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            }
            case 'email': {
              const emailValue = signData.users[0].email || '';
              page.drawText(emailValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            }
            case 'location': {
              const locationValue = loca || '';
              page.drawText(locationValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            }
            case 'date': {
              const dateValue = new Date(signData.users[0].date).toLocaleDateString() || '';
              page.drawText(dateValue, {
                size: fontSize,
                x: field.frame.x,
                y: height - field.frame.y,
                font: font,
              });
              break;
            }
            default:
              break;
          }
        }
      }
  
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
    [video]
  );
  

  const handleSignPdf = useCallback(
    async (pdfData, signData, uri, signature,loca,selectedsub) => {
      console.log('pdfData invel',pdfData);
      const urlToFetch = pdfData.form_type === 'multiple_subject' 
      ? (pdfData.first_signed_url || pdfData.url)
      : pdfData.url;

      const pdfBytes = await ReactNativeBlobUtil.fetch('GET', urlToFetch).then(
        res => res.data
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      const resizedImage = await compressImage({
        source: uri,
        width: 400,
        base64: true,
      });
      
      const image = await pdfDoc.embedJpg(resizedImage?.base64);
      
      return signPdf(pdfDoc, pdfData, image, signData, signature,loca,selectedsub);
    },
    [signPdf]
  );

  return { handleSignPdf, signedPdf };
};
export default useSignPdf;