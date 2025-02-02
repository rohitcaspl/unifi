import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import TabItem from '@components/TabItem';
import { _idKeyExtractor } from '@shared/helpers';
import { FlashList } from '@shopify/flash-list';

const TabFilter = ({ data, onChange, selected }) => {
  if (!data?.length) return;
  return (
    <View style={styles.listWrapper}>
      <FlashList
        horizontal
        data={data}
        extraData={selected}
        estimatedItemSize={20}
        keyExtractor={_idKeyExtractor}
        renderItem={({ item }) => (
          <TabItem
            item={item}
            name={item.form_name || item.project_name}
            onChange={onChange}
            isClicked={item._id === selected?._id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listWrapper: {
    width: '100%',
  },
});

TabFilter.propTypes = {
  data: PropTypes.PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.object,
};

export default TabFilter;
