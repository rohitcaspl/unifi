import PropTypes from 'prop-types';
import CustomText from '@components/CustomText';
import CustomModalDropdown from '@components/CustomModalDropdown';
import colors from '@theme/colors';
import OptionsIcon from '@assets/icons/options';
import { View, Pressable, StyleSheet } from 'react-native';
import { FORM_OPTIONS } from '@shared/constants';
import { formatDate, onPdfShare } from '@shared/helpers';
import CustomImage from '@components/CustomImage';
import { useNavigation } from '@react-navigation/native';

const FormSignatureCard = ({ item, onPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable style={styles.wrapper} onPress={onPress}>
        <View style={styles.imageContainer}>
          <CustomImage uri={item.photo_url} customStyle={styles.avatar} />
        </View>

        <View style={styles.content}>
          <CustomText>
            <CustomText style={styles.date} bold>
              {item.name}
            </CustomText>{' '}
            <CustomText style={styles.signed}>signed </CustomText>"
            {item.form_name}".{' '}
          </CustomText>
          <CustomText style={styles.date}>{formatDate(item.date)}</CustomText>
        </View>
        <CustomModalDropdown
          options={FORM_OPTIONS}
          icon={OptionsIcon}
          onSelect={value => {
            if (value === 'share') onPdfShare({ pdfUrl: item.signed_doc_url });
            else if (value === 'details')
              navigation.navigate('SignatureDetails', { signature: item });
          }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  wrapper: { flexDirection: 'row', alignItems: 'center' },

  imageContainer: { flex: 1 },

  content: { flex: 4, marginRight: 8 },

  avatar: { width: 40, height: 40, borderRadius: 20 },

  date: { color: colors.label },

  signed: {
    color: colors.orange,
  },
});

FormSignatureCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    agent_name: PropTypes.string,
    date: PropTypes.string,
    signee: PropTypes.object,
    form_name: PropTypes.string,
    signed_doc_url: PropTypes.string,
    photo_url: PropTypes.string,
    project_name: PropTypes.string,
    name: PropTypes.string,
  }),
  onPress: PropTypes.func,
};

export default FormSignatureCard;
