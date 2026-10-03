import { ref } from 'vue';
import { adminApi } from '@/api_factory/modules/admin';

export const useAdminStats = () => {
  const loading = ref(false);
  const users = ref([]);
  const escrows = ref([]);
  const error = ref<string | null>(null);

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [usersRes, escrowsRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getEscrows()
      ]);
      users.value = usersRes.data || [];
      escrows.value = escrowsRes.data || [];
    } catch (err: any) {
      console.warn('Dashboard fetch failed, showing empty state:', err.message);
      // Suppress error to allow empty states to render instead of error screen
      error.value = null; 
      users.value = [];
      escrows.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { loading, users, escrows, error, fetchStats };
};
