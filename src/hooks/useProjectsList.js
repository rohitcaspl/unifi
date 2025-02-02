import projectsApi from '@api/legacyApi/projects';
import { useQuery } from '@tanstack/react-query';

const useProjectsList = data => {
  return useQuery(
    ['projects', JSON.stringify(data)],
    () => projectsApi.getProjects(data),
    {
      enabled: !!data,
    },
  );
};

export default useProjectsList;
