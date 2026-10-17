<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Service bookings</h2>
      <p class="text-sm text-slate-500 mt-1">
        Every appointment booked through the services marketplace.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <select
          v-model="status"
          class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500"
          @change="load"
        >
          <option value="">All statuses</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ label(s) }}</option>
        </select>
        <p class="text-xs font-semibold text-slate-500">{{ meta.total }} booking(s)</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-56">
        <Loader2 class="animate-spin h-9 w-9 text-brand-600 mb-3" />
        <p class="text-slate-500 font-medium">Loading bookings…</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <AlertTriangle class="w-9 h-9 text-red-500 mb-3" />
        <p class="font-bold text-slate-900">Could not load bookings</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="rows.length === 0" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <CalendarDays class="w-9 h-9 text-slate-300 mb-3" />
        <p class="font-bold text-slate-900">No bookings yet</p>
        <p class="text-sm text-slate-500 mt-1">Nothing has been booked through the marketplace.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Service</th>
              <th class="text-left font-semibold px-4 py-3">When</th>
              <th class="text-left font-semibold px-4 py-3">Provider</th>
              <th class="text-left font-semibold px-4 py-3">Customer</th>
              <th class="text-left font-semibold px-4 py-3">Amount</th>
              <th class="text-left font-semibold px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in rows" :key="b._id" class="hover:bg-slate-50/60">
              <td class="px-4 py-3 font-semibold text-slate-900">{{ serviceTitle(b) }}</td>
              <td class="px-4 py-3 text-slate-600">
                <p>{{ b.date || '—' }}</p>
                <p class="text-xs text-slate-400">{{ b.startTime }}–{{ b.endTime }}</p>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ person(b.providerId) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ person(b.customerId) }}</td>
              <td class="px-4 py-3 font-semibold text-slate-700">
                {{ typeof b.amount === 'number' ? '₦' + b.amount.toLocaleString('en-NG') : '—' }}
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="statusClass(b.status)">
                  {{ label(b.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader2, AlertTriangle, CalendarDays } from 'lucide-vue-next';
import { adminManagementApi, type AdminBooking } from '~/api_factory/modules/adminManagement';

/** All service bookings, read-only. Resolution happens between the two parties. */

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'declined', 'no_show'];

const rows = ref<AdminBooking[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const status = ref('');

const label = (s: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const statusClass = (s: string) => {
  if (s === 'completed') return 'bg-emerald-50 text-emerald-700';
  if (s === 'confirmed') return 'bg-blue-50 text-blue-700';
  if (s === 'pending') return 'bg-amber-50 text-amber-700';
  if (s === 'cancelled' || s === 'declined' || s === 'no_show') return 'bg-red-50 text-red-700';
  return 'bg-slate-100 text-slate-600';
};

const person = (v: AdminBooking['providerId']) => {
  if (!v || typeof v !== 'object') return '—';
  return `${(v as any).firstName || ''} ${(v as any).lastName || ''}`.trim() || '—';
};

const serviceTitle = (b: AdminBooking) =>
  typeof b.serviceId === 'object' && b.serviceId ? (b.serviceId as any).title || 'Service' : 'Service';

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listBookings({
      limit: 100,
      status: status.value || undefined,
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

onMounted(load);
</script>
