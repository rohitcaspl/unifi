import projectsApi from '@api/legacyApi/projects';
import { useQuery } from '@tanstack/react-query';

const useProjectsList = data => {
  return useQuery({
    queryKey: ['projects', JSON.stringify(data)],
    queryFn: () => projectsApi.getProjects(data),
    enabled: !!data,
  });
};

export default useProjectsList;
