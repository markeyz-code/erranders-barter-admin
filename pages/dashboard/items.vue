<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Marketplace & Monetization</h2>
        <p class="text-sm text-slate-500 mt-1">Manage all Buy, Sell, and Swap listings. Automate fee collection and market integrity.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center disabled:opacity-50"
          :disabled="loading"
          @click="fetchData"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search items by title..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[300px]" v-model="searchQuery" />
        </div>
        
        <div class="flex items-center gap-2">
          <select v-model="filterType" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="all">All Types</option>
            <option value="sell">Sell</option>
            <option value="swap">Swap</option>
            <option value="service">Services</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Syncing live marketplace data...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load listings</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchData" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No listings found</h3>
          <p class="text-slate-500 text-sm max-w-sm">
            {{ items.length === 0 ? 'No active listings exist in the database yet.' : 'No listings match your current search and type filters.' }}
          </p>
          <button v-if="searchQuery || filterType !== 'all'" @click="resetFilters" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filters</button>
        </div>
        
        <!-- Data Table -->
        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Item Details</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Type / Value</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="item in paginatedItems" :key="item._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img v-if="item.images && item.images.length" class="h-12 w-12 object-cover" :src="item.images[0]" :alt="item.title">
                    <div v-else class="h-full w-full flex items-center justify-center"><Image class="w-5 h-5 text-slate-400" /></div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900">{{ item.title }}</div>
                    <div class="text-sm text-slate-500 max-w-[200px] truncate">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-md text-sm font-bold uppercase tracking-wider"
                  :class="{
                    'bg-blue-100 text-blue-700': item.type === 'sell',
                    'bg-purple-100 text-purple-700': item.type === 'swap',
                    'bg-teal-100 text-teal-700': item.type === 'service'
                  }">
                  {{ item.type }}
                </span>
                <div class="text-sm font-black text-slate-900 mt-1" v-if="item.price">₦{{ Number(item.price).toLocaleString() }}</div>
                <div class="text-sm text-slate-500 mt-1 truncate max-w-[150px]" v-if="item.swapPreference">Wants: {{ item.swapPreference }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                <div class="flex items-center"><MapPin class="w-3 h-3 mr-1 text-slate-400" /> {{ item.location }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border" :class="statusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredItems.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredItems.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { itemsApi } from '~/api_factory/modules/items';
import { Search, Loader2, ShoppingBag, MapPin, Image, RefreshCw, AlertCircle } from 'lucide-vue-next';

const items = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const filterType = ref('all');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredItems = computed(() => {
  let result = items.value;
  if (filterType.value !== 'all') {
    result = result.filter((i) => i.type === filterType.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((i) => (i.title || '').toLowerCase().includes(q));
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);
const paginatedItems = computed(() =>
  filteredItems.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage,
  ),
);

watch([searchQuery, filterType], () => {
  currentPage.value = 1;
});

const resetFilters = () => {
  searchQuery.value = '';
  filterType.value = 'all';
};

const statusClass = (status: string) => {
  if (status === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

/**
 * Reads the real public listing feed (`GET /items`). If the request fails the
 * page shows an error with retry — it never substitutes sample listings.
 */
const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await itemsApi.list({});
    items.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value =
      err?.response?.status === 401
        ? 'Your session has expired — sign in again.'
        : err?.response?.data?.message || 'The marketplace API did not respond.';
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
