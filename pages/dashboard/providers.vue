<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Service providers</h2>
      <p class="text-sm text-slate-500 mt-1">
        Everyone who has signed up to sell a skill, with how much they have listed and been booked.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or email…"
          class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white min-w-[240px] focus:ring-2 focus:ring-brand-500"
          @keydown.enter="load"
        />
        <p class="text-xs font-semibold text-slate-500">{{ meta.total }} provider(s)</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-56">
        <Loader2 class="animate-spin h-9 w-9 text-brand-600 mb-3" />
        <p class="text-slate-500 font-medium">Loading providers…</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <AlertTriangle class="w-9 h-9 text-red-500 mb-3" />
        <p class="font-bold text-slate-900">Could not load providers</p>
        <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
        <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="load">
          Try again
        </button>
      </div>

      <div v-else-if="rows.length === 0" class="flex flex-col items-center justify-center h-56 text-center px-4">
        <Users class="w-9 h-9 text-slate-300 mb-3" />
        <p class="font-bold text-slate-900">No providers yet</p>
        <p class="text-sm text-slate-500 mt-1">Nobody has signed up to offer a service.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Provider</th>
              <th class="text-left font-semibold px-4 py-3">Headline</th>
              <th class="text-left font-semibold px-4 py-3">Services</th>
              <th class="text-left font-semibold px-4 py-3">Bookings</th>
              <th class="text-left font-semibold px-4 py-3">Accepting</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in rows" :key="p._id" class="hover:bg-slate-50/60">
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900">{{ fullName(p) }}</p>
                <p class="text-xs text-slate-400">{{ p.email || '—' }}</p>
              </td>
              <td class="px-4 py-3 text-slate-600 max-w-[280px] truncate">{{ p.headline || '—' }}</td>
              <td class="px-4 py-3 text-slate-600 font-semibold">{{ p.services ?? 0 }}</td>
              <td class="px-4 py-3 text-slate-600 font-semibold">{{ p.bookings ?? 0 }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="p.isAcceptingBookings === false
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ p.isAcceptingBookings === false ? 'Paused' : 'Open' }}
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
import { Loader2, AlertTriangle, Users } from 'lucide-vue-next';
import { adminManagementApi, type AdminProvider } from '~/api_factory/modules/adminManagement';

/** Everyone selling a service, with their listing and booking counts. */

const rows = ref<AdminProvider[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const search = ref('');

const fullName = (p: AdminProvider) =>
  `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.email || 'Provider';

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listProviders({
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

onMounted(load);
</script>
