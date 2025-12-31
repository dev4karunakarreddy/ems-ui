// components/Login.tsx
'use client';

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/components/AuthProvider';
import { useSnackbar } from '@/utils/SnackbarContext';
import { loginApi, LoginRequest } from '@/services/auth.service';

interface FormData extends LoginRequest {}

export const Login = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: ({ access_token, role }) => {
      setAuth({ token: access_token, role });
      
      document.cookie = `token=${access_token}; path=/;`;
      if (role) {
        document.cookie = `role=${role}; path=/;`;
      }
      
      router.push('/dashboard');
      showSnackbar('Login successful', 'success');
    },
    onError: (error: Error) => {
      showSnackbar(error.message, 'error');
    },
  });

  const onSubmit = (data: FormData) => login(data);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            size="small"
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            margin="normal"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Minimum 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};