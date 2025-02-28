/* eslint-disable jsx-quotes */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import CloseIcon from '@assets/icons/close.svg';
import SortIcon from '@assets/icons/sort.svg';
import Button from '@components/Button/Button';
import CustomModalDropdown from '@components/CustomModalDropdown';
import CustomText from '@components/CustomText';
import FormSignatureCard from '@components/FormSignatureCard';
import Layout from '@components/Layout';
import ModalComponent from '@components/ModalComponent';
import Signatures from '@components/Signatures';
import useGenerateCode from '@hooks/useGenerateCode';
import { useWorkspaceContext } from 'context/WorkspaceContext';
import CustomHeaderRight from '@navigation/components/CustomHeaderRight';
import Clipboard from '@react-native-clipboard/clipboard';
import onLinkShare from '@shared/helpers/onLinkShare';
import colors from '@theme/colors';
import PropTypes from 'prop-types';
import { getFormDetails } from '@api/legacyApi/form';

import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { SIGNATURE_SORT_OPTIONS } from '@shared/constants';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

import * as Sentry from '@sentry/react-native';

const FormDetails = ({ route }) => {
  const { selectedWorkspace } = useWorkspaceContext();
  const [openModal, setOpenModal] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [link, setLink] = useState('');
  const [formDetails, setFormDetails] = useState(null);
  const [signatureCount, setSignatureCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [signatureSort, setSignatureSort] = useState(
    SIGNATURE_SORT_OPTIONS[0].value,
  );

  const { form, projectId } = route.params;
  const { isConnected } = useNetInfo();

  const toast = useToast();

  const navigation = useNavigation();

  const { bottom } = useSafeAreaInsets();

  const FooterComponent = () => (
    <View
      style={
        !bottom
          ? styles.noSafeAreaFooterComponent
          : styles.safeAreaFooterComponent
      }
    />
  );

  const filterData = { form: form, project: { _id: projectId } };
  useEffect(() => {
    const fetchFormDetails = async () => {

      setIsLoading(true);
      try {
      

        const response = await getFormDetails({
          formId: route.params.form._id,
          tenant: selectedWorkspace.tenant,
        });
  
        setFormDetails(response.data); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching form details:', error);
        Sentry.captureException(error);
        Alert.alert('Error', 'There was an issue fetching the form details.');
      } 
    };

    fetchFormDetails();
  }, [route.params?.form?._id, selectedWorkspace?.tenant]);
  const onPreviewPress = () => {
    navigation.navigate('PdfViewer', {
      pdf: form.url,
    });
  };

  const { mutateAsync: generateCode, isLoading: isGenerating } =
    useGenerateCode({
      onSuccess: res => {
        setLink(res.url);
        setIsLinkModalOpen(true);
      },
      onError: err => {
        Sentry.captureException(err);
        Alert.alert('Error', 'There has been an error generating your link');
      },
    });

  const onCopy = () => {
    setIsLinkModalOpen(false);
    Clipboard.setString(link);
    toast.show('Copied.', {
      type: 'success',
      animationDuration: 100,
      duration: 2000,
    });
  };

  return (
    <Layout
      title={form.form_name}
      headerRight={
        <CustomHeaderRight
          disabled={!isConnected}
          onPress={onPreviewPress}
          customStyle={styles.headerRightContainer}
        >
          <CustomText size={16} bold style={styles.headerRight}>
            Preview
          </CustomText>
        </CustomHeaderRight>
      }
    >
      <View style={styles.container}>
        <Signatures
          headerComponent={
            <>
              <View style={styles.wrapper}>
                <View style={styles.cont}>
                  <CustomText style={styles.subtitle}>Language</CustomText>
                  <CustomText size={16}>{form.language}</CustomText>
                </View>
                <View style={styles.cont}>
                  <CustomText style={styles.subtitle}>Consents</CustomText>
                  <CustomText size={16}>{signatureCount}</CustomText>
                </View>
              </View>
              <View style={styles.wrapper}>
                <CustomText bold>Consents</CustomText>
                <CustomModalDropdown
                  icon={SortIcon}
                  options={SIGNATURE_SORT_OPTIONS}
                  onSelect={value => setSignatureSort(value)}
                  selected={signatureSort}
                />
              </View>
            </>
          }
          filterData={filterData}
          sort={signatureSort}
          setSignatureCount={setSignatureCount}
          renderItem={FormSignatureCard}
          footerComponent={<FooterComponent />}
        />

        <View
          style={[
            styles.buttonContainer,
            !bottom
              ? styles.noSafeAreaButtonBottom
              : styles.safeAreaButtonBottom,
          ]}
        >
          <Button
            text='Start Doc'
            onPress={() => {
              setOpenModal(true);
            }}
            customStyle={styles.topButton}
          />
          <Button
            text='Generate a link'
            secondary
            disabled={isGenerating}
            onPress={() => {
              toast.show(
                <ActivityIndicator size='large' color={colors.orange} />,
                {
                  type: 'info',
                  duration: 1000,
                  style: {
                    backgroundColor: 'transparent',
                  },
                },
              );
              generateCode({ form_id: form._id, project_id: projectId });
            }}
          />
        </View>
      </View>

      <ModalComponent
        title='Data Storage Alert'
        topText={`Signee's contact details are required to complete this form`}
        bottomText='Their information will not be stored on
this device.'
        primaryButtonText='Continue'
        isOpen={openModal}
        setIsOpen={setOpenModal}
        onPrimaryPress={() => {
          navigation.navigate('NewSignature', {
            pdfData: {
              ...formDetails,
              url: formDetails?.url, // Make sure to pass the relevant PDF data
              form_id: formDetails?._id,
              form_name: formDetails?.form_name,
              project_id: projectId,
            },
          });
          setOpenModal(false);
        }}
      />
      <ModalComponent
        title='One-time link'
        topText={link}
        bottomText='This link will expire in 24 hours'
        primaryButtonText={'Copy'}
        secondaryButtonText='Share'
        isOpen={isLinkModalOpen}
        setIsOpen={setIsLinkModalOpen}
        onPrimaryPress={onCopy}
        onSecondaryPress={() =>
          onLinkShare(link, () => setIsLinkModalOpen(false))
        }
        icon={<CloseIcon color='black' />}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    paddingBottom: 10,
  },

  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },

  cont: {
    backgroundColor: colors.accentGray,
    borderRadius: 12,
    width: '48%',
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  subtitle: {
    color: colors.label,
    marginBottom: 4,
  },

  headerRight: {
    color: colors.orange,
  },

  title: { marginBottom: 18 },

  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },

  safeAreaButtonBottom: {
    bottom: 25,
  },
  noSafeAreaButtonBottom: {
    bottom: 50,
  },
  safeAreaFooterComponent: {
    height: 50,
  },
  noSafeAreaFooterComponent: {
    height: 80,
  },
  headerRightContainer: {
    padding: 12,
    paddingHorizontal: 16,
    marginHorizontal: -16,
  },
  topButton: {
    marginBottom: 8,
  },
});

export default FormDetails;

FormDetails.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      form: PropTypes.object.isRequired,
      projectId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
