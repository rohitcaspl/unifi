import CustomText from '@components/CustomText';
import NoProjectsMessage from '@components/NoProjectsMessage';
import Filter from '@components/Filter';
import Layout from '@components/Layout';
import ListComponent from '@components/ListComponent';

import { useNavigation } from '@react-navigation/native';
import { useWorkspaceContext } from 'context/WorkspaceContext';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import ProjectListItem from './ProjectListItem';

const ProjectsList = () => {
  const {
    projects,
    selectedWorkspace,
    workspaces,
    isProjectListLoading,
    setSelectedWorkspace,
    refetchProjects,
  } = useWorkspaceContext();

  const workspaceListMapped = useMemo(() => {
    return (workspaces?.data || []).map(item => ({
      ...item,
      title: item.display_company_name,
    }));
  }, [workspaces]);

  const onSelect = item => {
    setSelectedWorkspace(item);
  };

  const { navigate } = useNavigation();

  const dataMapped = useMemo(
    () =>
      (projects?.data?.data || []).map(item => ({
        ...item,
        onPress: () =>
          navigate('ProjectDetails', {
            project: item,
          }),
      })),
    [projects, navigate],
  );

  return (
    <Layout defaultNav>
      {workspaceListMapped?.length > 0 ? (
        <ListComponent
          data={dataMapped}
          headerComponent={
            <View style={styles.container}>
              <Filter
                data={workspaceListMapped ?? []}
                selected={selectedWorkspace ?? {}}
                onChange={onSelect}
                labelKey='display_company_name'
                placeholder='Choose Doc Space'
              />
              <View style={styles.spacer}>
                <CustomText>
                  Docs in{' '}
                  <CustomText bold>
                    {selectedWorkspace?.display_company_name}
                  </CustomText>
                </CustomText>
              </View>
            </View>
          }
          isLoading={isProjectListLoading}
          refetch={refetchProjects}
          estimatedItemSize={120}
          renderItem={ProjectListItem}
        />
      ) : (
        <NoProjectsMessage />
      )}
    </Layout>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  spacer: {
    marginVertical: 16,
  },
});
