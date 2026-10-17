import { ref } from 'vue';
import {
  adminManagementApi,
  adminErrorMessage,
  type AdminEscrow,
  type AdminStats,
  type AdminUser,
} from '@/api_factory/modules/adminManagement';

/**
 * Dashboard data. Every tile and table is backed by a real endpoint:
 *   GET /admin/stats, GET /admin/users, GET /admin/escrows
 * A failure is surfaced as an error with a retry, never as zeroed-out fake numbers.
 */
export const useAdminStats = () => {
  const loading = ref(false);
  const stats = ref<AdminStats | null>(null);
  const users = ref<AdminUser[]>([]);
  const escrows = ref<AdminEscrow[]>([]);
  const error = ref<string | null>(null);

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [statsRes, usersRes, escrowsRes] = await Promise.all([
        adminManagementApi.getStats(),
        adminManagementApi.listUsers(),
        adminManagementApi.listEscrows(),
      ]);
      stats.value = statsRes.data || null;
      users.value = Array.isArray(usersRes.data) ? usersRes.data : [];
      escrows.value = Array.isArray(escrowsRes.data) ? escrowsRes.data : [];
    } catch (err: any) {
      error.value = adminErrorMessage(err, 'Could not load dashboard data from the API.');
      stats.value = null;
      users.value = [];
      escrows.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, users, escrows, error, fetchStats };
};
