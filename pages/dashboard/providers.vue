<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Service Providers</h2>
        <p class="text-sm text-slate-500 mt-1">
          Review, inspect profiles, toggle booking acceptance and manage campus skill providers.
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
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="search"
            type="text"
            placeholder="Search providers by name, email or skills…"
            class="border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm bg-white min-w-[260px] focus:ring-2 focus:ring-brand-500"
            @keydown.enter="load"
          />
        </div>
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
        <p class="font-bold text-slate-900">No providers found</p>
        <p class="text-sm text-slate-500 mt-1">
          {{ search ? 'No providers matched your query.' : 'Nobody has signed up as a service provider yet.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500">
            <tr>
              <th class="text-left font-semibold px-4 py-3">Provider</th>
              <th class="text-left font-semibold px-4 py-3">Headline & Area</th>
              <th class="text-left font-semibold px-4 py-3">Services</th>
              <th class="text-left font-semibold px-4 py-3">Bookings</th>
              <th class="text-left font-semibold px-4 py-3">Accepting</th>
              <th class="text-right font-semibold px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in rows" :key="p._id" class="hover:bg-slate-50/60 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                    <img v-if="p.avatar" :src="p.avatar" :alt="fullName(p)" class="w-full h-full object-cover" />
                    <span v-else class="w-full h-full flex items-center justify-center font-bold text-slate-600">
                      {{ fullName(p).charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 hover:text-brand-600 cursor-pointer" @click="viewDetail(p)">
                      {{ fullName(p) }}
                    </p>
                    <p class="text-xs text-slate-400">{{ p.email || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-600 max-w-[240px]">
                <p class="font-medium text-slate-800 truncate">{{ p.headline || '—' }}</p>
                <p class="text-xs text-slate-400 truncate">{{ p.serviceArea || p.university || 'Campus' }}</p>
              </td>
              <td class="px-4 py-3 text-slate-700 font-bold">
                {{ p.counts?.services ?? p.services ?? 0 }}
              </td>
              <td class="px-4 py-3 text-slate-700 font-bold">
                {{ p.counts?.bookings ?? p.bookings ?? 0 }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="p.isAcceptingBookings === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ p.isAcceptingBookings === false ? 'Paused' : 'Open' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
                  @click="viewDetail(p)"
                >
                  Inspect
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Provider Detail Modal -->
    <Teleport to="body">
      <div v-if="detailProvider" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex items-center gap-3.5">
              <div class="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                <img v-if="detailProvider.avatar" :src="detailProvider.avatar" :alt="fullName(detailProvider)" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center font-black text-xl text-slate-600">
                  {{ fullName(detailProvider).charAt(0) }}
                </span>
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900">{{ fullName(detailProvider) }}</h3>
                <p class="text-xs text-slate-500">{{ detailProvider.email }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold"
                    :class="detailProvider.isAcceptingBookings === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'"
                  >
                    {{ detailProvider.isAcceptingBookings === false ? 'Paused Bookings' : 'Open for Bookings' }}
                  </span>
                  <span v-if="detailProvider.isVerified" class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <button @click="detailProvider = null" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl mb-4 border border-slate-100">
            <p class="text-xs font-bold text-slate-400 uppercase mb-1">Headline</p>
            <p class="text-sm font-bold text-slate-800">{{ detailProvider.headline || 'No headline set' }}</p>
          </div>

          <div v-if="detailProvider.bio" class="mb-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase mb-1.5">Bio</h4>
            <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {{ detailProvider.bio }}
            </p>
          </div>

          <div v-if="detailProvider.skills?.length" class="mb-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase mb-1.5">Skills</h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="s in detailProvider.skills"
                :key="s"
                class="px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700"
              >
                {{ s }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl mb-4 text-xs">
            <div>
              <p class="font-bold text-slate-400 uppercase">Service Area</p>
              <p class="font-bold text-slate-800 mt-0.5">{{ detailProvider.serviceArea || 'Campus-wide' }}</p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Campus & Hostel</p>
              <p class="font-bold text-slate-800 mt-0.5">
                {{ [detailProvider.university, detailProvider.hostel, detailProvider.level].filter(Boolean).join(' · ') || '—' }}
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Services Listed</p>
              <p class="font-extrabold text-brand-600 text-sm mt-0.5">
                {{ detailProvider.counts?.services ?? detailProvider.services ?? 0 }}
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Total Bookings</p>
              <p class="font-extrabold text-slate-800 text-sm mt-0.5">
                {{ detailProvider.counts?.bookings ?? detailProvider.bookings ?? 0 }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 justify-between pt-3 border-t border-slate-100">
            <button
              class="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              :disabled="toggling"
              @click="toggleAcceptance(detailProvider)"
            >
              {{ detailProvider.isAcceptingBookings === false ? 'Resume Bookings' : 'Pause Bookings' }}
            </button>
            <button
              class="px-4 py-2 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800"
              @click="detailProvider = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Loader2, AlertTriangle, Users, RefreshCw, Search, X } from 'lucide-vue-next';
import { adminManagementApi, type AdminProvider } from '~/api_factory/modules/adminManagement';

const rows = ref<AdminProvider[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const search = ref('');
const detailProvider = ref<AdminProvider | null>(null);
const toggling = ref(false);

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

const viewDetail = (p: AdminProvider) => {
  detailProvider.value = p;
};

const toggleAcceptance = async (p: AdminProvider) => {
  toggling.value = true;
  const current = p.isAcceptingBookings !== false;
  try {
    const { data } = await adminManagementApi.updateProvider(p._id, {
      isAcceptingBookings: !current,
    });
    p.isAcceptingBookings = !current;
    if (detailProvider.value && detailProvider.value._id === p._id) {
      detailProvider.value.isAcceptingBookings = !current;
    }
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to update provider status');
  } finally {
    toggling.value = false;
  }
};

onMounted(load);
</script>
