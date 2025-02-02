import { StyleSheet, View } from 'react-native';
import FolderIcon from '@assets/folder-open.svg';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import { useWorkspaceContext } from 'context/WorkspaceContext';

const NoProjectsMessage = () => {
  const { refetchWorkspaces } = useWorkspaceContext();

  return (
    <View style={styles.container}>
      <FolderIcon />
      <CustomText size={18} bold style={styles.titleMessage}>
        You don't have any Doc Spaces.
      </CustomText>
      <CustomText textAlign={'center'}>
        Ask your Doc Space manager to assign you to one. If you are the Doc
        Space manager, create a new one in the Doc Space Portal.
      </CustomText>
      <Button
        customStyle={styles.button}
        text='Refresh'
        onPress={() => {
          try {
            refetchWorkspaces();
          } catch (err) {
            console.error(err.message);
          }
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

export default NoProjectsMessage;
