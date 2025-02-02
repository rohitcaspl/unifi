import * as lambdaFaceApi from '@api/lambdaApi/faces';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useCreatePhoto = options =>
  useMutation({
    mutationFn: lambdaFaceApi.createPhoto,
    mutationKey: ['create_photo'],
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
    mutationKey: ['upload_photo'],
    ...options,
  });

const useGetFaceId = options =>
  useMutation({
    mutationFn: lambdaFaceApi.getFaceId,
    mutationKey: ['get_face_id'],
    ...options,
  });

const useNewFaceId = options =>
  useMutation({
    mutationFn: lambdaFaceApi.newFaceId,
    mutationKey: ['new_face_id'],
    ...options,
  });

export { useCreatePhoto, useUploadPhoto, useGetFaceId, useNewFaceId };
