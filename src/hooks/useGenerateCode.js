import lambdaGuestApi from '@api/lambdaApi/guest';
import { useMutation } from '@tanstack/react-query';

const useGenerateCode = options =>
  useMutation({
    mutationFn: lambdaGuestApi.generateCode,
    key: ['generate-code'],
    ...options,
  });

export default useGenerateCode;
