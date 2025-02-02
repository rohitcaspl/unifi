import { useWorkspaceContext } from 'context/WorkspaceContext';
import { useMemo } from 'react';

const useGetUserForms = project_id => {
  const { projects } = useWorkspaceContext();
  const projectsList = projects?.data?.data;
  const formsList = useMemo(
    () =>
      projectsList
        ?.map(project => (project._id === project_id ? project.forms : []))
        .flat(),
    [projectsList, project_id],
  );
  return { formsList };
};

export default useGetUserForms;
