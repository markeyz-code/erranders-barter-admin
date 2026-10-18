<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Services Marketplace</h2>
        <p class="text-sm text-slate-500 mt-1">
          Review, inspect, moderate and manage all skills and services listed by campus providers.
        </p>
      </div>
      <button
        class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 self-start sm:self-auto"
        @click="load"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="search"
              type="text"
              placeholder="Search by title, tags or location…"
              class="border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm bg-white min-w-[240px] focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              @keydown.enter="load"
            />
          </div>
          <select
            v-model="statusFilter"
            class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500"
            @change="load"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="hidden">Hidden only</option>
            <option value="remote">Remote only</option>
          </select>
        </div>
        <p class="text-xs font-semibold text-slate-500">{{ meta.total }} service(s)</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-56">
        <Loader2 class="animate-spin h-9 w-9 text-brand-600 mb-3" />
        <p class="text-slate-500 font-medium">Loading services…</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <AlertTriangle class="w-9 h-9 text-red-500 mb-3" />
        <p class="font-bold text-slate-900">Could not load services</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="filteredRows.length === 0" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <Briefcase class="w-9 h-9 text-slate-300 mb-3" />
        <p class="font-bold text-slate-900">No services found</p>
        <p class="text-sm text-slate-500 mt-1">
          {{ search || statusFilter !== 'all' ? 'Try adjusting your search and filter criteria.' : 'Providers have not listed any services yet.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Service</th>
              <th class="text-left font-semibold px-4 py-3">Provider</th>
              <th class="text-left font-semibold px-4 py-3">Price</th>
              <th class="text-left font-semibold px-4 py-3">Bookings</th>
              <th class="text-left font-semibold px-4 py-3">Status</th>
              <th class="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in filteredRows" :key="s._id" class="hover:bg-slate-50/60 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img v-if="s.images && s.images[0]" :src="s.images[0]" :alt="s.title" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                      <Briefcase class="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 hover:text-brand-600 cursor-pointer" @click="viewDetail(s)">
                      {{ s.title }}
                    </p>
                    <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{{ s.durationMinutes ? s.durationMinutes + ' min' : 'Flexible' }}</span>
                      <span v-if="s.isRemote" class="text-blue-600 font-semibold flex items-center gap-0.5">
                        <Video class="w-3 h-3" /> Remote
                      </span>
                      <span v-if="s.location" class="truncate max-w-[120px]">· {{ s.location }}</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-600">
                <p class="font-semibold text-slate-800">{{ providerName(s) }}</p>
                <p class="text-xs text-slate-400">{{ providerEmail(s) }}</p>
              </td>
              <td class="px-4 py-3 font-semibold text-slate-700">{{ price(s) }}</td>
              <td class="px-4 py-3 text-slate-600 font-bold">{{ s.totalBookings ?? 0 }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ s.isActive ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="inline-flex items-center gap-2">
                  <button
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
                    @click="viewDetail(s)"
                  >
                    View
                  </button>
                  <button
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    :disabled="busyId === s._id"
                    @click="toggle(s)"
                  >
                    {{ s.isActive ? 'Hide' : 'Publish' }}
                  </button>
                  <button
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40"
                    :disabled="busyId === s._id"
                    @click="askDelete(s)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <Teleport to="body">
      <div v-if="detailService" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-xl p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                :class="detailService.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ detailService.isActive ? 'Active Listing' : 'Hidden' }}
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-2">{{ detailService.title }}</h3>
            </div>
            <button @click="detailService = null" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="detailService.images?.length" class="mb-4 aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img :src="detailService.images[0]" :alt="detailService.title" class="w-full h-full object-cover" />
          </div>

          <div class="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl mb-4 text-xs">
            <div>
              <p class="font-bold text-slate-400 uppercase">Price</p>
              <p class="font-extrabold text-brand-600 text-sm mt-0.5">{{ price(detailService) }}</p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Duration & Buffer</p>
              <p class="font-bold text-slate-800 text-sm mt-0.5">
                {{ detailService.durationMinutes }}m <span v-if="detailService.bufferMinutes">+ {{ detailService.bufferMinutes }}m buffer</span>
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Delivery Mode</p>
              <p class="font-bold text-slate-800 mt-0.5">
                {{ detailService.isRemote ? 'Remote Video Call' : 'In-Person' }}
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Location</p>
              <p class="font-bold text-slate-800 mt-0.5">{{ detailService.location || 'Campus' }}</p>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase mb-1.5">Description</h4>
            <p class="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {{ detailService.description || 'No description provided.' }}
            </p>
          </div>

          <div v-if="detailService.tags?.length" class="mb-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase mb-1.5">Tags</h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="t in detailService.tags"
                :key="t"
                class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                #{{ t }}
              </span>
            </div>
          </div>

          <div class="p-3.5 border border-slate-200 rounded-xl mb-4 bg-slate-50/30 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700 shrink-0">
              {{ providerName(detailService).charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-slate-900 truncate">{{ providerName(detailService) }}</p>
              <p class="text-xs text-slate-500 truncate">{{ providerEmail(detailService) }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              class="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50"
              @click="toggle(detailService)"
            >
              {{ detailService.isActive ? 'Hide Service' : 'Activate Service' }}
            </button>
            <button
              class="px-4 py-2 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800"
              @click="detailService = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200 shadow-xl">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Delete Service</h3>
          <p class="text-slate-500 text-sm mb-6">
            Are you sure you want to permanently delete <strong class="text-slate-800">"{{ deleteTarget.title }}"</strong>?
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="deleteTarget = null" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl">
              Cancel
            </button>
            <button @click="executeDelete" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import {
  Loader2,
  AlertTriangle,
  Briefcase,
  Search,
  RefreshCw,
  Video,
  X,
} from 'lucide-vue-next';
import {
  adminManagementApi,
  type AdminService,
} from '~/api_factory/modules/adminManagement';

const rows = ref<AdminService[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const search = ref('');
const statusFilter = ref('all');

const detailService = ref<AdminService | null>(null);
const deleteTarget = ref<AdminService | null>(null);

const providerName = (s: AdminService) => {
  const p = s.providerId;
  if (!p || typeof p !== 'object') return '—';
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.email || '—';
};

const providerEmail = (s: AdminService) => {
  const p = s.providerId;
  if (!p || typeof p !== 'object') return '';
  return p.email || '';
};

const price = (s: AdminService) => {
  if (s.priceType === 'negotiable' || !s.price) return 'Negotiable';
  const base = `₦${Number(s.price).toLocaleString('en-NG')}`;
  if (s.priceType === 'hourly') return `${base}/hr`;
  if (s.priceType === 'per_minute') return `${base}/min`;
  return base;
};

const filteredRows = computed(() => {
  let list = rows.value;
  if (statusFilter.value === 'active') {
    list = list.filter((s) => s.isActive);
  } else if (statusFilter.value === 'hidden') {
    list = list.filter((s) => !s.isActive);
  } else if (statusFilter.value === 'remote') {
    list = list.filter((s) => s.isRemote);
  }
  return list;
});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listServices({
      limit: 100,
      search: search.value || undefined,
    });
    rows.value = data.data ?? [];
    meta.value = { total: data.meta?.total ?? rows.value.length };
  } catch (err: any) {
    error.value =
      err?.response?.status === 403
        ? 'Your account is not an admin.'
        : err?.response?.data?.message || 'The admin API did not respond.';
    rows.value = [];
  } finally {
    loading.value = false;
  }
};

const toggle = async (s: AdminService) => {
  busyId.value = s._id;
  try {
    const { data } = await adminManagementApi.moderateService(s._id, { isActive: !s.isActive });
    const idx = rows.value.findIndex((r) => r._id === s._id);
    if (idx >= 0) rows.value[idx] = data;
    if (detailService.value && detailService.value._id === s._id) {
      detailService.value.isActive = data.isActive;
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not update this service.';
  } finally {
    busyId.value = '';
  }
};

const viewDetail = (s: AdminService) => {
  detailService.value = s;
};

const askDelete = (s: AdminService) => {
  deleteTarget.value = s;
};

const executeDelete = async () => {
  if (!deleteTarget.value) return;
  const target = deleteTarget.value;
  deleteTarget.value = null;
  busyId.value = target._id;
  try {
    await adminManagementApi.deleteService(target._id);
    rows.value = rows.value.filter((r) => r._id !== target._id);
    meta.value.total--;
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Could not delete service');
  } finally {
    busyId.value = '';
  }
};

onMounted(load);
</script>
