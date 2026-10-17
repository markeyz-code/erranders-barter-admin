<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Verify, suspend, promote and remove platform accounts.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center disabled:opacity-50"
          :disabled="!users.length"
          @click="exportUsers"
        >
          <Download class="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center bg-slate-50/50">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search users by email or name..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[280px]" v-model="searchQuery" />
        </div>

        <div class="flex items-center gap-2">
          <select v-model="statusFilter" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Fetching users...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load users</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchUsers" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Users class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No users found</h3>
          <p class="text-slate-500 text-sm max-w-sm">
            {{ users.length === 0 ? 'There are no registered users yet.' : "No users match your current search and status filters." }}
          </p>
          <button v-if="searchQuery || statusFilter !== 'all'" @click="clearFilters" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filters</button>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">User</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full bg-slate-200 object-cover" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userName(user))}&background=random`" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {{ userName(user) }}
                      <span v-if="isSelf(user)" class="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-100 rounded px-1.5 py-0.5">You</span>
                    </div>
                    <div class="text-sm text-slate-500 font-medium">
                      {{ user.createdAt ? 'Joined ' + formatDate(user.createdAt) : 'Join date unavailable' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-700 font-medium">{{ user.email || '—' }}</div>
                <div class="text-sm text-slate-500">{{ user.whatsappNumber || 'No WhatsApp number provided' }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span v-if="user.isActive === false" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
                    <Ban class="w-3 h-3 mr-1" /> Suspended
                  </span>
                  <span v-else-if="user.isVerified" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 class="w-3 h-3 mr-1" /> Verified
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    <AlertCircle class="w-3 h-3 mr-1" /> Unverified
                  </span>
                  <span v-if="user.isAdmin" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    <Shield class="w-3 h-3 mr-1" /> Admin
                  </span>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(user._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" aria-label="User actions">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === user._id" class="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div class="p-1">
                      <button @click="openDetail(user); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Eye class="w-4 h-4 mr-2 text-slate-400" /> View details
                      </button>
                      <button @click="askAction('verify', user); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <component :is="user.isVerified ? UserX : UserCheck" class="w-4 h-4 mr-2 text-slate-400" />
                        {{ user.isVerified ? 'Remove verification' : 'Verify account' }}
                      </button>
                      <button
                        @click="askAction('suspend', user); activeDropdown = null"
                        class="w-full text-left flex items-center px-3 py-2 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        :class="user.isActive === false ? 'text-emerald-700 hover:bg-emerald-50' : 'text-amber-700 hover:bg-amber-50'"
                        :disabled="isSelf(user)"
                      >
                        <component :is="user.isActive === false ? CheckCircle2 : Ban" class="w-4 h-4 mr-2" />
                        {{ user.isActive === false ? 'Unsuspend account' : 'Suspend account' }}
                      </button>
                      <button
                        @click="askAction('admin', user); activeDropdown = null"
                        class="w-full text-left flex items-center px-3 py-2 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        :class="user.isAdmin ? 'text-slate-700 hover:bg-slate-50' : 'text-brand-700 hover:bg-brand-50'"
                        :disabled="isSelf(user)"
                      >
                        <component :is="user.isAdmin ? ShieldOff : Shield" class="w-4 h-4 mr-2" />
                        {{ user.isAdmin ? 'Revoke admin access' : 'Make admin' }}
                      </button>
                      <div class="h-px bg-slate-100 my-1"></div>
                      <button
                        @click="askAction('delete', user); activeDropdown = null"
                        class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="isSelf(user)"
                      >
                        <Trash2 class="w-4 h-4 mr-2" /> Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredUsers.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredUsers.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- User detail (GET /admin/users/:id) -->
    <Teleport to="body">
      <div v-if="selectedUser" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="closeDetail">
        <div class="bg-white rounded-2xl w-full max-w-3xl border border-slate-200 max-h-[90vh] flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <img class="h-12 w-12 rounded-full bg-slate-200 object-cover" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userName(selectedUser))}&background=random`" alt="" />
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-slate-900 truncate">{{ userName(selectedUser) }}</h3>
                <p class="text-sm text-slate-500 truncate">{{ selectedUser.email || '—' }}</p>
              </div>
            </div>
            <button @click="closeDetail" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-4 sm:p-6 overflow-y-auto">
            <div v-if="detailLoading" class="flex flex-col items-center justify-center py-16">
              <Loader2 class="animate-spin w-8 h-8 text-brand-600 mb-3" />
              <p class="text-sm text-slate-500">Loading account, listings and escrows…</p>
            </div>

            <div v-else-if="detailError" class="text-center py-12">
              <AlertCircle class="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p class="font-bold text-slate-900">Could not load this account</p>
              <p class="text-sm text-slate-500 mt-1">{{ detailError }}</p>
              <button class="mt-4 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl" @click="loadDetail(selectedUser._id)">Try again</button>
            </div>

            <div v-else-if="detail" class="space-y-6">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Wallet</p>
                  <p class="text-lg font-black text-slate-900 mt-1">{{ formatMoney(detail.counts.walletBalance) }}</p>
                </div>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Listings</p>
                  <p class="text-lg font-black text-slate-900 mt-1">{{ detail.counts.items }}</p>
                </div>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Escrows</p>
                  <p class="text-lg font-black text-slate-900 mt-1">{{ detail.counts.escrows }}</p>
                </div>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Active escrows</p>
                  <p class="text-lg font-black text-slate-900 mt-1">{{ detail.counts.activeEscrows }}</p>
                </div>
              </div>

              <dl class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Verification</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.isVerified ? 'Verified' : 'Unverified' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Account</dt>
                  <dd class="font-semibold" :class="detail.user.isActive === false ? 'text-red-600' : 'text-emerald-600'">{{ detail.user.isActive === false ? 'Suspended' : 'Active' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Admin</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.isAdmin ? 'Yes' : 'No' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">WhatsApp</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.whatsappNumber || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">University</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.university || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Hostel</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.hostel || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Level</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.level || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Rating</dt>
                  <dd class="font-semibold text-slate-900">{{ Number(detail.user.rating || 0).toFixed(1) }} / 5</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-500">Joined</dt>
                  <dd class="font-semibold text-slate-900">{{ detail.user.createdAt ? formatDate(detail.user.createdAt) : '—' }}</dd>
                </div>
              </dl>

              <div>
                <h4 class="text-sm font-bold text-slate-900 mb-2">Listings ({{ detail.counts.items }})</h4>
                <div v-if="detail.items.length === 0" class="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">This user has no listings.</div>
                <div v-else class="border border-slate-200 rounded-xl overflow-hidden">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="item in detail.items" :key="item._id">
                        <td class="px-3 py-2 font-medium text-slate-900">{{ item.title || 'Untitled' }}</td>
                        <td class="px-3 py-2 text-slate-500 whitespace-nowrap">{{ item.status || '—' }}</td>
                        <td class="px-3 py-2 text-slate-900 font-semibold text-right whitespace-nowrap">{{ formatMoney(item.price) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-900 mb-2">Escrows ({{ detail.counts.escrows }})</h4>
                <div v-if="detail.escrows.length === 0" class="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">This user has no escrow transactions.</div>
                <div v-else class="border border-slate-200 rounded-xl overflow-hidden">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="escrow in detail.escrows" :key="escrow._id">
                        <td class="px-3 py-2 text-slate-500 font-mono text-xs">{{ escrow._id.slice(-8) }}</td>
                        <td class="px-3 py-2 text-slate-500 whitespace-nowrap">{{ escrowRole(escrow) }}</td>
                        <td class="px-3 py-2 whitespace-nowrap">
                          <span class="px-2 py-0.5 rounded-full text-xs font-bold" :class="escrowStatusClass(escrow.status)">{{ escrowStatusLabel(escrow.status) }}</span>
                        </td>
                        <td class="px-3 py-2 text-slate-900 font-semibold text-right whitespace-nowrap">{{ formatMoney(escrow.amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-bold text-slate-900 mb-2">Withdrawals</h4>
                <div v-if="detail.withdrawals.length === 0" class="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">No withdrawal attempts.</div>
                <div v-else class="border border-slate-200 rounded-xl overflow-hidden">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="withdrawal in detail.withdrawals" :key="withdrawal._id">
                        <td class="px-3 py-2 font-mono text-xs text-slate-500">{{ withdrawal.reference || withdrawal._id.slice(-8) }}</td>
                        <td class="px-3 py-2 text-slate-500 whitespace-nowrap">{{ withdrawal.status || '—' }}</td>
                        <td class="px-3 py-2 text-slate-900 font-semibold text-right whitespace-nowrap">{{ formatMoney(withdrawal.amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-slate-100 flex justify-end">
            <button @click="closeDetail" class="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-xl transition-colors">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmModal
      :open="!!pendingAction"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-label="confirmLabel"
      :busy-label="confirmBusyLabel"
      :tone="pendingAction?.type === 'delete' || pendingAction?.type === 'suspend' ? 'danger' : 'primary'"
      :busy="actionBusy"
      :error="actionError"
      :show-reason="pendingAction?.type === 'delete'"
      reason-label="Deletion reason (optional)"
      reason-placeholder="Why is this account being deleted?"
      @cancel="closeAction"
      @confirm="runAction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import ConfirmModal from '~/components/ConfirmModal.vue';
import {
  adminManagementApi,
  adminErrorMessage,
  type AdminEscrow,
  type AdminUser,
  type AdminUserDetail,
} from '~/api_factory/modules/adminManagement';
import { usersApi } from '~/api_factory/modules/users';
import { useCustomToast } from '~/composables/core/useCustomToast';
import {
  Search, Download, Loader2, Users, CheckCircle2, AlertCircle, Eye,
  MoreVertical, X, UserCheck, UserX, Ban, Shield, ShieldOff, Trash2,
} from 'lucide-vue-next';

type ActionType = 'verify' | 'suspend' | 'admin' | 'delete';

const users = ref<AdminUser[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');
const currentUserId = ref('');

const selectedUser = ref<AdminUser | null>(null);
const detail = ref<AdminUserDetail | null>(null);
const detailLoading = ref(false);
const detailError = ref('');

const activeDropdown = ref<string | null>(null);
const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};
const closeDropdowns = () => {
  activeDropdown.value = null;
};

const pendingAction = ref<{ type: ActionType; user: AdminUser } | null>(null);
const actionBusy = ref(false);
const actionError = ref('');
const { showToast } = useCustomToast();

const currentPage = ref(1);
const itemsPerPage = 10;

const userName = (user: AdminUser) => {
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return full || user.email || 'Unknown user';
};

const isSelf = (user: AdminUser) => !!currentUserId.value && user._id === currentUserId.value;

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const formatMoney = (value?: number) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

const escrowStatusLabel = (status?: string) => {
  if (status === 'held_in_escrow') return 'Held';
  if (status === 'released') return 'Released';
  if (status === 'disputed') return 'Disputed';
  if (status === 'refunded') return 'Refunded';
  return status ? status.replace(/_/g, ' ') : 'Unknown';
};

const escrowStatusClass = (status?: string) => {
  if (status === 'released') return 'bg-emerald-50 text-emerald-700';
  if (status === 'disputed') return 'bg-red-50 text-red-700';
  if (status === 'refunded') return 'bg-blue-50 text-blue-700';
  if (status === 'held_in_escrow') return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

const escrowRole = (escrow: AdminEscrow) => {
  const id = selectedUser.value?._id;
  if (id && escrow.buyerId === id) return 'Buyer';
  if (id && escrow.sellerId === id) return 'Seller';
  return 'Party';
};

const filteredUsers = computed(() => {
  let result = users.value;

  if (statusFilter.value === 'verified') result = result.filter((user) => user.isVerified);
  if (statusFilter.value === 'unverified') result = result.filter((user) => !user.isVerified);
  if (statusFilter.value === 'active') result = result.filter((user) => user.isActive !== false);
  if (statusFilter.value === 'suspended') result = result.filter((user) => user.isActive === false);
  if (statusFilter.value === 'admin') result = result.filter((user) => user.isAdmin === true);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (user) =>
        (user.email || '').toLowerCase().includes(query) ||
        (user.firstName || '').toLowerCase().includes(query) ||
        (user.lastName || '').toLowerCase().includes(query),
    );
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);
const paginatedUsers = computed(() =>
  filteredUsers.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage,
  ),
);

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
};

const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listUsers();
    users.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value = adminErrorMessage(err, 'Could not load users. The API did not respond.');
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const replaceUser = (updated: AdminUser) => {
  const index = users.value.findIndex((user) => user._id === updated._id);
  if (index !== -1) users.value[index] = updated;
  if (selectedUser.value?._id === updated._id) selectedUser.value = updated;
};

const openDetail = async (user: AdminUser) => {
  selectedUser.value = user;
  await loadDetail(user._id);
};

const loadDetail = async (id: string) => {
  detailLoading.value = true;
  detailError.value = '';
  detail.value = null;
  try {
    const { data } = await adminManagementApi.getUser(id);
    detail.value = data;
  } catch (err: any) {
    detailError.value = adminErrorMessage(err, 'Could not load this account.');
  } finally {
    detailLoading.value = false;
  }
};

const closeDetail = () => {
  selectedUser.value = null;
  detail.value = null;
  detailError.value = '';
};

const askAction = (type: ActionType, user: AdminUser) => {
  actionError.value = '';
  pendingAction.value = { type, user };
};

const closeAction = () => {
  if (actionBusy.value) return;
  pendingAction.value = null;
  actionError.value = '';
};

const confirmTitle = computed(() => {
  const action = pendingAction.value;
  if (!action) return '';
  if (action.type === 'verify') return action.user.isVerified ? 'Remove verification?' : 'Verify this account?';
  if (action.type === 'suspend') return action.user.isActive === false ? 'Unsuspend this account?' : 'Suspend this account?';
  if (action.type === 'admin') return action.user.isAdmin ? 'Revoke admin access?' : 'Grant admin access?';
  return 'Delete this account?';
});

const confirmMessage = computed(() => {
  const action = pendingAction.value;
  if (!action) return '';
  const name = userName(action.user);
  if (action.type === 'verify') {
    return action.user.isVerified
      ? `${name} will lose the verified badge. They can be verified again at any time.`
      : `${name} will be marked as verified.`;
  }
  if (action.type === 'suspend') {
    return action.user.isActive === false
      ? `${name} will be able to sign in and use the platform again.`
      : `${name} will be blocked immediately: existing sessions stop working and they cannot sign in again.`;
  }
  if (action.type === 'admin') {
    return action.user.isAdmin
      ? `${name} will lose access to the /admin endpoints and this dashboard.`
      : `${name} will be able to use every /admin endpoint, including money-moving escrow resolutions.`;
  }
  return `${name} will be permanently deleted, along with their listings and chats. The deletion is refused while they have funds or trades in flight. Financial escrow records are retained.`;
});

const confirmLabel = computed(() => {
  const action = pendingAction.value;
  if (!action) return 'Confirm';
  if (action.type === 'verify') return action.user.isVerified ? 'Remove verification' : 'Verify account';
  if (action.type === 'suspend') return action.user.isActive === false ? 'Unsuspend' : 'Suspend account';
  if (action.type === 'admin') return action.user.isAdmin ? 'Revoke admin' : 'Grant admin';
  return 'Delete account';
});

const confirmBusyLabel = computed(() => {
  const action = pendingAction.value;
  if (!action) return 'Working…';
  if (action.type === 'delete') return 'Deleting…';
  if (action.type === 'suspend') return 'Updating…';
  return 'Saving…';
});

const runAction = async (reason: string) => {
  const action = pendingAction.value;
  if (!action || actionBusy.value) return;

  actionBusy.value = true;
  actionError.value = '';
  try {
    if (action.type === 'verify') {
      const { data } = await adminManagementApi.updateUser(action.user._id, {
        isVerified: !action.user.isVerified,
      });
      replaceUser(data);
      showToast({
        title: 'User updated',
        message: data.isVerified ? 'Account marked as verified.' : 'Verification removed.',
        toastType: 'success',
      });
    } else if (action.type === 'suspend') {
      const suspend = action.user.isActive !== false;
      const { data } = await adminManagementApi.updateUser(action.user._id, { isActive: !suspend });
      replaceUser(data);
      showToast({
        title: 'User updated',
        message: suspend ? 'Account suspended. Existing sessions are blocked.' : 'Account unsuspended.',
        toastType: 'success',
      });
    } else if (action.type === 'admin') {
      const { data } = await adminManagementApi.updateUser(action.user._id, {
        isAdmin: !action.user.isAdmin,
      });
      replaceUser(data);
      showToast({
        title: 'User updated',
        message: data.isAdmin ? 'Admin access granted.' : 'Admin access revoked.',
        toastType: 'success',
      });
    } else {
      const response = await adminManagementApi.deleteUser(action.user._id, reason);
      users.value = users.value.filter((user) => user._id !== action.user._id);
      if (selectedUser.value?._id === action.user._id) closeDetail();
      showToast({
        title: 'Account deleted',
        message: `${response.data?.deletedListings ?? 0} listing(s) removed; ${response.data?.retainedTransactions ?? 0} transaction(s) retained for the ledger.`,
        toastType: 'success',
      });
    }

    pendingAction.value = null;
    if (detail.value && selectedUser.value?._id === action.user._id && action.type !== 'delete') {
      await loadDetail(action.user._id);
    }
  } catch (err: any) {
    actionError.value = adminErrorMessage(err, 'The action could not be completed.');
  } finally {
    actionBusy.value = false;
  }
};

const exportUsers = () => {
  if (typeof window === 'undefined' || !filteredUsers.value.length) return;

  const header = [
    'First name', 'Last name', 'Email', 'WhatsApp', 'University', 'Hostel',
    'Level', 'Verified', 'Active', 'Admin', 'Rating', 'Wallet balance', 'Joined',
  ];
  const rows = filteredUsers.value.map((user) => [
    user.firstName,
    user.lastName,
    user.email,
    user.whatsappNumber,
    user.university,
    user.hostel,
    user.level,
    user.isVerified ? 'yes' : 'no',
    user.isActive === false ? 'no' : 'yes',
    user.isAdmin ? 'yes' : 'no',
    user.rating ?? 0,
    user.walletBalance ?? 0,
    user.createdAt ? new Date(user.createdAt).toISOString() : '',
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `barter-users-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  usersApi
    .getProfile()
    .then(({ data }) => {
      currentUserId.value = data?._id || '';
    })
    .catch(() => {});
  fetchUsers();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>
