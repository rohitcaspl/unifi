import * as lambdaFaceApi from '@api/lambdaApi/faces';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useCreatePhoto = options =>
  useMutation({
    mutationFn: lambdaFaceApi.createPhoto,
    key: ['create_photo'],
    ...options,
  });

const useUploadPhoto = options =>
  useMutation({
    mutationFn: async ({ url, data }) => {
      return axios({
        method: 'PUT',
        url: url,
        headers: {
          'Content-Type': 'image/jpeg',
        },
        data: data,
        transformRequest: d => d,
      });
    },
    key: ['upload_photo'],
    ...options,
  });

const useGetFaceId = options =>
  useMutation({
    mutationFn: lambdaFaceApi.getFaceId,
    key: ['get_face_id'],
    ...options,
  });

const useNewFaceId = options =>
  useMutation({
    mutationFn: lambdaFaceApi.newFaceId,
    key: ['new_face_id'],
    ...options,
  });

export { useCreatePhoto, useUploadPhoto, useGetFaceId, useNewFaceId };
