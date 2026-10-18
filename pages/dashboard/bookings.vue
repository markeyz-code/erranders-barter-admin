<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Service Bookings</h2>
        <p class="text-sm text-slate-500 mt-1">
          Every appointment booked through the services marketplace with full participant details and meeting controls.
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
          <select
            v-model="status"
            class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500"
            @change="load"
          >
            <option value="">All statuses</option>
            <option v-for="s in STATUSES" :key="s" :value="s">{{ label(s) }}</option>
          </select>
        </div>
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
              <th class="text-left font-semibold px-4 py-3">Schedule</th>
              <th class="text-left font-semibold px-4 py-3">Provider</th>
              <th class="text-left font-semibold px-4 py-3">Customer</th>
              <th class="text-left font-semibold px-4 py-3">Amount</th>
              <th class="text-left font-semibold px-4 py-3">Status</th>
              <th class="text-right font-semibold px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in rows" :key="b._id" class="hover:bg-slate-50/60 transition-colors">
              <td class="px-4 py-3">
                <p class="font-bold text-slate-900 hover:text-brand-600 cursor-pointer" @click="viewDetail(b)">
                  {{ serviceTitle(b) }}
                </p>
                <p v-if="b.meetingUrl" class="text-xs text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                  <Video class="w-3 h-3" /> Video Room
                </p>
              </td>
              <td class="px-4 py-3 text-slate-600">
                <p class="font-semibold">{{ b.date || '—' }}</p>
                <p class="text-xs text-slate-400">{{ b.startTime }} – {{ b.endTime }}</p>
              </td>
              <td class="px-4 py-3 text-slate-700">
                <p class="font-semibold">{{ person(b.providerId) }}</p>
                <p class="text-xs text-slate-400">{{ personEmail(b.providerId) }}</p>
              </td>
              <td class="px-4 py-3 text-slate-700">
                <p class="font-semibold">{{ person(b.customerId) }}</p>
                <p class="text-xs text-slate-400">{{ personEmail(b.customerId) }}</p>
              </td>
              <td class="px-4 py-3 font-semibold text-slate-800">
                {{ typeof b.amount === 'number' ? '₦' + b.amount.toLocaleString('en-NG') : '—' }}
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="statusClass(b.status)">
                  {{ label(b.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
                  @click="viewDetail(b)"
                >
                  Manage
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <Teleport to="body">
      <div v-if="detailBooking" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold" :class="statusClass(detailBooking.status)">
                {{ label(detailBooking.status) }}
              </span>
              <h3 class="text-xl font-black text-slate-900 mt-2">{{ serviceTitle(detailBooking) }}</h3>
              <p class="text-xs text-slate-400 font-mono mt-0.5">Booking ID: {{ detailBooking._id }}</p>
            </div>
            <button @click="detailBooking = null" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl mb-4 text-xs">
            <div>
              <p class="font-bold text-slate-400 uppercase">Appointment Date</p>
              <p class="font-extrabold text-slate-800 text-sm mt-0.5">{{ detailBooking.date }}</p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Slot Time</p>
              <p class="font-bold text-slate-800 text-sm mt-0.5">
                {{ detailBooking.startTime }} – {{ detailBooking.endTime }}
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Amount</p>
              <p class="font-extrabold text-brand-600 text-sm mt-0.5">
                {{ typeof detailBooking.amount === 'number' ? '₦' + detailBooking.amount.toLocaleString('en-NG') : '—' }}
              </p>
            </div>
            <div>
              <p class="font-bold text-slate-400 uppercase">Created</p>
              <p class="font-bold text-slate-700 mt-0.5">
                {{ detailBooking.createdAt ? new Date(detailBooking.createdAt).toLocaleString() : '—' }}
              </p>
            </div>
          </div>

          <!-- Video Meeting Link -->
          <div v-if="detailBooking.meetingUrl" class="mb-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Video class="w-4 h-4 text-blue-600" /> Remote Video Meeting
              </p>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Jitsi Meet</span>
            </div>
            <p class="text-xs text-blue-700 font-mono break-all mb-3">{{ detailBooking.meetingUrl }}</p>
            <div class="flex gap-2">
              <a
                :href="detailBooking.meetingUrl"
                target="_blank"
                rel="noopener"
                class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Video class="w-3.5 h-3.5" /> Join Room
              </a>
              <button
                type="button"
                @click="copyMeetingUrl(detailBooking.meetingUrl)"
                class="px-3.5 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Copy class="w-3.5 h-3.5" /> {{ copiedUrl ? 'Copied!' : 'Copy Link' }}
              </button>
            </div>
          </div>

          <!-- Customer Notes -->
          <div v-if="detailBooking.notes" class="mb-4">
            <h4 class="text-xs font-bold text-slate-400 uppercase mb-1">Customer Notes</h4>
            <p class="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              “{{ detailBooking.notes }}”
            </p>
          </div>

          <!-- Cancellation Reason -->
          <div v-if="detailBooking.cancellationReason" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <h4 class="text-xs font-bold text-red-700 uppercase mb-0.5">Cancellation Reason</h4>
            <p class="text-xs text-red-600">
              {{ detailBooking.cancellationReason }}
              <span v-if="detailBooking.cancelledBy" class="font-semibold">(by {{ detailBooking.cancelledBy }})</span>
            </p>
          </div>

          <!-- Parties -->
          <div class="grid sm:grid-cols-2 gap-3 mb-5">
            <div class="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Provider</p>
              <p class="text-sm font-bold text-slate-900">{{ person(detailBooking.providerId) }}</p>
              <p class="text-xs text-slate-500">{{ personEmail(detailBooking.providerId) }}</p>
            </div>
            <div class="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer</p>
              <p class="text-sm font-bold text-slate-900">{{ person(detailBooking.customerId) }}</p>
              <p class="text-xs text-slate-500">{{ personEmail(detailBooking.customerId) }}</p>
            </div>
          </div>

          <!-- Admin Actions -->
          <div class="flex flex-wrap gap-2 justify-between pt-3 border-t border-slate-100">
            <div class="flex gap-2">
              <button
                v-if="['pending', 'confirmed'].includes(detailBooking.status)"
                class="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-40"
                :disabled="acting"
                @click="adminCancel(detailBooking)"
              >
                Cancel Booking
              </button>
              <button
                v-if="detailBooking.status === 'confirmed'"
                class="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40"
                :disabled="acting"
                @click="adminComplete(detailBooking)"
              >
                Complete Booking
              </button>
            </div>
            <button
              class="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              @click="detailBooking = null"
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
import {
  Loader2,
  AlertTriangle,
  CalendarDays,
  RefreshCw,
  Video,
  Copy,
  X,
} from 'lucide-vue-next';
import { adminManagementApi, type AdminBooking } from '~/api_factory/modules/adminManagement';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'declined', 'no_show'];

const rows = ref<AdminBooking[]>([]);
const meta = ref({ total: 0 });
const loading = ref(true);
const error = ref('');
const status = ref('');
const detailBooking = ref<AdminBooking | null>(null);
const copiedUrl = ref(false);
const acting = ref(false);

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

const personEmail = (v: AdminBooking['providerId']) => {
  if (!v || typeof v !== 'object') return '';
  return (v as any).email || '';
};

const serviceTitle = (b: AdminBooking) =>
  typeof b.serviceId === 'object' && b.serviceId ? (b.serviceId as any).title || 'Service' : 'Service';

const viewDetail = (b: AdminBooking) => {
  detailBooking.value = b;
};

const copyMeetingUrl = (url?: string) => {
  if (!url) return;
  navigator.clipboard.writeText(url);
  copiedUrl.value = true;
  setTimeout(() => {
    copiedUrl.value = false;
  }, 2000);
};

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

const adminCancel = async (b: AdminBooking) => {
  const reason = prompt('Cancellation note / reason for admin record:', 'Cancelled by administrator');
  if (reason === null) return;
  acting.value = true;
  try {
    const { data } = await adminManagementApi.updateBookingStatus(b._id, {
      status: 'cancelled',
      reason: reason || 'Cancelled by administrator',
    });
    const idx = rows.value.findIndex((r) => r._id === b._id);
    if (idx >= 0) rows.value[idx] = data;
    if (detailBooking.value && detailBooking.value._id === b._id) {
      detailBooking.value = data;
    }
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to cancel booking');
  } finally {
    acting.value = false;
  }
};

const adminComplete = async (b: AdminBooking) => {
  if (!confirm('Mark this booking as completed?')) return;
  acting.value = true;
  try {
    const { data } = await adminManagementApi.updateBookingStatus(b._id, {
      status: 'completed',
    });
    const idx = rows.value.findIndex((r) => r._id === b._id);
    if (idx >= 0) rows.value[idx] = data;
    if (detailBooking.value && detailBooking.value._id === b._id) {
      detailBooking.value = data;
    }
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to complete booking');
  } finally {
    acting.value = false;
  }
};

onMounted(load);
</script>
