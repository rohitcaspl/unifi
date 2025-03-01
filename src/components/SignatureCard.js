/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable curly */
import FormIcon from '@assets/icons/form.svg';
import OptionsIcon from '@assets/icons/options';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import { formatDate, onPdfShare } from '@shared/helpers';
import { useWorkspaceContext } from 'context/WorkspaceContext';
import { Pressable, StyleSheet, View } from 'react-native';

import CustomImage from './CustomImage';
import CustomModalDropdown from './CustomModalDropdown';
import CustomText from './CustomText';

import { FORM_OPTIONS } from '../shared/constants';

const SignatureCard = ({ item, onPress }) => {
  const { selectedWorkspace } = useWorkspaceContext();
  const navigation = useNavigation();

  const formattedDate = item.date ? formatDate(new Date(item.date)) : "N/A";

  return (
    <View style={styles.container}>
      <Pressable style={styles.wrapper} onPress={onPress}>
        <View style={styles.top}>
          <CustomImage uri={item.photo_url} customStyle={styles.avatar} />
          <View style={styles.nameAndDate}>
            <CustomText size={16} bold>
              {item.name || "Unknown"}
            </CustomText>
            <CustomText size={12} style={styles.grey}>
              {formattedDate}
            </CustomText>
          </View>

          <CustomModalDropdown
            options={FORM_OPTIONS}
            icon={OptionsIcon}
            onSelect={value => {
              if (value === 'share')
                onPdfShare({ pdfUrl: item.signed_doc_url });
              else if (value === 'details')
                navigation.navigate('SignatureDetails', { signature: item });
            }}
          />
        </View>

        <View style={styles.bottom}>
          <View style={styles.folderPath}>
            <CustomText style={[styles.grey, styles.workspace]} numberOfLines={1}>
              {selectedWorkspace.display_company_name || "Unknown Workspace"}
            </CustomText>

            <CustomText size={16} style={[styles.grey, styles.arrow]}> {`>`} </CustomText>

            <CustomText style={[styles.grey, styles.project]} numberOfLines={1}>
              {item.form_name || "Unknown Project"}
            </CustomText>
          </View>
          <View style={styles.formContainer}>
            <FormIcon width={12} height={12} stroke={colors.orange} />
            <CustomText style={[styles.grey, styles.formName]}>
              {item.form_name || "Unnamed Form"}
            </CustomText>
          </View>
        </View>
      </Pressable>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.formGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
  },

  wrapper: {
    flex: 1,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nameAndDate: {
    marginLeft: 16,
    marginRight: 'auto',
  },

  folderPath: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 16,
  },

  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  formName: {
    marginLeft: 8,
    color: colors.orange,
  },

  grey: {
    color: colors.label,
  },

  workspace: {
    maxWidth: '70%',
  },
  project: {
    flex: 1,
  },

  arrow: {
    marginHorizontal: 10,
  },

  avatar: { width: 40, height: 40, borderRadius: 50 },

  subtitle: { color: colors.gray, textTransform: 'uppercase', marginBottom: 8 },

  dropdown: {
    width: '50%',
    maxHeight: 110,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    backgroundColor: colors.white,
    right: 16,
  },

  listItem: {
    fontSize: 18,
    padding: 16,
    color: colors.black,
  },

  textStyle: {
    padding: 12,
  },
});

SignatureCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string,
    name: PropTypes.string,
    form_name: PropTypes.string,
    signed_doc_url: PropTypes.string,
    photo_url: PropTypes.string,
    project_name: PropTypes.string,
  }),
  onPress: PropTypes.func,
};

export default SignatureCard;
