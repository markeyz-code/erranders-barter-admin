import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Logistics API — written against `barter/backend/src/logistics/logistics.controller.ts`.
 *
 * This module did not exist. The admin's logistics page was a static mockup with
 * no script block at all, while the backend service behind it was orphaned (no
 * controller, no module, unregistered). These are the real routes.
 *
 * NOTE: `axios.config.ts` already carries the `/api/v1` prefix, so paths here are
 * written WITHOUT it. Every call is JWT-guarded by `AuthGuard('jwt')` on the
 * backend and `GATEWAY_ENDPOINT_WITH_AUTH` attaches the bearer token.
 */

export type DispatchStatus =
  | 'pending'
  | 'dispatched'
  | 'assigned'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export interface Dispatch {
  _id: string;
  transactionId?: string;
  itemId?: string;
  itemTitle?: string;
  sellerId?: string;
  buyerId?: string;
  createdBy?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  status: DispatchStatus;
  provider?: string;
  providerOrderId?: string;
  trackingUrl?: string;
  riderName?: string;
  riderPhone?: string;
  riderId?: string;
  fee?: number;
  priority?: string;
  notes?: string;
  /** Only present on a failed dispatch — why it failed and what the provider said. */
  lastError?: string;
  providerResponse?: unknown;
  dispatchedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DispatchListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DispatchListQuery {
  status?: DispatchStatus | '';
  search?: string;
  itemId?: string;
  transactionId?: string;
  page?: number;
  limit?: number;
}

export interface DispatchStats {
  total: number;
  active: number;
  failed: number;
  last24h: number;
  byStatus: Record<DispatchStatus, number>;
}

export const logisticsApi = {
  /** GET /logistics/deliveries — paginated, filterable. */
  list: (query: DispatchListQuery = {}) => {
    // Drop empty values so an unset filter is not sent as `status=` and rejected.
    const params = Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    return GATEWAY_ENDPOINT_WITH_AUTH.get<{ data: Dispatch[]; meta: DispatchListMeta }>(
      '/logistics/deliveries',
      { params }
    );
  },

  /** GET /logistics/deliveries/:id */
  get: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.get<Dispatch>(`/logistics/deliveries/${id}`),

  /** POST /logistics/deliveries — dispatch a rider for a barter trade. */
  create: (payload: Partial<Dispatch>) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Dispatch>('/logistics/deliveries', payload),

  /** PATCH /logistics/deliveries/:id — assign a rider or move the status. */
  update: (id: string, payload: Partial<Dispatch>) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<Dispatch>(`/logistics/deliveries/${id}`, payload),

  /** POST /logistics/deliveries/:id/retry — re-send a failed dispatch. */
  retry: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<Dispatch>(`/logistics/deliveries/${id}/retry`),

  /** GET /logistics/stats — counters for the dashboard board. */
  stats: () => GATEWAY_ENDPOINT_WITH_AUTH.get<DispatchStats>('/logistics/stats'),
};

export default logisticsApi;
