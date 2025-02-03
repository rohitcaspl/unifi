import * as lambdaSignatureApi from '@api/lambdaApi/signatures';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useCreateDoc = options =>
  useMutation({
    mutationFn: lambdaSignatureApi.createDoc,
    key: ['create_doc'],
    ...options,
  });

const useUploadSignature = options =>
  useMutation({
    mutationFn: async ({ url, data }) => {
      return axios({
        method: 'PUT',
        url: url,
        headers: {
          'Content-Type': 'application/pdf',
        },
        data: data,
        transformRequest: d => d,
      });
    },
    key: ['upload_signature'],
    ...options,
  });

const usePostSignature = options =>
  useMutation({
    mutationFn: lambdaSignatureApi.postSignature,
    key: ['post_signature'],
    ...options,
  });

export { useCreateDoc, useUploadSignature, usePostSignature };
