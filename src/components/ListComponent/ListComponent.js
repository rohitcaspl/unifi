import PropTypes from 'prop-types';
import CustomText from '@components/CustomText';
import ListSkeleton from '@components/ListSkeleton';
import colors from '@theme/colors';

import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { _idKeyExtractor } from '@shared/helpers';
import { useState } from 'react';

const ListComponent = ({
  data,
  headerComponent,
  refetch,
  isLoading,
  estimatedItemSize,
  renderItem: RenderItem,
  onPress,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isFetchingNextPage,
  hideScrollbar,
  skeletonMargin,
  footerComponent,
  emptyListComponent,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialOnEndReached, setInitialOnEndReached] = useState(true);

  const isFetchingAnything = isFetching || isFetchingNextPage;

  const loadNextPage = () => {
    if (hasNextPage) fetchNextPage();
  };

  return (
    <>
      {headerComponent ?? null}
      <FlashList
        data={isLoading ? [] : data}
        showsHorizontalScrollIndicator={!hideScrollbar}
        showsVerticalScrollIndicator={!hideScrollbar}
        ListFooterComponent={() => (
          <>
            {isFetchingAnything && data && !initialOnEndReached ? (
              <View style={styles.container}>
                <ActivityIndicator size='small' color={colors.orange} />
              </View>
            ) : null}
            {footerComponent}
          </>
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <ListSkeleton height={estimatedItemSize} margin={skeletonMargin} />
          ) : emptyListComponent ? (
            emptyListComponent
          ) : (
            <CustomText style={styles.noData}>No data to display</CustomText>
          )
        }
        estimatedItemSize={estimatedItemSize}
        onRefresh={() => {
          setIsRefreshing(true);
          refetch();
          if (!isLoading) setIsRefreshing(false);
        }}
        refreshing={isRefreshing && data ? true : false}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            onPress={() => {
              if (onPress) onPress(item);
            }}
          />
        )}
        keyExtractor={_idKeyExtractor}
        onMomentumScrollBegin={() => setInitialOnEndReached(false)}
        onEndReached={() => {
          if (!initialOnEndReached) {
            loadNextPage();
            setInitialOnEndReached(true);
          }
        }}
      />
    </>
  );
};

ListComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  estimatedItemSize: PropTypes.number,
  headerComponent: PropTypes.node,
  renderItem: PropTypes.any,
  onPress: PropTypes.func,
  refetch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  isFetching: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  hideScrollbar: PropTypes.bool,
  fetchNextPage: PropTypes.func,
  skeletonMargin: PropTypes.number,
  footerComponent: PropTypes.node,
  emptyListComponent: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
  },

  noData: {
    marginLeft: 20,
    marginTop: 20,
  },
});

export default ListComponent;
