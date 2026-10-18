import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

/**
 * Admin management API — written against the `/admin/*` routes on the Barter backend.
 *
 * Every route is guarded by `AuthGuard('jwt')` + `AdminGuard`. A 403 means the signed-in
 * account is not an admin (set `isAdmin` on the user or add its email to `ADMIN_EMAILS`).
 * The axios instance already carries the `/api/v1` prefix and the bearer token.
 */

export interface AdminUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsappNumber?: string;
  university?: string;
  hostel?: string;
  level?: string;
  avatar?: string;
  rating?: number;
  totalTrades?: number;
  walletBalance?: number;
  isVerified?: boolean;
  /** Missing on legacy rows, which are active. Only `false` means suspended. */
  isActive?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminItem {
  _id: string;
  sellerId?: string | { _id: string; firstName?: string; lastName?: string; email?: string };
  title?: string;
  description?: string;
  price?: number;
  type?: 'sell' | 'swap' | 'service';
  status?: 'active' | 'pending' | 'sold' | 'completed';
  location?: string;
  category?: string;
  images?: string[];
  swapPreference?: string;
  isPromoted?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserSummary {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface AdminItemSummary {
  _id: string;
  title?: string;
  images?: string[];
  price?: number;
  location?: string;
  status?: string;
  isActive?: boolean;
}

export interface AdminWithdrawal {
  _id: string;
  userId?: string;
  amount?: number;
  fee?: number;
  netAmount?: number;
  reference?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  failureReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EscrowStatus = 'held_in_escrow' | 'disputed' | 'released' | 'refunded';

export interface AdminEscrow {
  _id: string;
  buyerId?: string;
  sellerId?: string;
  itemId?: string;
  amount?: number;
  itemPrice?: number;
  deliveryFee?: number;
  escrowFee?: number;
  deliveryMethod?: string;
  deliveryAddress?: string;
  paymentReference?: string;
  status?: EscrowStatus | string;
  resolution?: 'release' | 'refund';
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  sellerPayout?: number;
  sellerCommission?: number;
  refundAmount?: number;
  amountMoved?: number;
  moneyMoved?: boolean;
  recipient?: 'seller' | 'buyer';
  message?: string;
  buyer?: AdminUserSummary | null;
  seller?: AdminUserSummary | null;
  item?: AdminItemSummary | null;
  canResolve?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserDetail {
  user: AdminUser;
  items: AdminItem[];
  escrows: AdminEscrow[];
  withdrawals: AdminWithdrawal[];
  counts: {
    items: number;
    escrows: number;
    activeEscrows: number;
    walletBalance: number;
  };
}

export interface AdminStats {
  users: { total: number; verified: number; suspended: number; admins: number };
  items: {
    total: number;
    active: number;
    inactive: number;
    promoted: number;
    pending: number;
    sold: number;
    completed: number;
  };
  escrows: {
    total: number;
    held: number;
    disputed: number;
    released: number;
    refunded: number;
    valueHeld: number;
    totalVolume: number;
    byStatus: Record<string, number>;
    valueByStatus: Record<string, number>;
  };
  withdrawals: {
    pending: number;
    pendingValue: number;
    processing: number;
    processingValue: number;
    completed: number;
    failed: number;
  };
  services?: {
    total: number;
    active: number;
    remote: number;
    inactive: number;
  };
  bookings?: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalValue: number;
  };
  providers?: {
    total: number;
  };
  revenue: {
    escrowFees: number;
    sellerCommissions: number;
    totalFees: number;
  };
  generatedAt: string;
}

export interface AdminUserUpdate {
  isVerified?: boolean;
  isActive?: boolean;
  isAdmin?: boolean;
  /** Alias for `!isActive`. */
  suspended?: boolean;
}

export interface AdminItemUpdate {
  status?: 'active' | 'pending' | 'sold' | 'completed';
  isActive?: boolean;
  /** Admin-facing name for the existing `isPromoted` column. */
  isFeatured?: boolean;
  isPromoted?: boolean;
}

export interface ResolveEscrowInput {
  resolution: 'release' | 'refund';
  note?: string;
}

/**
 * The shape every admin list endpoint returns: `{ data, meta }`. Declared here
 * because this module had no shared pagination type.
 */
export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ListQuery {
  status?: string;
  type?: string;
  isActive?: boolean;
  search?: string;
  limit?: number;
}

function cleanParams(query: ListQuery = {}) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

/** Consistent user-facing error text for every admin action. */
export function adminErrorMessage(error: any, fallback: string): string {
  const status = error?.response?.status;
  if (status === 401) return 'Your session has expired — sign in again.';
  if (status === 403) {
    return (
      error?.response?.data?.message ||
      'Admin access required. Set isAdmin on this account or add its email to ADMIN_EMAILS on the backend.'
    );
  }
  return error?.response?.data?.message || fallback;
}


export interface AdminCategory {
  _id: string;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminService {
  _id: string;
  title: string;
  description?: string;
  priceType?: string;
  price?: number;
  durationMinutes?: number;
  bufferMinutes?: number;
  isActive: boolean;
  isRemote?: boolean;
  location?: string;
  images?: string[];
  tags?: string[];
  totalBookings?: number;
  category?: { _id: string; name: string; icon?: string } | string;
  providerId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    university?: string;
    hostel?: string;
    level?: string;
    rating?: number;
    providerProfile?: {
      headline?: string;
      bio?: string;
      skills?: string[];
      serviceArea?: string;
      isAcceptingBookings?: boolean;
    };
  } | string;
  createdAt?: string;
}

export interface AdminBooking {
  _id: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status: string;
  amount?: number;
  notes?: string;
  meetingUrl?: string;
  chatId?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  serviceId?: {
    _id?: string;
    title?: string;
    images?: string[];
    price?: number;
    priceType?: string;
    durationMinutes?: number;
    isRemote?: boolean;
  } | string;
  providerId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    whatsappNumber?: string;
  } | string;
  customerId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    whatsappNumber?: string;
  } | string;
  createdAt?: string;
}

export interface AdminProvider {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  university?: string;
  hostel?: string;
  level?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  serviceArea?: string;
  isAcceptingBookings?: boolean;
  isVerified?: boolean;
  services?: number;
  bookings?: number;
  rating?: number;
  counts?: {
    services?: number;
    activeServices?: number;
    bookings?: number;
    completedBookings?: number;
    upcomingBookings?: number;
  };
  createdAt?: string;
}

export const adminManagementApi = {
  /** GET /admin/stats */
  getStats: () => GATEWAY_ENDPOINT_WITH_AUTH.get<AdminStats>('/admin/stats'),

  /** GET /admin/users */
  listUsers: () => GATEWAY_ENDPOINT_WITH_AUTH.get<AdminUser[]>('/admin/users'),

  /** GET /admin/users/:id — account + listings + escrows + withdrawals */
  getUser: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<AdminUserDetail>(`/admin/users/${id}`),

  /** PATCH /admin/users/:id — whitelisted flags only */
  updateUser: (id: string, payload: AdminUserUpdate) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminUser>(`/admin/users/${id}`, payload),

  /** DELETE /admin/users/:id — hard delete, refused while funds/trades are in flight */
  deleteUser: (id: string, reason?: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/users/${id}`, {
      data: reason ? { reason } : {},
    }),

  /** GET /admin/items — every listing, including inactive ones */
  listItems: (query: ListQuery = {}) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<AdminItem[]>('/admin/items', {
      params: cleanParams(query),
    }),

  /** PATCH /admin/items/:id — status / isActive / isFeatured */
  updateItem: (id: string, payload: AdminItemUpdate) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminItem>(`/admin/items/${id}`, payload),

  /** DELETE /admin/items/:id */
  deleteItem: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/items/${id}`),

  /** GET /admin/escrows — enriched with buyer/seller/item summaries */
  listEscrows: (query: ListQuery = {}) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<AdminEscrow[]>('/admin/escrows', {
      params: cleanParams(query),
    }),

  /**
   * PATCH /admin/escrows/:id/resolve
   * Release pays the seller; refund credits the buyer's wallet.
   */
  resolveEscrow: (id: string, payload: ResolveEscrowInput) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminEscrow>(`/admin/escrows/${id}/resolve`, payload),

  // ── Services & bookings (services vertical) ───────────────────────────────
  listServices: (query: ListQuery = {}) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<Paginated<AdminService>>('/admin/services', {
      params: cleanParams(query),
    }),

  moderateService: (id: string, payload: { isActive: boolean }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminService>(`/admin/services/${id}`, payload),

  deleteService: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/services/${id}`),

  listBookings: (query: ListQuery = {}) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<Paginated<AdminBooking>>('/admin/bookings', {
      params: cleanParams(query),
    }),

  updateBookingStatus: (id: string, payload: { status: string; reason?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminBooking>(`/admin/bookings/${id}/status`, payload),

  listProviders: (query: ListQuery = {}) =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<Paginated<AdminProvider>>('/admin/providers', {
      params: cleanParams(query),
    }),

  updateProvider: (id: string, payload: { isAcceptingBookings?: boolean; isServiceProvider?: boolean }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminProvider>(`/admin/providers/${id}`, payload),

  // ── Categories ─────────────────────────────────────────────────────────────
  listCategories: () =>
    GATEWAY_ENDPOINT_WITH_AUTH.get<AdminCategory[]>('/categories'),

  createCategory: (payload: { name: string; icon?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.post<AdminCategory>('/categories', payload),

  updateCategory: (id: string, payload: { name?: string; icon?: string }) =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch<AdminCategory>(`/categories/${id}`, payload),

  deleteCategory: (id: string) =>
    GATEWAY_ENDPOINT_WITH_AUTH.delete(`/categories/${id}`),
};

export default adminManagementApi;
