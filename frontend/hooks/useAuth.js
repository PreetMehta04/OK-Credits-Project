'use client';
import { useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { saveTokens, clearTokens } from '@/lib/auth';
import useAppStore from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, clearUser } = useAppStore();
  const router = useRouter();

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      saveTokens(res.data);

      const meRes = await authApi.me();
      setUser(meRes.data);
      toast.success(`Welcome back, ${meRes.data.full_name}!`);
      router.push('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser]);

  const register = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(formData);
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    clearTokens();
    clearUser();
    router.push('/login');
    toast.success('Signed out successfully.');
  }, [router, clearUser]);

  return { login, register, logout, isLoading, error };
}
