<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">User Management</h2>
        <p class="text-sm text-slate-500 mt-1">Manage platform users, permissions, and statuses.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center">
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
          <select class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Fetching users...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Users class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No users found</h3>
          <p class="text-slate-500 text-sm max-w-sm">We couldn't find any users matching your criteria. Try adjusting your search filters.</p>
          <button @click="searchQuery = ''" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Search</button>
        </div>
        
        <!-- Data Table -->
        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">User</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full bg-slate-200 object-cover" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || ''))}&background=random`" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-xs text-slate-500 font-medium">Joined {{ new Date(user.createdAt || Date.now()).toLocaleDateString() }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-700 font-medium">{{ user.email }}</div>
                <div class="text-xs text-slate-500">{{ user.phone || 'No phone provided' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.isVerified" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-3 h-3 mr-1" />
                  Verified
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  <AlertCircle class="w-3 h-3 mr-1" />
                  Unverified
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(user._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === user._id" class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50">
                    <div class="p-1">
                      <button @click="viewDetails(user); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Eye class="w-4 h-4 mr-2 text-slate-400" /> View Details
                      </button>
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <MessageSquare class="w-4 h-4 mr-2 text-slate-400" /> Send Message
                      </button>
                    </div>
                    <div class="p-1">
                      <button @click="toggleBan(user); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">
                        <ShieldAlert class="w-4 h-4 mr-2 text-red-400" /> Ban User
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
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredUsers.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredUsers.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200">
          <h3 class="text-lg font-bold text-slate-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-slate-500 text-sm mb-6">{{ modalMessage }}</p>
          <div class="flex gap-3 justify-end">
            <button @click="showModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button @click="executeModalAction" class="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">Confirm</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Search, Download, Loader2, Users, CheckCircle2, AlertCircle, Eye, ShieldAlert, MoreVertical, MessageSquare } from 'lucide-vue-next';

const users = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');

// Dropdown State
const activeDropdown = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

// Close dropdowns on outside click
const closeDropdowns = () => {
  activeDropdown.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

// Modal State
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const pendingAction = ref<(() => void) | null>(null);

const filteredUsers = computed(() => {
  let result = users.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(u => 
      (u.email || '').toLowerCase().includes(q) || 
      (u.firstName || '').toLowerCase().includes(q) || 
      (u.lastName || '').toLowerCase().includes(q)
    );
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const executeModalAction = () => {
  if (pendingAction.value) pendingAction.value();
  showModal.value = false;
};

const viewDetails = (user: any) => {
  modalTitle.value = 'User Details';
  modalMessage.value = `You are viewing details for ${user.firstName} ${user.lastName}. (Feature coming soon)`;
  pendingAction.value = () => {}; // no-op
  showModal.value = true;
};

const toggleBan = (user: any) => {
  modalTitle.value = 'Ban User';
  modalMessage.value = `Are you sure you want to ban ${user.firstName}? This will restrict their access to the platform.`;
  pendingAction.value = () => {
    // mock ban logic
    user.isVerified = false; // mock effect
  };
  showModal.value = true;
};

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3005/api/v1/users/admin/all');
    if (response.ok) {
      users.value = await response.json();
    } else {
      // Mock data for demo if API fails
      users.value = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', isVerified: true, phone: '+1234567890', createdAt: new Date().toISOString() },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', isVerified: false, phone: '+0987654321', createdAt: new Date().toISOString() }
      ];
    }
  } catch (err) {
    console.error(err);
    // Mock data for demo
    users.value = [
      { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', isVerified: true, phone: '+1234567890', createdAt: new Date().toISOString() },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', isVerified: false, phone: '+0987654321', createdAt: new Date().toISOString() }
    ];
  } finally {
    loading.value = false;
  }
});
</script>