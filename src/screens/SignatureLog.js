/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-quotes */
import colors from '@theme/colors';

import { StyleSheet, View } from 'react-native';

import Layout from '@components/Layout';
import Filter from '@components/Filter/Filter';

import useFilterSignatures from 'hooks/useFilterSignatures';
import CustomModalDropdown from '@components/CustomModalDropdown';
import CustomText from '@components/CustomText';
import SortIcon from '@assets/icons/sort.svg';
import { SIGNATURE_SORT_OPTIONS } from '@shared/constants';
import Signatures from '@components/Signatures';
import NoSignaturesMessage from '@components/NoSignaturesMessage';
import SignatureCard from '@components/SignatureCard';

const SignatureLog = () => {
  const {
    formsFilters,
    projectsFilters,
    setFormFilter,
    setProjectFilter,
    setSort,
    filterData,
    sort,
  } = useFilterSignatures();
  console.log('SignatureLog -> filterData', filterData);
  return (
    <Layout defaultNav>
      {filterData?.project ? (
        <Signatures
          headerComponent={
            <View style={styles.container}>
              <Filter
                data={projectsFilters}
                onChange={setProjectFilter}
                selected={filterData.project}
                labelKey='project_name'
                placeholder='Choose project'
              />
              <Filter
                data={formsFilters}
                onChange={setFormFilter}
                selected={filterData.form}
                labelKey='form_name'
                placeholder='Choose doc'
                customStyle={styles.formsFilter}
              />
              <View style={styles.wrapper}>
                <CustomText bold>Consents</CustomText>
                <CustomModalDropdown
                  icon={SortIcon}
                  options={SIGNATURE_SORT_OPTIONS}
                  onSelect={value => setSort(value)}
                  selected={sort}
                />
              </View>
            </View>
          }
          sort={sort}
          filterData={filterData}
          renderItem={SignatureCard}
        />
      ) : (
        <NoSignaturesMessage />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  dropdownButton: {
    padding: 12,
  },

  headerStyle: {
    padding: 0,
  },

  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
  },

  dropdown: {
    width: '50%',
    maxHeight: 170,
    borderRadius: 12,
    padding: 12,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: colors.white,
    right: 16,
  },

  listItem: {
    fontSize: 18,
    padding: 16,
    color: colors.black,
  },

  formsFilter: { marginTop: 10 },
});

export default SignatureLog;
