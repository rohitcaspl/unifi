import { StyleSheet, View } from 'react-native';
import FolderIcon from '@assets/folder-open.svg';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import { useNavigation } from '@react-navigation/native';

const NoSignaturesMessage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FolderIcon />
      <CustomText size={18} bold style={styles.titleMessage}>
        You don’t have any signatures.
      </CustomText>
      <CustomText textAlign={'center'}>
        Please check your connection or try adding new signature.
      </CustomText>
      <Button
        customStyle={styles.button}
        text='Take me to Workspaces'
        onPress={() => {
          navigation.navigate('ProjectsList');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: 295,
    marginTop: 28,
  },

  titleMessage: {
    marginTop: 24,
    marginBottom: 8,
  },

  button: {
    maxWidth: 232,
    marginTop: 24,
  },
});

export default NoSignaturesMessage;
