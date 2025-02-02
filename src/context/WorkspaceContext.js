import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useAgentWorkspaces from 'hooks/useAgentWorkspaces';
import useProjectsList from 'hooks/useProjectsList';
import { useAuthContext } from './AuthContext';

const WorkspaceContext = createContext({
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
});

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState();
  const { userData } = useAuthContext();
  const { data: workspaces, refetch: refetchWorkspaces } = useAgentWorkspaces();

  useEffect(() => {
    if (!selectedWorkspace && workspaces && userData) {
      setSelectedWorkspace(workspaces.data[0]);
    }
  }, [selectedWorkspace, userData, workspaces]);

  const projectsListQueryData = useMemo(
    () =>
      selectedWorkspace && userData
        ? {
            company_id: selectedWorkspace.company_id,
            company_name: selectedWorkspace.company_name,
            page: 1,
            gap: 100,
            user_id: userData.data.data._id,
          }
        : null,
    [selectedWorkspace, userData],
  );

  const {
    data: projects,
    isLoading: isProjectListLoading,
    refetch: refetchProjects,
  } = useProjectsList(projectsListQueryData);

  const value = useMemo(
    () => ({
      workspaces,
      projects,
      isProjectListLoading,
      selectedWorkspace,
      setSelectedWorkspace,
      refetchProjects,
      refetchWorkspaces,
    }),
    [
      projects,
      workspaces,
      selectedWorkspace,
      isProjectListLoading,
      setSelectedWorkspace,
      refetchProjects,
      refetchWorkspaces,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

WorkspaceProvider.propTypes = {
  children: PropTypes.any,
};

export const useWorkspaceContext = () => useContext(WorkspaceContext);
