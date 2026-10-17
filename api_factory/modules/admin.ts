import { adminManagementApi } from './adminManagement';

/**
 * Backwards-compatible facade. The old page imports (`adminApi.getUsers`,
 * `adminApi.getEscrows`) now hit the guarded `/admin/*` routes instead of the old
 * JWT-only `/users/admin/all` and `/escrow/admin/all` routes.
 */
export const adminApi = {
  getUsers: () => adminManagementApi.listUsers(),
  getEscrows: () => adminManagementApi.listEscrows(),
  ...adminManagementApi,
};

export * from './adminManagement';
