import usersApi from '@api/legacyApi/users';
import { useMutation } from '@tanstack/react-query';

const useUpdateUser = ({ onSuccess, onError, onSettled }) => {
  return useMutation({
    mutationFn: usersApi.updateUser,
    onSuccess,
    onError,
    onSettled,
  });
};

export default useUpdateUser;
