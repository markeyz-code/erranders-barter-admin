<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Moderation queue</h2>
      <p class="text-sm text-slate-500 mt-1">
        Reports filed by buyers and sellers, and messages to support. Nothing here reaches a
        customer until you act on it.
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-slate-200">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="px-4 py-2.5 text-sm font-bold border-b-2 transition-colors"
        :class="activeTab === tab.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.key === 'reports' && openCount" class="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">{{ openCount }}</span>
      </button>
    </div>

    <!-- Reports -->
    <template v-if="activeTab === 'reports'">
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
          <select v-model="status" class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white" @change="loadReports">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <p class="text-xs font-semibold text-slate-500">{{ reports.length }} report(s)</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-56">
          <Loader2 class="animate-spin h-9 w-9 text-brand-600" />
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-56 text-center px-4">
          <AlertTriangle class="w-9 h-9 text-red-500 mb-3" />
          <p class="font-bold text-slate-900">Could not load the queue</p>
          <p class="text-sm text-slate-500 mt-1 max-w-sm">{{ error }}</p>
          <button class="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold" @click="loadReports">Try again</button>
        </div>

        <div v-else-if="reports.length === 0" class="flex flex-col items-center justify-center h-56 text-center">
          <ShieldCheck class="w-9 h-9 text-emerald-400 mb-3" />
          <p class="font-bold text-slate-900">Nothing to review</p>
          <p class="text-sm text-slate-500 mt-1">No reports match this filter.</p>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div v-for="report in reports" :key="report._id" class="p-4">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-black uppercase">{{ report.reason.replace('_',' ') }}</span>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">{{ report.targetType }}</span>
                  <StatusPill :status="report.status" />
                </div>
                <p class="mt-1.5 text-sm font-bold text-slate-900">
                  {{ report.targetLabel || report.targetId }}
                </p>
                <p class="text-sm text-slate-600 mt-1">{{ report.details }}</p>
                <p class="text-[11px] text-slate-400 mt-1.5">
                  by {{ reporterName(report) }} · {{ formatDate(report.createdAt) }}
                </p>
                <p v-if="report.adminNote" class="mt-2 text-xs text-slate-500 italic">
                  Note: {{ report.adminNote }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5 shrink-0">
                <button
                  v-if="report.status === 'open'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"
                  @click="setStatus(report, 'reviewing')"
                >
                  Review
                </button>
                <button
                  v-if="report.status !== 'resolved'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  @click="setStatus(report, 'resolved')"
                >
                  Resolve
                </button>
                <button
                  v-if="report.status !== 'dismissed'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50"
                  @click="setStatus(report, 'dismissed')"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Tickets -->
    <template v-else>
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div v-if="loadingTickets" class="flex items-center justify-center h-56">
          <Loader2 class="animate-spin h-9 w-9 text-brand-600" />
        </div>
        <div v-else-if="tickets.length === 0" class="flex flex-col items-center justify-center h-56 text-center">
          <Inbox class="w-9 h-9 text-slate-300 mb-3" />
          <p class="font-bold text-slate-900">No support tickets</p>
          <p class="text-sm text-slate-500 mt-1">Messages from the contact form appear here.</p>
        </div>
        <div v-else class="divide-y divide-slate-100">
          <div v-for="ticket in tickets" :key="ticket._id" class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black font-mono">{{ ticket.reference }}</span>
                  <StatusPill :status="ticket.status" />
                </div>
                <p class="mt-1.5 text-sm font-bold text-slate-900">{{ ticket.subject }}</p>
                <p class="text-sm text-slate-600 mt-1">{{ ticket.message }}</p>
                <p class="text-[11px] text-slate-400 mt-1.5">
                  {{ ticket.name }} · {{ ticket.email }} · {{ formatDate(ticket.createdAt) }}
                </p>
                <p v-if="ticket.reply" class="mt-2 text-xs text-emerald-700">Replied: {{ ticket.reply }}</p>
              </div>
            </div>

            <div v-if="!ticket.reply" class="mt-3 flex gap-2">
              <input
                v-model="replies[ticket._id]"
                placeholder="Reply to this person…"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                @keydown.enter.prevent="reply(ticket)"
              />
              <button class="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold" @click="reply(ticket)">
                Send reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Loader2, AlertTriangle, ShieldCheck, Inbox } from 'lucide-vue-next';
import StatusPill from '~/components/StatusPill.vue';
import {
  adminManagementApi,
  type AdminReport,
  type AdminTicket,
} from '~/api_factory/modules/adminManagement';

/**
 * The moderation queue.
 *
 * Reports were being stored with no way to work them, which makes reporting decorative.
 * This is where they get triaged, and where support tickets get a real reply — the reply
 * is emailed to the person who asked.
 */

const TABS = [
  { key: 'reports' as const, label: 'Reports' },
  { key: 'tickets' as const, label: 'Support tickets' },
];

const activeTab = ref<'reports' | 'tickets'>('reports');
const reports = ref<AdminReport[]>([]);
const tickets = ref<AdminTicket[]>([]);
const loading = ref(true);
const loadingTickets = ref(false);
const error = ref('');
const status = ref('');
const replies = reactive<Record<string, string>>({});

const openCount = computed(() => reports.value.filter((r) => r.status === 'open').length);

const reporterName = (report: AdminReport) => {
  const reporter = report.reporterId;
  if (!reporter || typeof reporter !== 'object') return 'a user';
  return `${reporter.firstName || ''} ${reporter.lastName || ''}`.trim() || reporter.email || 'a user';
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const loadReports = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listReports({ limit: 100, status: status.value || undefined } as any);
    reports.value = data.data ?? [];
  } catch (err: any) {
    error.value = err?.response?.status === 403 ? 'Your account is not an admin.' : err?.response?.data?.message || 'The admin API did not respond.';
    reports.value = [];
  } finally {
    loading.value = false;
  }
};

const loadTickets = async () => {
  loadingTickets.value = true;
  try {
    const { data } = await adminManagementApi.listTickets({ limit: 100 } as any);
    tickets.value = Array.isArray(data) ? data : [];
  } catch {
    tickets.value = [];
  } finally {
    loadingTickets.value = false;
  }
};

const switchTab = (key: 'reports' | 'tickets') => {
  activeTab.value = key;
  if (key === 'reports') void loadReports();
  else void loadTickets();
};

const setStatus = async (report: AdminReport, next: 'reviewing' | 'resolved' | 'dismissed') => {
  try {
    const { data } = await adminManagementApi.resolveReport(report._id, { status: next });
    const index = reports.value.findIndex((r) => r._id === report._id);
    if (index >= 0) reports.value[index] = { ...reports.value[index], ...data };
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not update that report.';
  }
};

const reply = async (ticket: AdminTicket) => {
  const text = (replies[ticket._id] || '').trim();
  if (!text) return;
  try {
    const { data } = await adminManagementApi.updateTicket(ticket._id, { reply: text, status: 'answered' });
    const index = tickets.value.findIndex((t) => t._id === ticket._id);
    if (index >= 0) tickets.value[index] = { ...tickets.value[index], ...data };
    replies[ticket._id] = '';
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Could not send that reply.';
  }
};

onMounted(loadReports);
</script>
