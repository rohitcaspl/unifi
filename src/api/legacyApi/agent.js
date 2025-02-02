import axios from './base';

const getWorkspaces = data =>
  axios.post('/agent/get_workspaces_from_agent', data);

export default { getWorkspaces };
