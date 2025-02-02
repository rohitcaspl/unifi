import axios from './base';

const getProjects = data => axios.post('/project/get_recent_projects', data);

export default { getProjects };
