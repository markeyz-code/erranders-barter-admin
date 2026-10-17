<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Logistics</h2>
        <p class="text-sm text-slate-500 mt-1">
          Barter delivery dispatches sent to the Erranders rider network.
        </p>
      </div>
      <button
        class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center"
        @click="load()"
        :disabled="loading"
      >
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <!-- Stats — real counters from GET /logistics/stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in statCards" :key="card.label" class="bg-white rounded-2xl border border-slate-200 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="card.tint">
            <component :is="card.icon" class="w-5 h-5" :class="card.iconColor" />
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900 leading-none">{{ card.value }}</p>
            <p class="text-xs font-semibold text-slate-500 mt-1">{{ card.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="statsError" class="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-center justify-between gap-3">
      <p class="text-sm font-medium">{{ statsError }}</p>
      <button class="text-sm font-bold underline shrink-0" @click="load()">Retry</button>
    </div>

    <!-- Deliveries -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <select
          v-model="statusFilter"
          class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 bg-white"
          @change="load()"
        >
          <option value="">All statuses</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ labelFor(s) }}</option>
        </select>
        <p class="text-xs font-semibold text-slate-500">
          {{ meta.total }} {{ meta.total === 1 ? 'dispatch' : 'dispatches' }}
        </p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
        <p class="text-slate-500 font-medium">Loading dispatches…</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle class="w-8 h-8 text-red-500" />
        </div>
        <p class="font-bold text-slate-900">Could not load dispatches</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold text-sm" @click="load()">
          Try again
        </button>
      </div>

      <div v-else-if="deliveries.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Truck class="w-8 h-8 text-slate-400" />
        </div>
        <p class="font-bold text-slate-900">No dispatches yet</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">
          A dispatch is created when a barter trade needs a rider. Nothing has been sent to the network so far.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Item</th>
              <th class="text-left font-semibold px-4 py-3">Route</th>
              <th class="text-left font-semibold px-4 py-3">Status</th>
              <th class="text-left font-semibold px-4 py-3">Rider</th>
              <th class="text-left font-semibold px-4 py-3">Created</th>
              <th class="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="d in deliveries" :key="d._id" class="hover:bg-slate-50/60">
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900">{{ d.itemTitle || 'Barter trade' }}</p>
                <p class="text-xs text-slate-400 font-mono">{{ d._id.slice(-8) }}</p>
              </td>
              <td class="px-4 py-3 text-slate-600">
                <p>{{ d.pickupLocation || '—' }}</p>
                <p class="text-xs text-slate-400">to {{ d.dropoffLocation || '—' }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="statusClass(d.status)">
                  {{ labelFor(d.status) }}
                </span>
                <!-- A failed dispatch always says WHY, rather than just going red. -->
                <p v-if="d.status === 'failed' && d.lastError" class="text-xs text-red-500 mt-1 max-w-[220px]">
                  {{ d.lastError }}
                </p>
              </td>
              <td class="px-4 py-3 text-slate-600">
                <p v-if="d.riderName">{{ d.riderName }}</p>
                <p v-else class="text-slate-400">Unassigned</p>
                <p v-if="d.riderPhone" class="text-xs text-slate-400">{{ d.riderPhone }}</p>
              </td>
              <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ formatDate(d.createdAt) }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="d.status === 'failed'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
                  :disabled="busyId === d._id"
                  @click="retry(d)"
                >
                  {{ busyId === d._id ? 'Retrying…' : 'Retry' }}
                </button>
                <a
                  v-else-if="d.trackingUrl"
                  :href="d.trackingUrl"
                  target="_blank"
                  rel="noopener"
                  class="text-xs font-bold text-brand-700 hover:underline"
                >
                  Track
                </a>
                <span v-else class="text-xs text-slate-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="meta.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-slate-100">
        <button
          class="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 disabled:opacity-40"
          :disabled="meta.page <= 1"
          @click="goToPage(meta.page - 1)"
        >
          Previous
        </button>
        <p class="text-xs font-semibold text-slate-500">Page {{ meta.page }} of {{ meta.totalPages }}</p>
        <button
          class="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 disabled:opacity-40"
          :disabled="meta.page >= meta.totalPages"
          @click="goToPage(meta.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  RefreshCw, Loader2, AlertTriangle, Truck,
  PackageCheck, Clock, XCircle, Activity,
} from 'lucide-vue-next';
import { logisticsApi, type Dispatch, type DispatchStatus, type DispatchStats } from '~/api_factory/modules/logistics';

