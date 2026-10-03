<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Marketplace & Monetization</h2>
        <p class="text-sm text-slate-500 mt-1">Manage all Buy, Sell, and Swap listings. Automate fee collection and market integrity.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center">
          <Settings class="w-4 h-4 mr-2" />
          Automation Rules
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
        
        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No listings found</h3>
          <p class="text-slate-500 text-sm max-w-sm">There are no items matching your criteria in the live database.</p>
          <button @click="resetFilters" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filters</button>
        </div>
        
        <!-- Data Table -->
        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Item Details</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Type / Value</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Moderation</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="item in paginatedItems" :key="item._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img v-if="item.images && item.images.length" class="h-12 w-12 object-cover" :src="item.images[0]" :alt="item.title">
                    <div v-else class="h-full w-full flex items-center justify-center"><Image class="w-5 h-5 text-slate-400" /></div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900">{{ item.title }}</div>
                    <div class="text-xs text-slate-500 max-w-[200px] truncate">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                  :class="{
                    'bg-blue-100 text-blue-700': item.type === 'sell',
                    'bg-purple-100 text-purple-700': item.type === 'swap',
                    'bg-teal-100 text-teal-700': item.type === 'service'
                  }">
                  {{ item.type }}
                </span>
                <div class="text-sm font-black text-slate-900 mt-1" v-if="item.price">₦{{ item.price }}</div>
                <div class="text-xs text-slate-500 mt-1 truncate max-w-[150px]" v-if="item.swapPreference">Wants: {{ item.swapPreference }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                <div class="flex items-center"><MapPin class="w-3 h-3 mr-1 text-slate-400" /> {{ item.location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(item._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === item._id" class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50">
                    <div class="p-1">
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Eye class="w-4 h-4 mr-2 text-slate-400" /> View Listing
                      </button>
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Edit2 class="w-4 h-4 mr-2 text-slate-400" /> Edit Metadata
                      </button>
                    </div>
                    <div class="p-1">
                      <button @click="takeDownItem(item); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">
                        <Trash2 class="w-4 h-4 mr-2 text-red-400" /> Remove Listing
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
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredItems.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredItems.length }}</span> results</span>
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
import { Search, Loader2, ShoppingBag, MapPin, Image, Settings, Trash2, MoreVertical, Eye, Edit2 } from 'lucide-vue-next';

const items = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const filterType = ref('all');

// Dropdown State
const activeDropdown = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  fetchData();
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

const filteredItems = computed(() => {
  let result = items.value;
  if (filterType.value !== 'all') {
    result = result.filter(i => i.type === filterType.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(i => (i.title || '').toLowerCase().includes(q));
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const executeModalAction = () => {
  if (pendingAction.value) pendingAction.value();
  showModal.value = false;
};

const resetFilters = () => {
  searchQuery.value = '';
  filterType.value = 'all';
};

const takeDownItem = (item: any) => {
  modalTitle.value = 'Remove Listing';
  modalMessage.value = `Are you sure you want to remove "${item.title}" from the marketplace?`;
  pendingAction.value = () => {
    items.value = items.value.filter(i => i._id !== item._id);
  };
  showModal.value = true;
};

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3005/api/v1/items'); 
    if (response.ok) {
      const data = await response.json();
      items.value = data.data || data;
    } else {
      throw new Error("Endpoint protected or unavailable");
    }
  } catch (err) {
    console.warn("Using fallback seeded data representation due to CORS/Auth:", err);
    items.value = [
      { _id: '1', title: 'iPhone 13 Pro', description: 'Excellent condition, 256GB, Sierra Blue.', price: 700, type: 'sell', location: 'New York, NY', status: 'active', images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=2000&auto=format&fit=crop'] },
      { _id: '2', title: 'MacBook Air M1', description: 'Looking to swap for a gaming PC.', swapPreference: 'Gaming PC with RTX 3060 or better', type: 'swap', location: 'Austin, TX', status: 'active', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop'] },
      { _id: '3', title: 'Plumbing Services', description: 'Experienced plumber for home repairs.', price: 50, type: 'service', location: 'Chicago, IL', status: 'active', images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2000&auto=format&fit=crop'] },
      { _id: '4', title: 'Sony A7III Camera', description: 'Camera body only, lightly used.', price: 1200, type: 'sell', location: 'Seattle, WA', status: 'active', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop'] }
    ];
  } finally {
    loading.value = false;
  }
};
</script>
