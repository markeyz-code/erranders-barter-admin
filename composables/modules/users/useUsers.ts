import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';

export const useUserProfile = () => {
  const loading = ref(false);
  const profile = ref(null);
  
  const fetchProfile = async () => {
    loading.value = true;
    try {
      const res = await usersApi.getProfile();
      profile.value = res.data;
    } catch (err: any) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  return { loading, profile, fetchProfile };
};