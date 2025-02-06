import PropTypes from 'prop-types';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import SpinnerModal from '@components/SpinnerModal';
import colors from '@theme/colors';

import { useNewFaceId } from '@hooks/useFaceId';

import { Alert, Image, StyleSheet, View } from 'react-native';
import { NEW_SIGNATURE_STEPS } from '@shared/constants';
import { formatDate } from '@shared/helpers';
import { useEffect } from 'react';

const SubjectConfirm = ({
  imageData,
  setImageData,
  setCurrentStep,
  subjectMatch,
  setNextTitle,
  setSubjectMatch,
}) => {
  const { mutateAsync: newFaceId, isLoading: isCreatingFaceId } =
    useNewFaceId();

  const handleGenerate = async () => {
    try {
      const faceIDToken = await newFaceId(imageData.image_id);

      setImageData(prev => ({
        ...prev,
        user_id: faceIDToken.user_id,
      }));
      setSubjectMatch({});
      setCurrentStep(NEW_SIGNATURE_STEPS.signeeInfo);
    } catch (err) {
      Alert.alert('Error', err);
    }
  };

  useEffect(() => {
    setNextTitle(NEW_SIGNATURE_STEPS.signeeInfo.title);
  }, [setNextTitle]);

  return (
    <View style={styles.container}>
      <View style={[styles.margin, styles.top]}>
        <CustomText style={styles.title} size={20} bold>
          Is this the same person?
        </CustomText>

        <Image
          resizeMode='cover'
          style={styles.image}
          source={{ uri: subjectMatch?.photo_url }}
        />
        <View style={styles.text}>
          {subjectMatch.last_sign_date ? (
            <View style={[styles.cont, styles.mb]}>
              <CustomText style={styles.info}>Last signed</CustomText>
              <CustomText>
                {formatDate(subjectMatch?.last_sign_date)}
              </CustomText>
            </View>
          ) : null}
          {subjectMatch.name ? (
            <View style={styles.cont}>
              <CustomText style={styles.info}>Full name</CustomText>
              <CustomText numberOfLines={1}>{subjectMatch?.name}</CustomText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.buttons, styles.margin]}>
        <Button
          text='No'
          onPress={() => handleGenerate()}
          secondary
          customStyle={styles.button}
        />
        <Button
          text='Yes'
          onPress={() => {
            setCurrentStep(NEW_SIGNATURE_STEPS.signeeInfo);
          }}
          customStyle={styles.button}
        />
      </View>
      {/* <SpinnerModal visible={isCreatingFaceId} /> */}
    </View>
  );
};

SubjectConfirm.propTypes = {
  imageData: PropTypes.shape({
    uri: PropTypes.string,
    image_id: PropTypes.string,
    user_id: PropTypes.string,
  }),
  subjectMatch: PropTypes.shape({
    user_id: PropTypes.string,
    photo_id: PropTypes.string,
    photo_url: PropTypes.string,
    last_sign_date: PropTypes.string,
    name: PropTypes.string,
  }),
  setImageData: PropTypes.func,
  setCurrentStep: PropTypes.func,
  setNextTitle: PropTypes.func,
  setSubjectMatch: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  title: { marginBottom: 24 },

  cont: {
    backgroundColor: colors.accentGray,
    padding: 12,
    borderRadius: 10,
  },

  info: {
    color: colors.label,
    marginBottom: 4,
  },

  text: {
    justifyContent: 'center',
    marginVertical: 24,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  button: {
    width: '48%',
  },

  mb: {
    marginBottom: 8,
  },

  margin: {
    marginHorizontal: 16,
  },

  top: {
    flex: 1,
  },

  image: {
    flex: 1,
    borderRadius: 20,
  },
});

export default SubjectConfirm;
