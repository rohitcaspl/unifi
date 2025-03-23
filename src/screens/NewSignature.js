import PropTypes from 'prop-types';
import EnterMobileAndEmail from '@features/signature/newSignature/EnterMobileAndEmail';
import VerifySignee from '@features/signature/newSignature/VerifySignee';
import UploadPhoto from '@features/signature/newSignature/UploadPhoto';
import SigneeInformation from '@features/signature/newSignature/SigneeInformation';
import Layout from '@components/Layout';
import UploadImageModal from '@components/UploadImageModal';
import SubjectConfirm from '@features/signature/newSignature/SubjectConfirm';
import StepCounter from '@components/StepCounter';

import { NEW_SIGNATURE_STEPS } from '@shared/constants';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useMediaContext } from 'context/MediaContext';
import { FormProvider, useForm } from 'react-hook-form';

const NewSignature = ({ route }) => {

  const [currentStep, setCurrentStep] = useState(
    NEW_SIGNATURE_STEPS.mobileAndEmail,
  );
  const [sessionId, setSessionId] = useState('');
  const [onlyVideoConsent, setOnlyVideoConsent] = useState(false);
  const [imageData, setImageData] = useState({});
  const [isUploadImageModalOpen, setIsUploadImageOpen] = useState(false);
  const [subjectMatch, setSubjectMatch] = useState({});
  const [nextTitle, setNextTitle] = useState('');

  const { pdfData } = route.params;

  const handleSetImageData = useCallback(value => {
    setImageData(value);
  }, []);

  const { setVideo, setSignature } = useMediaContext();

  useEffect(() => {
    setVideo();
    setSignature();
  }, [setVideo, setSignature]);

  const formMethods = useForm({ mode: 'onTouched' });

  return (
    <Layout backdrop={isUploadImageModalOpen} title={'Signee details'}>
      <View style={styles.wrapper}>
        <FormProvider {...formMethods}>
          {currentStep.id !== NEW_SIGNATURE_STEPS.confirm.id ? (
            <StepCounter
              title={currentStep?.title}
              nextTitle={nextTitle}
              step={currentStep.step}
            />
          ) : null}

          {currentStep.id === NEW_SIGNATURE_STEPS.mobileAndEmail.id ? (
            <EnterMobileAndEmail
              setCurrentStep={setCurrentStep}
              setSessionId={setSessionId}
              setNextTitle={setNextTitle}
            />
          ) : null}
          {currentStep.id === NEW_SIGNATURE_STEPS.verify.id ? (
            <VerifySignee
              setCurrentStep={setCurrentStep}
              session_id={sessionId}
              setOnlyVideoConsent={setOnlyVideoConsent}
              setNextTitle={setNextTitle}
            />
          ) : null}
          {currentStep.id === NEW_SIGNATURE_STEPS.photo.id ? (
            <UploadPhoto
              setCurrentStep={setCurrentStep}
              setImageData={handleSetImageData}
              imageData={imageData}
              setIsOpen={setIsUploadImageOpen}
              setSubjectMatch={setSubjectMatch}
              setNextTitle={setNextTitle}
            />
          ) : null}
          {currentStep.id === NEW_SIGNATURE_STEPS.confirm.id ? (
            <SubjectConfirm
              setCurrentStep={setCurrentStep}
              imageData={imageData}
              setImageData={setImageData}
              subjectMatch={subjectMatch}
              setNextTitle={setNextTitle}
              setSubjectMatch={setSubjectMatch}
            />
          ) : null}
          {currentStep.id === NEW_SIGNATURE_STEPS.signeeInfo.id ? (
            <SigneeInformation
              setCurrentStep={setCurrentStep}
              imageData={imageData}
              onlyVideoConsent={onlyVideoConsent}
              subjectMatch={subjectMatch}
              pdfData={pdfData}
              setNextTitle={setNextTitle}
            />
          ) : null}
        </FormProvider>
      </View>

      <UploadImageModal
        isOpen={isUploadImageModalOpen}
        includeBase64
        setIsOpen={setIsUploadImageOpen}
        setImageData={setImageData}
        imageData={imageData}
      />
    </Layout>
  );
};

NewSignature.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      pdfData: PropTypes.shape({
        subjects: PropTypes.array,
        url: PropTypes.string,
        form_id: PropTypes.string,
        project_id: PropTypes.string,
        first_signed_url: PropTypes.string,      // Send the first signed_doc_url
        consentee_name_arr :PropTypes.array,
      }),
    }),
  }),
};

const styles = StyleSheet.create({
  wrapper: {
    height: Platform.OS === 'ios' ? '100%' : '95%',
  },

  text: {
    marginTop: 48,
  },
});

export default NewSignature;
