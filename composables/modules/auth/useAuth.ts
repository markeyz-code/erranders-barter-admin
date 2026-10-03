import { ref } from 'vue';
import { authApi } from '@/api_factory/modules/auth';

export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);

  const login = async (data: any) => {
    loading.value = true;
    try {
      const res = await authApi.login(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('barter_token', res.data.access_token);
      }
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const signup = async (data: any) => {
    loading.value = true;
    try {
      const res = await authApi.signup(data);
      return res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Signup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { login, signup, loading, error };
};