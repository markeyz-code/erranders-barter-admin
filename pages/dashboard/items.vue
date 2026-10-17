<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Marketplace Moderation</h2>
        <p class="text-sm text-slate-500 mt-1">Review every listing — including hidden ones — and moderate visibility and promotion.</p>
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
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center bg-slate-50/50">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Search listings by title, description or location..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[280px]" v-model="searchQuery" />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select v-model="statusFilter" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="completed">Completed</option>
          </select>
          <select v-model="visibilityFilter" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white">
            <option value="all">Visible & hidden</option>
            <option value="visible">Visible only</option>
            <option value="hidden">Hidden only</option>
            <option value="featured">Featured only</option>
          </select>
        </div>
      </div>

      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Syncing live marketplace data...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load listings</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchData" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No listings found</h3>
          <p class="text-slate-500 text-sm max-w-sm">
            {{ items.length === 0 ? 'No listings exist in the database yet.' : 'No listings match your current search and filters.' }}
          </p>
          <button v-if="searchQuery || statusFilter !== 'all' || visibilityFilter !== 'all'" @click="resetFilters" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filters</button>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Item Details</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Seller</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Type / Value</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="item in paginatedItems" :key="item._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-4 sm:px-6 py-4">
                <div class="flex items-center">
                  <div class="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img v-if="item.images && item.images.length" class="h-12 w-12 object-cover" :src="item.images[0]" :alt="item.title">
                    <div v-else class="h-full w-full flex items-center justify-center"><Image class="w-5 h-5 text-slate-400" /></div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900 max-w-[240px] truncate">{{ item.title || 'Untitled' }}</div>
                    <div class="text-sm text-slate-500 max-w-[240px] truncate">{{ item.description || 'No description' }}</div>
                    <div class="text-xs text-slate-400 flex items-center mt-1"><MapPin class="w-3 h-3 mr-1" /> {{ item.location || '—' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-slate-700">{{ sellerName(item) }}</div>
                <div class="text-slate-400 text-xs">{{ sellerEmail(item) }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-md text-sm font-bold uppercase tracking-wider"
                  :class="{
                    'bg-blue-100 text-blue-700': item.type === 'sell',
                    'bg-purple-100 text-purple-700': item.type === 'swap',
                    'bg-teal-100 text-teal-700': item.type === 'service'
                  }">
                  {{ item.type || '—' }}
                </span>
                <div class="text-sm font-black text-slate-900 mt-1" v-if="item.price">₦{{ Number(item.price).toLocaleString() }}</div>
                <div class="text-sm text-slate-500 mt-1 truncate max-w-[150px]" v-if="item.swapPreference">Wants: {{ item.swapPreference }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border" :class="statusClass(item.status)">
                    {{ item.status || 'unknown' }}
                  </span>
                  <span v-if="item.isActive === false" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <EyeOff class="w-3 h-3 mr-1" /> Hidden
                  </span>
                  <span v-if="item.isPromoted" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Star class="w-3 h-3 mr-1" /> Featured
                  </span>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(item._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40" :disabled="busyId === item._id" aria-label="Listing actions">
                    <Loader2 v-if="busyId === item._id" class="w-4 h-4 animate-spin" />
                    <MoreVertical v-else class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === item._id" class="absolute right-0 mt-2 w-52 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div class="p-1">
                      <button @click="toggleActive(item); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <component :is="item.isActive === false ? Eye : EyeOff" class="w-4 h-4 mr-2 text-slate-400" />
                        {{ item.isActive === false ? 'Reactivate listing' : 'Deactivate listing' }}
                      </button>
                      <button @click="toggleFeatured(item); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <component :is="item.isPromoted ? StarOff : Star" class="w-4 h-4 mr-2 text-slate-400" />
                        {{ item.isPromoted ? 'Remove from featured' : 'Feature listing' }}
                      </button>
                      <div class="h-px bg-slate-100 my-1"></div>
                      <button @click="askRemove(item); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 class="w-4 h-4 mr-2" /> Remove listing
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredItems.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredItems.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :open="!!itemToRemove"
      title="Remove this listing?"
      :message="itemToRemove ? `“${itemToRemove.title || 'Untitled'}” will be permanently deleted. Listings with money held in escrow or an accepted trade are refused by the API.` : ''"
      confirm-label="Remove listing"
      busy-label="Removing…"
      tone="danger"
      :busy="removeBusy"
      :error="removeError"
      @cancel="closeRemove"
      @confirm="confirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import ConfirmModal from '~/components/ConfirmModal.vue';
import {
  adminManagementApi,
  adminErrorMessage,
  type AdminItem,
  type AdminItemUpdate,
} from '~/api_factory/modules/adminManagement';
import { useCustomToast } from '~/composables/core/useCustomToast';
import {
  Search, Loader2, ShoppingBag, MapPin, Image, RefreshCw, AlertCircle,
  MoreVertical, Eye, EyeOff, Star, StarOff, Trash2,
} from 'lucide-vue-next';

const items = ref<AdminItem[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref('all');
const visibilityFilter = ref('all');
const activeDropdown = ref<string | null>(null);
const busyId = ref('');
const { showToast } = useCustomToast();

const itemToRemove = ref<AdminItem | null>(null);
const removeBusy = ref(false);
const removeError = ref('');

const currentPage = ref(1);
const itemsPerPage = 10;

const filteredItems = computed(() => {
  let result = items.value;

  if (statusFilter.value !== 'all') result = result.filter((item) => item.status === statusFilter.value);
  if (visibilityFilter.value === 'visible') result = result.filter((item) => item.isActive !== false);
  if (visibilityFilter.value === 'hidden') result = result.filter((item) => item.isActive === false);
  if (visibilityFilter.value === 'featured') result = result.filter((item) => item.isPromoted === true);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        (item.title || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query),
    );
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

watch([searchQuery, statusFilter, visibilityFilter], () => {
  currentPage.value = 1;
});

const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
  visibilityFilter.value = 'all';
};

const statusClass = (status?: string) => {
  if (status === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
  if (status === 'sold') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (status === 'completed') return 'bg-slate-100 text-slate-600 border-slate-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const sellerOf = (item: AdminItem) =>
  typeof item.sellerId === 'object' && item.sellerId ? item.sellerId : null;

const sellerName = (item: AdminItem) => {
  const seller = sellerOf(item);
  if (!seller) return 'Unknown seller';
  const full = `${seller.firstName || ''} ${seller.lastName || ''}`.trim();
  return full || seller.email || 'Unknown seller';
};

const sellerEmail = (item: AdminItem) => sellerOf(item)?.email || '—';

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const replaceItem = (updated: AdminItem) => {
  const index = items.value.findIndex((item) => item._id === updated._id);
  if (index !== -1) items.value[index] = updated;
};

const applyUpdate = async (item: AdminItem, payload: AdminItemUpdate, successMessage: string) => {
  busyId.value = item._id;
  error.value = '';
  try {
    const { data } = await adminManagementApi.updateItem(item._id, payload);
    replaceItem(data);
    showToast({ title: 'Listing updated', message: successMessage, toastType: 'success' });
  } catch (err: any) {
    showToast({
      title: 'Listing not updated',
      message: adminErrorMessage(err, 'The listing could not be updated.'),
      toastType: 'error',
    });
  } finally {
    busyId.value = '';
  }
};

const toggleActive = async (item: AdminItem) => {
  const hide = item.isActive !== false;
  await applyUpdate(
    item,
    { isActive: !hide },
    hide ? 'Listing hidden from the marketplace.' : 'Listing is visible again.',
  );
};

const toggleFeatured = async (item: AdminItem) => {
  const feature = !item.isPromoted;
  await applyUpdate(
    item,
    { isFeatured: feature },
    feature ? 'Listing is now featured.' : 'Listing removed from featured.',
  );
};

const askRemove = (item: AdminItem) => {
  removeError.value = '';
  itemToRemove.value = item;
};

const closeRemove = () => {
  if (removeBusy.value) return;
  itemToRemove.value = null;
  removeError.value = '';
};

const confirmRemove = async () => {
  const item = itemToRemove.value;
  if (!item || removeBusy.value) return;

  removeBusy.value = true;
  removeError.value = '';
  try {
    await adminManagementApi.deleteItem(item._id);
    items.value = items.value.filter((candidate) => candidate._id !== item._id);
    showToast({ title: 'Listing removed', message: 'The listing was deleted.', toastType: 'success' });
    itemToRemove.value = null;
  } catch (err: any) {
    removeError.value = adminErrorMessage(
      err,
      'The listing could not be removed. It may be part of an active trade.',
    );
  } finally {
    removeBusy.value = false;
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listItems();
    items.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value = adminErrorMessage(err, 'The marketplace API did not respond.');
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  fetchData();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>
