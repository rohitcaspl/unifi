import axios from './base';
import { getUser } from '@storage/user'; // Ensure this import is correct

const getWorkspaces = async (data) => {
  const user = await getUser();
  const token = user?.data?.token; // Adjust based on your user structure

  return axios.post('/agent/get_workspaces_from_agent', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default { getWorkspaces };
