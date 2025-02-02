import colors from '@theme/colors';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from '@components/CustomText';
import ArrowRight from '@assets/icons/arrow-right.svg';
import countries from 'i18n-iso-countries';
import nationalities from 'i18n-nationality';
import { formatIsoToDotted } from '@shared/helpers';
import { useMemo } from 'react';

const ProjectListItem = ({ item }) => {
  const date = useMemo(() => {
    if (!item?.time) return null;
    try {
      const formattedDate = formatIsoToDotted(new Date(item.time));
      return formattedDate;
    } catch {
      return null;
    }
  }, [item]);

  const nationality = useMemo(() => {
    if (!item?.country) return null;
    try {
      const formattedNationality = nationalities.getName(
        countries.getAlpha2Code(item.country, 'en'),
        'en',
      );
      return formattedNationality;
    } catch {
      return null;
    }
  }, [item]);

  return (
    <TouchableOpacity onPress={item.onPress}>
      <View style={styles.container}>
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            <CustomText bold size={16}>
              {item?.project_name}
            </CustomText>
          </View>
          <View style={styles.detailsContainer}>
            <CustomText style={styles.detailsText}>
              {item?.project_details}
            </CustomText>
          </View>
          <View style={styles.infoContainer}>
            {item?.agents?.length ? (
              <CustomText style={styles.infoText}>
                {item.agents.length + ' users'}
              </CustomText>
            ) : null}
            {date ? (
              <CustomText style={styles.infoText}>{` • ` + date}</CustomText>
            ) : null}
            {nationality ? (
              <CustomText style={styles.infoText}>
                {` • ` + nationality}
              </CustomText>
            ) : null}
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <ArrowRight />
        </View>
      </View>
    </TouchableOpacity>
  );
};

ProjectListItem.propTypes = {
  item: PropTypes.shape({
    project_name: PropTypes.string.isRequired,
    project_details: PropTypes.string.isRequired,
    agents: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func.isRequired,
    time: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }),
};

export default ProjectListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 6,
    marginBottom: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 22,
    flexDirection: 'row',
  },
  dataContainer: {
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 11,
    paddingRight: 5,
  },
  titleContainer: {
    paddingBottom: 7,
  },
  detailsContainer: {
    paddingBottom: 7,
  },
  detailsText: {
    color: colors.label,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  infoText: {
    color: colors.orange,
  },
});
