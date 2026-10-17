<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Services</h2>
      <p class="text-sm text-slate-500 mt-1">
        Every service listed by a provider. Hide one to pull it from the marketplace without deleting
        the provider's record or their bookings.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <input
          v-model="search"
          type="text"
          placeholder="Search by title…"
          class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white min-w-[240px] focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
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

      <div v-else-if="rows.length === 0" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <Briefcase class="w-9 h-9 text-slate-300 mb-3" />
        <p class="font-bold text-slate-900">No services yet</p>
        <p class="text-sm text-slate-500 mt-1">Providers have not listed anything.</p>
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
              <th class="text-right font-semibold px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in rows" :key="s._id" class="hover:bg-slate-50/60">
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900">{{ s.title }}</p>
                <p class="text-xs text-slate-400">
                  {{ s.durationMinutes ? s.durationMinutes + ' min' : '' }}
                  <span v-if="s.isRemote">· remote</span>
                </p>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ providerName(s) }}</td>
              <td class="px-4 py-3 font-semibold text-slate-700">{{ price(s) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ s.totalBookings ?? 0 }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ s.isActive ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  :disabled="busyId === s._id"
                  @click="toggle(s)"
                >
                  {{ s.isActive ? 'Hide' : 'Publish' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Loader2, AlertTriangle, Briefcase } from 'lucide-vue-next';
import {
  adminManagementApi,
  type AdminService,
} from '~/api_factory/modules/adminManagement';

/**
 * Admin moderation for the services vertical. Everything is read from
 * `GET /admin/services`; there is no sample data.
 *
 * Only activate/deactivate is offered because that is what the backend supports —
 * a delete here would orphan the provider's existing bookings.
 */

const rows = ref<AdminService[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const search = ref('');

const providerName = (s: AdminService) => {
  const p = s.providerId;
  if (!p || typeof p !== 'object') return '—';
  return `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.email || '—';
};

const price = (s: AdminService) => {
  if (s.priceType === 'negotiable' || !s.price) return 'Negotiable';
  const base = `₦${Number(s.price).toLocaleString('en-NG')}`;
  return s.priceType === 'hourly' ? `${base}/hr` : base;
};

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listServices({ limit: 100, search: search.value || undefined });
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
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not update this service.';
  } finally {
    busyId.value = '';
  }
};

onMounted(load);
</script>
