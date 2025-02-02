import qs from 'qs';

export const requestConfig = baseURL => ({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: function (params) {
    return qs.stringify(params);
  },
});
