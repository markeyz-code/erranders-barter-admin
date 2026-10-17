<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Manage platform users, permissions, and statuses.</p>
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
      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search users by email or name..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[300px]" v-model="searchQuery" />
        </div>
        
        <div class="flex items-center gap-2">
          <select v-model="statusFilter" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Fetching users...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load users</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchUsers" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <!-- Empty State -->
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
        
        <!-- Data Table -->
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
                    <img class="h-10 w-10 rounded-full bg-slate-200 object-cover" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || ''))}&background=random`" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-sm text-slate-500 font-medium">
                      {{ user.createdAt ? 'Joined ' + new Date(user.createdAt).toLocaleDateString() : 'Join date unavailable' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-700 font-medium">{{ user.email }}</div>
                <div class="text-sm text-slate-500">{{ user.whatsappNumber || 'No WhatsApp number provided' }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span v-if="user.isVerified" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-3 h-3 mr-1" />
                  Verified
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  <AlertCircle class="w-3 h-3 mr-1" />
                  Unverified
                </span>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(user._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === user._id" class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div class="p-1">
                      <button @click="viewDetails(user); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Eye class="w-4 h-4 mr-2 text-slate-400" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredUsers.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredUsers.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- User Details Modal (real fields from the API response) -->
    <Teleport to="body">
      <div v-if="selectedUser" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click.self="selectedUser = null">
        <div class="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 border border-slate-200">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <img
                class="h-12 w-12 rounded-full bg-slate-200 object-cover"
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent((selectedUser.firstName || '') + ' ' + (selectedUser.lastName || ''))}&background=random`"
                alt=""
              />
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
                <p class="text-sm text-slate-500">{{ selectedUser.email }}</p>
              </div>
            </div>
            <button @click="selectedUser = null" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <dl class="divide-y divide-slate-100 text-sm">
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Status</dt>
              <dd class="font-semibold" :class="selectedUser.isVerified ? 'text-emerald-600' : 'text-amber-600'">
                {{ selectedUser.isVerified ? 'Verified' : 'Unverified' }}
              </dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">WhatsApp</dt>
              <dd class="font-semibold text-slate-900">{{ selectedUser.whatsappNumber || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">University</dt>
              <dd class="font-semibold text-slate-900">{{ selectedUser.university || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Hostel</dt>
              <dd class="font-semibold text-slate-900">{{ selectedUser.hostel || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Level</dt>
              <dd class="font-semibold text-slate-900">{{ selectedUser.level || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Rating</dt>
              <dd class="font-semibold text-slate-900">{{ Number(selectedUser.rating || 0).toFixed(1) }} / 5</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Wallet balance</dt>
              <dd class="font-semibold text-slate-900">₦{{ Number(selectedUser.walletBalance || 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Joined</dt>
              <dd class="font-semibold text-slate-900">{{ selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '—' }}</dd>
            </div>
          </dl>

          <div class="flex justify-end pt-4">
            <button @click="selectedUser = null" class="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-xl transition-colors">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { adminApi } from '~/api_factory/modules/admin';
import {
  Search, Download, Loader2, Users, CheckCircle2, AlertCircle, Eye, MoreVertical, X,
} from 'lucide-vue-next';

const users = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');
const selectedUser = ref<any | null>(null);

// Dropdown state
const activeDropdown = ref<string | null>(null);
const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};
const closeDropdowns = () => {
  activeDropdown.value = null;
};

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredUsers = computed(() => {
  let result = users.value;

  if (statusFilter.value === 'verified') result = result.filter((u) => u.isVerified);
  if (statusFilter.value === 'unverified') result = result.filter((u) => !u.isVerified);

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (u) =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.firstName || '').toLowerCase().includes(q) ||
        (u.lastName || '').toLowerCase().includes(q),
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

const viewDetails = (user: any) => {
  // Shows the real fields returned by GET /users/admin/all.
  selectedUser.value = user;
};

const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminApi.getUsers();
    users.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value =
      err?.response?.status === 401
        ? 'Your session has expired — sign in again.'
        : err?.response?.data?.message || 'Could not load users. The API did not respond.';
  } finally {
    loading.value = false;
  }
};

const exportUsers = () => {
  if (typeof window === 'undefined' || !filteredUsers.value.length) return;

  const header = [
    'First name', 'Last name', 'Email', 'WhatsApp', 'University', 'Hostel',
    'Level', 'Verified', 'Rating', 'Wallet balance', 'Joined',
  ];
  const rows = filteredUsers.value.map((u) => [
    u.firstName,
    u.lastName,
    u.email,
    u.whatsappNumber,
    u.university,
    u.hostel,
    u.level,
    u.isVerified ? 'yes' : 'no',
    u.rating ?? 0,
    u.walletBalance ?? 0,
    u.createdAt ? new Date(u.createdAt).toISOString() : '',
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
  fetchUsers();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>