/**
 * This page was a 19-line STATIC MOCKUP — no <script> block at all. It rendered
 * "Currently tracking 18 automated Erranders dispatches" and a fake
 * "Dispatch #ER-8842" regardless of the database, because the backend service
 * behind it was orphaned (no controller, no module, unregistered).
 *
 * It now reads the real logistics API.
 */

const STATUSES: DispatchStatus[] = [
  'pending', 'dispatched', 'assigned', 'in_transit', 'delivered', 'cancelled', 'failed',
];

const deliveries = ref<Dispatch[]>([]);
const stats = ref<DispatchStats | null>(null);
const statsError = ref('');
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const statusFilter = ref<DispatchStatus | ''>('');
const meta = ref({ total: 0, page: 1, limit: 20, totalPages: 1 });

// A failed stats call shows an em dash, never a fabricated zero.
const statValue = (value?: number) => (stats.value ? value ?? 0 : '—');

const statCards = computed(() => [
  {
    label: 'Total dispatches',
    value: statValue(stats.value?.total),
    icon: PackageCheck,
    tint: 'bg-brand-50',
    iconColor: 'text-brand-600',
  },
  { label: 'In progress', value: statValue(stats.value?.active), icon: Activity, tint: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Failed', value: statValue(stats.value?.failed), icon: XCircle, tint: 'bg-red-50', iconColor: 'text-red-600' },
  { label: 'Last 24 hours', value: statValue(stats.value?.last24h), icon: Clock, tint: 'bg-amber-50', iconColor: 'text-amber-600' },
]);

const labelFor = (s: string) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const statusClass = (s: string) => {
  if (s === 'delivered') return 'bg-emerald-50 text-emerald-700';
  if (s === 'failed' || s === 'cancelled') return 'bg-red-50 text-red-700';
  if (s === 'in_transit' || s === 'assigned') return 'bg-blue-50 text-blue-700';
  if (s === 'dispatched') return 'bg-indigo-50 text-indigo-700';
  return 'bg-slate-100 text-slate-600';
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const load = async (page = 1) => {
  loading.value = true;
  error.value = '';
  statsError.value = '';

  // Stats can fail on its own without blanking the table — but it must say so,
  // not silently render zeroes.
  const [statsResult, listResult] = await Promise.allSettled([
    logisticsApi.stats(),
    logisticsApi.list({
      status: statusFilter.value || undefined,
      page,
      limit: meta.value.limit,
    }),
  ]);

  if (statsResult.status === 'fulfilled') {
    stats.value = statsResult.value.data;
  } else {
    stats.value = null;
    statsError.value =
      (statsResult.reason as any)?.response?.data?.message ||
      'Dispatch counters are unavailable right now.';
  }

  if (listResult.status === 'fulfilled') {
    const { data } = listResult.value;
    deliveries.value = data.data ?? [];
    meta.value = data.meta ?? meta.value;
  } else {
    const err: any = listResult.reason;
    error.value =
      err?.response?.status === 401
        ? 'Your session has expired — sign in again.'
        : err?.response?.data?.message || 'The logistics API did not respond.';
    deliveries.value = [];
  }

  loading.value = false;
};

const goToPage = (page: number) => {
  if (page < 1 || page > meta.value.totalPages) return;
  void load(page);
};

const retry = async (d: Dispatch) => {
  busyId.value = d._id;
  try {
    await logisticsApi.retry(d._id);
    await load(meta.value.page);
  } catch (err: any) {
    // Surface the reason instead of silently doing nothing.
    error.value = err?.response?.data?.message || 'Could not retry this dispatch.';
  } finally {
    busyId.value = '';
  }
};

onMounted(() => void load());
</script>
