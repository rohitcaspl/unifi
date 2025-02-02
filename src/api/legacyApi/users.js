import axios from './base';

const updateUser = data =>
  axios.put('/users/update_profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export default { updateUser };
