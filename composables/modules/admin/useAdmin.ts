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
      // A failed request is an error, not an empty dashboard. Keeping the error
      // lets the page show an honest retry screen instead of zeroed-out tiles.
      error.value =
        err?.response?.status === 401
          ? 'Your session has expired — sign in again.'
          : err?.response?.data?.message || 'Could not load dashboard data from the API.';
      users.value = [];
      escrows.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { loading, users, escrows, error, fetchStats };
};
