<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Businesses</h2>
      <p class="text-sm text-slate-500 mt-1">
        Companies that run on Declutter — fumigation, laundry, moving crews. Each one has its own
        page, staff and recruitment. The commission you set here is what the platform keeps from
        every completed job.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <p class="text-xs font-semibold text-slate-500">{{ meta.total }} business(es)</p>
        <p class="text-xs font-semibold text-slate-400">Commission is charged on each completed job</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-56">
        <Loader2 class="animate-spin h-9 w-9 text-brand-600 mb-3" />
        <p class="text-slate-500 font-medium">Loading businesses…</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <AlertTriangle class="w-9 h-9 text-red-500 mb-3" />
        <p class="font-bold text-slate-900">Could not load businesses</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="rows.length === 0" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <Building2 class="w-9 h-9 text-slate-300 mb-3" />
        <p class="font-bold text-slate-900">No businesses yet</p>
        <p class="text-sm text-slate-500 mt-1">No company has signed up to run on Declutter.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Business</th>
              <th class="text-left font-semibold px-4 py-3">Owner</th>
              <th class="text-left font-semibold px-4 py-3">Team</th>
              <th class="text-left font-semibold px-4 py-3">Jobs</th>
              <th class="text-left font-semibold px-4 py-3">Gross</th>
              <th class="text-left font-semibold px-4 py-3">Commission</th>
              <th class="text-left font-semibold px-4 py-3">Status</th>
              <th class="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in rows" :key="b._id" class="hover:bg-slate-50/60">
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900">{{ b.name }}</p>
                <p class="text-xs text-slate-400">/{{ b.slug }} · {{ b.category }}</p>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ ownerName(b) }}</td>
              <td class="px-4 py-3 text-slate-600">
                {{ b.counts?.staff ?? 0 }} staff
                <span class="text-slate-400">· {{ b.counts?.openings ?? 0 }} roles</span>
              </td>
              <td class="px-4 py-3 text-slate-600 font-semibold">
                {{ b.counts?.completedBookings ?? 0 }}<span class="text-slate-400 font-normal">/{{ b.counts?.bookings ?? 0 }}</span>
              </td>
              <td class="px-4 py-3 text-slate-700 font-semibold">{{ naira(b.counts?.gross) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <input
                    v-model.number="drafts[b._id]"
                    type="number"
                    min="0"
                    max="50"
                    class="w-16 border border-slate-200 rounded-lg px-2 py-1 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
                  />
                  <span class="text-slate-400 text-xs font-bold">%</span>
                  <button
                    v-if="drafts[b._id] !== b.commissionRate"
                    class="ml-1 px-2 py-1 rounded-md bg-brand-600 text-white text-[11px] font-bold disabled:opacity-40"
                    :disabled="busyId === b._id"
                    @click="saveCommission(b)"
                  >
                    Save
                  </button>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-1">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold w-fit"
                    :class="b.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                  >
                    {{ b.isActive ? 'Active' : 'Paused' }}
                  </span>
                  <span v-if="b.isVerified" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 w-fit">
                    Verified
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end gap-1">
                  <button
                    class="text-xs font-bold text-slate-600 hover:underline disabled:opacity-40"
                    :disabled="busyId === b._id"
                    @click="toggleVerified(b)"
                  >
                    {{ b.isVerified ? 'Unverify' : 'Verify' }}
                  </button>
                  <button
                    class="text-xs font-bold text-slate-600 hover:underline disabled:opacity-40"
                    :disabled="busyId === b._id"
                    @click="toggleActive(b)"
                  >
                    {{ b.isActive ? 'Pause' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="notice" class="text-xs font-bold" :class="noticeError ? 'text-red-600' : 'text-emerald-600'">
      {{ notice }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader2, AlertTriangle, Building2 } from 'lucide-vue-next';
import { adminManagementApi, type AdminBusiness } from '~/api_factory/modules/adminManagement';

/**
 * Businesses and the commission the platform charges them.
 *
 * This is the only place `commissionRate` can be written — owners cannot change
 * their own rate (the API rejects it), so the number here is the source of truth.
 */

const rows = ref<AdminBusiness[]>([]);
const drafts = ref<Record<string, number>>({});
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const busyId = ref('');
const notice = ref('');
const noticeError = ref(false);

const naira = (n?: number) => (typeof n === 'number' ? `₦${n.toLocaleString('en-NG')}` : '—');

const ownerName = (b: AdminBusiness) => {
  const o = b.ownerId;
  if (!o || typeof o !== 'object') return '—';
  return `${o.firstName || ''} ${o.lastName || ''}`.trim() || o.email || '—';
};

const flash = (message: string, isError = false) => {
  notice.value = message;
  noticeError.value = isError;
  setTimeout(() => { notice.value = ''; }, 3000);
};

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listBusinesses({ limit: 100 });
    rows.value = data.data ?? [];
    meta.value = { total: data.meta?.total ?? rows.value.length };
    drafts.value = Object.fromEntries(rows.value.map((b) => [b._id, b.commissionRate]));
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

const apply = async (
  b: AdminBusiness,
  payload: { commissionRate?: number; isVerified?: boolean; isActive?: boolean },
  successMessage: string,
) => {
  busyId.value = b._id;
  try {
    const { data } = await adminManagementApi.updateBusiness(b._id, payload);
    const idx = rows.value.findIndex((r) => r._id === b._id);
    if (idx >= 0) rows.value[idx] = { ...rows.value[idx], ...data };
    drafts.value[b._id] = rows.value[idx >= 0 ? idx : 0]?.commissionRate ?? b.commissionRate;
    flash(successMessage);
  } catch (err: any) {
    flash(err?.response?.data?.message || 'That change was rejected.', true);
  } finally {
    busyId.value = '';
  }
};

const saveCommission = (b: AdminBusiness) => {
  const value = Number(drafts.value[b._id]);
  if (!Number.isFinite(value) || value < 0 || value > 50) {
    flash('Commission must be between 0 and 50 percent.', true);
    return;
  }
  void apply(b, { commissionRate: value }, `Commission for ${b.name} set to ${value}%.`);
};

const toggleVerified = (b: AdminBusiness) =>
  apply(b, { isVerified: !b.isVerified }, `${b.name} ${b.isVerified ? 'unverified' : 'verified'}.`);

const toggleActive = (b: AdminBusiness) =>
  apply(b, { isActive: !b.isActive }, `${b.name} ${b.isActive ? 'paused' : 'activated'}.`);

onMounted(load);
</script>
