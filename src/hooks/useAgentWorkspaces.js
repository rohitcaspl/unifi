import agentApi from '@api/legacyApi/agent';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'context/AuthContext';

const useAgentWorkspaces = () => {
  const { userData, setLoggedIn } = useAuthContext();
  const userId = userData?.data?.data?._id;
  return useQuery(
    ['workspaces', userId],
    () => agentApi.getWorkspaces({ agent_id: userId }),
    {
      enabled: !!userData,
      onError: err => {
        if (err.response?.data?.status === 403) setLoggedIn('');
      },
    },
  );
};

export default useAgentWorkspaces;
