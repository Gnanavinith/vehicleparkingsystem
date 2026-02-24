import { useMutation } from '@tanstack/react-query';
import { login, forgotPassword, resetPassword } from './api';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../../redux/slices/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
    },
    onError: (error) => {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
