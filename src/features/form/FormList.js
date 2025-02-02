import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { keyExtractor } from '@shared/helpers';

import FormItem from './FormItem';

const FormList = ({ formList, headerComponent }) => {
  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <FlashList
          ListHeaderComponentStyle={styles.header}
          nestedScrollEnabled={true}
          data={formList}
          keyExtractor={keyExtractor}
          ListHeaderComponent={headerComponent}
          estimatedItemSize={90}
          renderItem={FormItem}
        />
      </View>
    </View>
  );
};

FormList.propTypes = {
  formList: PropTypes.arrayOf(PropTypes.object),
  headerComponent: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  listWrapper: { width: '100%', height: '100%' },

  header: {
    marginHorizontal: 16,
  },
});

export default FormList;
