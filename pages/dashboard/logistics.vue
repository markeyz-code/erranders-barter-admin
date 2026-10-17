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
                <div class="inline-flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                    :disabled="busyId === d._id"
                    @click="openEdit(d)"
                  >
                    Update
                  </button>
                  <button
                    v-if="d.status === 'failed'"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
                    :disabled="busyId === d._id"
                    @click="retry(d)"
                  >
                    {{ busyId === d._id ? 'Retrying…' : 'Retry' }}
                  </button>
                  <a
                    v-if="d.trackingUrl"
                    :href="d.trackingUrl"
                    target="_blank"
                    rel="noopener"
                    class="text-xs font-bold text-brand-700 hover:underline"
                  >
                    Track
                  </a>
                </div>
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

    <!-- Assign a rider / move the dispatch status (PATCH /logistics/deliveries/:id) -->
    <Teleport to="body">
      <div v-if="editing" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="!editBusy && closeEdit()">
        <div class="bg-white rounded-2xl w-full max-w-md border border-slate-200">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-slate-900">Update dispatch</h3>
              <p class="text-xs text-slate-500 mt-1 truncate">{{ editing.itemTitle || 'Barter trade' }} · {{ editing._id.slice(-8) }}</p>
            </div>
            <button @click="closeEdit" :disabled="editBusy" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-40">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form class="p-4 sm:p-6 space-y-4" @submit.prevent="saveEdit">
            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Delivery status</label>
              <select v-model="editForm.status" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                <option v-for="s in STATUSES" :key="s" :value="s">{{ labelFor(s) }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Rider name</label>
              <input v-model="editForm.riderName" type="text" placeholder="Who is carrying this delivery?" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Rider phone</label>
              <input v-model="editForm.riderPhone" type="tel" placeholder="080…" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Ops notes</label>
              <textarea v-model="editForm.notes" rows="2" placeholder="Anything the next operator should know…" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"></textarea>
            </div>

            <p class="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
              Setting the status to <strong>Assigned</strong> and adding a rider records the assignment. Moving to
              <strong>Delivered</strong> stamps the delivery time; <strong>Cancelled</strong> stamps the cancellation time.
            </p>

            <div v-if="editError" class="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2">
              <AlertTriangle class="w-4 h-4 mt-0.5 shrink-0" />
              <span>{{ editError }}</span>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeEdit" :disabled="editBusy" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
              <button type="submit" :disabled="editBusy" class="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                <Loader2 v-if="editBusy" class="w-4 h-4 animate-spin" />
                {{ editBusy ? 'Saving…' : 'Save dispatch' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  RefreshCw, Loader2, AlertTriangle, Truck,
  PackageCheck, Clock, XCircle, Activity, X,
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

// --- Rider assignment / status update -------------------------------------
const editing = ref<Dispatch | null>(null);
const editBusy = ref(false);
const editError = ref('');
const editForm = ref({
  status: 'pending' as DispatchStatus,
  riderName: '',
  riderPhone: '',
  notes: '',
});

const openEdit = (d: Dispatch) => {
  editing.value = d;
  editError.value = '';
  editForm.value = {
    status: d.status,
    riderName: d.riderName || '',
    riderPhone: d.riderPhone || '',
    notes: d.notes || '',
  };
};

const closeEdit = () => {
  if (editBusy.value) return;
  editing.value = null;
  editError.value = '';
};

const saveEdit = async () => {
  const dispatch = editing.value;
  if (!dispatch || editBusy.value) return;

  editBusy.value = true;
  editError.value = '';
  try {
    const { data } = await logisticsApi.update(dispatch._id, {
      status: editForm.value.status,
      riderName: editForm.value.riderName.trim(),
      riderPhone: editForm.value.riderPhone.trim(),
      notes: editForm.value.notes.trim(),
    });

    const index = deliveries.value.findIndex((candidate) => candidate._id === dispatch._id);
    if (index !== -1) deliveries.value[index] = data;

    editing.value = null;
    // Refresh the counters without blocking the table on a second list call.
    logisticsApi
      .stats()
      .then(({ data: statsData }) => { stats.value = statsData; })
      .catch(() => {});
  } catch (err: any) {
    editError.value = err?.response?.data?.message || 'Could not update this dispatch.';
  } finally {
    editBusy.value = false;
  }
};

onMounted(() => void load());
</script>
