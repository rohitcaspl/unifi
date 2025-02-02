// import { requestConfig } from '@api/requestConfig';
// import { getUser } from '@storage/user';
// import axios from 'axios';
// import config from '../../config';

// const axiosInstance = axios.create(requestConfig(config.api.lambdaHost));

// axiosInstance.interceptors.request.use(async req => {
//   const user = await getUser();
//   if (user) {
//     const token = user.data.token;
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// axiosInstance.interceptors.response.use(response => response.data);

// export default axiosInstance;
import { requestConfig } from '@api/requestConfig';
import { getUser } from '@storage/user';
import axios from 'axios';
import config from '../../config';

// Create an Axios instance with the request config
const axiosInstance = axios.create(requestConfig(config.api.lambdaHost));

// Add a request interceptor
axiosInstance.interceptors.request.use(async req => {
  const user = await getUser();
  if (user) {
    const token = user.data.token;
    req.headers.Authorization = `Bearer ${token}`;
  }

  // Log request details
  console.log('Request:', {
    url: req.url,
    method: req.method,
    headers: req.headers,
    data: req.data,
  });

  return req;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Log response details
    console.log('Response:', {
      url: response.config.url,
      method: response.config.method,
      headers: response.config.headers,
      data: response.config.data,
      status: response.status,
      statusText: response.statusText,
      responseData: response.data,
    });

    return response.data;
  },
  error => {
    // Log error details
    if (error.response) {
      console.error('Error Response:', {
        url: error.response.config.url,
        method: error.response.config.method,
        headers: error.response.config.headers,
        data: error.response.config.data,
        status: error.response.status,
        statusText: error.response.statusText,
        errorData: error.response.data,
      });
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
