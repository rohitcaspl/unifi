import axios from './base';

const generateCode = data => axios.post('/api/v1/guest/invite', data);

export default {
  generateCode,
};
