import * as lambdaSignatureApi from '@api/lambdaApi/signatures';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useCreateVideo = options =>
  useMutation({
    mutationFn: lambdaSignatureApi.createVideo,
    key: ['create_video'],
    ...options,
  });

const useUploadVideo = options =>
  useMutation({
    mutationFn: async ({ url, data }) => {
      return axios({
        method: 'PUT',
        url: url,
        headers: {
          'Content-Type': 'video/mp4',
        },
        data: data,
        transformRequest: d => d,
      });
    },
    key: ['upload_video'],
    ...options,
  });

export { useCreateVideo, useUploadVideo };
