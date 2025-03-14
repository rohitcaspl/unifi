/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';
import FormList from '@features/form/FormList';
import colors from '@theme/colors';
import Layout from '@components/Layout';
import CustomText from '@components/CustomText';
import SortIcon from '@assets/icons/sort.svg';
import CustomModalDropdown from '@components/CustomModalDropdown';
import CustomImage from '@components/CustomImage';

import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { CUSTOM_SORT_OPTIONS } from '@shared/constants';
import { formatDate } from '@shared/helpers';
import { useNavigation } from '@react-navigation/native';

const ProjectDetails = ({ route }) => {
  console.log("new route data" ,route); 
  const [formSort, setFormSort] = useState(CUSTOM_SORT_OPTIONS[0].value);
  const [mappedData, setMappedData] = useState([]);

  const { navigate } = useNavigation();
  const { project } = route.params;

  useEffect(() => {
    let sortedForms = [];
    try {
      if (formSort === 'new')
        sortedForms = project.forms.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
      else {
        sortedForms = project.forms.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
      }

      setMappedData(
        sortedForms.map(item => ({
          id: item._id,
          name: item.form_name,
          language: item.language,
          onPress: () =>
            navigate('FormDetails', { form: item, projectId: project._id }),
        })),
      );
    } catch (error) {
      setMappedData(
        project.forms.map(item => ({
          id: item._id,
          name: item.form_name,
          language: item.language,
          onPress: () =>
            navigate('FormDetails', { form: item, projectId: project._id }),
        })),
      );
    }
  }, [formSort, project.forms, navigate, project._id]);

  const HeaderComponent = () => {
    const renderInitials = (name) => {
      const nameParts = name;
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    };
    return (
      <View style={styles.container}>
        <CustomText bold size={24}>
          {project.project_name}
        </CustomText>
        <CustomText size={16} style={styles.info}>
          {project.project_details}
        </CustomText>

        <View style={styles.wrapper}>
          <View style={styles.cont}>
            <CustomText style={styles.subtitle}>Start date</CustomText>
            <CustomText size={16}>{formatDate(project.time)}</CustomText>
          </View>
          <View style={styles.cont}>
            <CustomText style={styles.subtitle}>Country</CustomText>
            <CustomText size={16}>{project.country}</CustomText>
          </View>
        </View>

        <CustomText bold size={16}>
          Users
        </CustomText>
        <View style={styles.avatarWrapper}>
          {project.docmanagers.map((user, index) => {
            if (index < 5)
              return (
                <View style={styles.nameCard} key={user._id}>
                  <CustomText>{user.full_name}</CustomText>
                </View>
              );
          })}
          {project.docmanagers.length > 5 ? (
            <CustomText bold style={styles.nmOfUsers}>
              +{project.docmanagers.length - 5}
            </CustomText>
          ) : null}
        </View>

        <View style={styles.wrapper}>
          <CustomText size={16} bold>
            All docs
          </CustomText>
          <CustomModalDropdown
            icon={SortIcon}
            options={CUSTOM_SORT_OPTIONS}
            onSelect={value => setFormSort(value)}
            selected={formSort}
          />
        </View>
      </View>
    );
  };

  HeaderComponent.propTypes = {
    project: PropTypes.object,
  };

  return (
    <Layout title={'Doc Space'}>
      <FormList
        formList={mappedData}
        headerComponent={<HeaderComponent project={project} />}
      />
    </Layout>
  );
};

export default ProjectDetails;

ProjectDetails.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      project: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  nameCard: {
    padding: 18,
    backgroundColor: colors.accentGray,
    borderRadius: 8,
    marginRight: 4,
  },

  initials: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    flex: 1,
  },

  avatarWrapper: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },

  avatar: {
    height: 30,
    width: 30,
    marginRight: 4,
    borderRadius: 15,
  },

  title: {
    textTransform: 'uppercase',
  },

  subtitle: {
    color: colors.label,
    marginBottom: 4,
  },

  info: {
    color: colors.label,
    marginBottom: 20,
    marginTop: 12,
  },

  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  cont: {
    backgroundColor: colors.accentGray,
    borderRadius: 12,
    width: '48%',
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  nmOfUsers: {
    color: colors.orange,
    marginLeft: 8,
  },
  
});
