import PropTypes from 'prop-types';
import colors from '@theme/colors';
import Layout from '@components/Layout';
import CustomText from '@components/CustomText';
import { View, StyleSheet, Dimensions } from 'react-native';
import { onPdfShare } from '@shared/helpers';
import Button from '@components/Button/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeaderRight from '@navigation/components/CustomHeaderRight';
import { useNetInfo } from '@react-native-community/netinfo';
import { formatDate } from '@shared/helpers/formatDate';
import SignatureDetailsItem from '@components/SignatureDetailsItem';
import { useNavigation } from '@react-navigation/native';
import CustomImage from '@components/CustomImage';

const screenWidth = Dimensions.get('window').width;
const imageDimension = screenWidth * 0.15;

const SignatureDetails = ({ route }) => {
  const { signature } = route.params;
  console.log("previuew", signature);
  const { bottom } = useSafeAreaInsets();

  const { isConnected } = useNetInfo();
  const navigation = useNavigation();

  const onPreviewPress = () => {
    navigation.navigate('PdfViewer', {
      pdf: signature.signed_doc_url,
    });
  };

  return (
    <Layout
      title={signature.form_name}
      headerRight={
        <CustomHeaderRight
          disabled={!isConnected}
          onPress={onPreviewPress}
          customStyle={styles.headerRightContainer}
        >
          <CustomText size={16} bold style={styles.headerRightText}>
            Preview
          </CustomText>
        </CustomHeaderRight>
      }
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={[styles.agentContainer, styles.mbLarge]}>
            <CustomImage
              uri={signature?.photo_url}
              customStyle={styles.image}
            />
            <View style={styles.agentData}>
              <CustomText size={16} bold>
                {signature.name}
              </CustomText>
            </View>
          </View>
          <View style={styles.mb}>
            <SignatureDetailsItem
              value={formatDate(new Date(signature.date))}
              placeholder={'Completed date'}
            />
          </View>
          <View style={styles.mb}>
            <SignatureDetailsItem
              value={signature.name}
              placeholder={'Doc manager'}
            />
          </View>
          <View style={styles.mb}>
            <SignatureDetailsItem
              value={signature.form_name}
              placeholder={'Doc name'}
            />
          </View>
        </View>
        <View style={styles.buttonsContainer(bottom)}>
          <Button
            secondary
            text={'Share'}
            onPress={() => onPdfShare({ pdfUrl: signature.signed_doc_url })}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    flex: 1,
  },

  wrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },

  title: {
    color: colors.gray,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  iconContainer: {
    flexDirection: 'row',
  },

  iconLabel: {
    color: colors.black,
    textTransform: 'uppercase',
    fontSize: 14,
    marginLeft: 16,
  },

  mb: { marginBottom: 8 },
  mbLarge: { marginBottom: 24 },

  mbLg: { marginBottom: 48 },

  image: {
    width: imageDimension,
    height: imageDimension,
    borderRadius: imageDimension / 2,
  },
  agentContainer: {
    flexDirection: 'row',
  },
  agentData: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 10,
    justifyContent: 'space-evenly',
  },
  buttonsContainer: bottom => ({
    flexDirection: 'row',
    paddingBottom: bottom ? 50 - bottom : 50,
  }),
  headerRightContainer: {
    padding: 12,
    paddingHorizontal: 16,
    marginHorizontal: -16,
  },
  headerRightText: {
    color: colors.orange,
  },
});

SignatureDetails.propTypes = {
  form: PropTypes.object,
  route: PropTypes.shape({
    params: PropTypes.shape({
      signature: PropTypes.object,
    }),
  }),
};

export default SignatureDetails;
