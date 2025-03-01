import PropTypes from 'prop-types';
import ListComponent from '@components/ListComponent';
import useGetUserSignatures from '@hooks/useGetUserSignatures';
import { useEffect } from 'react';
import NoSignaturesMessage from '@components/NoSignaturesMessage';
import { useNavigation } from '@react-navigation/native';

const Signatures = ({
  sort,
  headerComponent,
  setSignatureCount,
  filterData,
  renderItem,
  footerComponent,
}) => {
  const {
    signatures,
    totalSignaturesCount,
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetUserSignatures(filterData, sort);

  const navigation = useNavigation();

  const onPress = item => {
    navigation.navigate('PdfViewer', {
      pdf: item.signed_doc_url,
    });
  };

  useEffect(() => {
    if (setSignatureCount) {
      setSignatureCount(totalSignaturesCount);
    }
  }, [setSignatureCount, totalSignaturesCount]);
console.log("itme",signatures);
  return (
    <>
      <ListComponent
        headerComponent={headerComponent}
        data={signatures}
        renderItem={renderItem}
        refetch={refetch}
        onPress={onPress}
        estimatedItemSize={60}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hideScrollbar={true}
        marginHorizontal={0}
        footerComponent={footerComponent}
        emptyListComponent={<NoSignaturesMessage />}
      />
    </>
  );
};

Signatures.propTypes = {
  form: PropTypes.object,
  sort: PropTypes.string,
  setSignatureCount: PropTypes.func,
  headerComponent: PropTypes.node,
  filterData: PropTypes.shape({
    form: PropTypes.object,
    project: PropTypes.object,
  }),
  renderItem: PropTypes.any,
  footerComponent: PropTypes.node,
};

export default Signatures;
