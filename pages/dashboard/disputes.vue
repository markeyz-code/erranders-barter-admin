<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Escrow Disputes</h2>
        <p class="text-sm text-slate-500 mt-1">Review transactions and resolve them by releasing to the seller or refunding the buyer.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center disabled:opacity-50"
          :disabled="!transactions.length"
          @click="exportReport"
        >
          <Download class="w-4 h-4 mr-2" />
          Export Report
        </button>
        <button
          class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center disabled:opacity-50"
          :disabled="loading"
          @click="fetchData"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50">
        <div class="flex items-center gap-2">
          <select v-model="filterStatus" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white min-w-[170px]">
            <option value="all">All Transactions</option>
            <option value="disputed">Disputed Only</option>
            <option value="held_in_escrow">Held in escrow</option>
            <option value="released">Released</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <p class="text-xs font-semibold text-slate-500">
          {{ filteredTransactions.length }} {{ filteredTransactions.length === 1 ? 'transaction' : 'transactions' }}
        </p>
      </div>

      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Loading transactions...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load transactions</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchData" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <div v-else-if="filteredTransactions.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No transactions found</h3>
          <p class="text-slate-500 text-sm max-w-sm">
            {{ transactions.length === 0 ? 'No escrow transactions exist yet.' : 'No escrows match the current filter.' }}
          </p>
          <button v-if="filterStatus !== 'all'" @click="filterStatus = 'all'" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filter</button>
        </div>

        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Transaction</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Parties</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="tx in paginatedTransactions" :key="tx._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Hash class="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900 font-mono">{{ tx._id }}</div>
                    <div class="text-sm text-slate-500">
                      {{ tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-slate-700"><span class="text-slate-400">Buyer</span> {{ partyName(tx.buyer) }}</div>
                <div class="text-slate-700"><span class="text-slate-400">Seller</span> {{ partyName(tx.seller) }}</div>
                <div v-if="tx.item" class="text-xs text-slate-400 truncate max-w-[180px]">{{ tx.item.title }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-black text-slate-900">{{ formatMoney(tx.amount) }}</div>
                <div class="text-xs text-slate-500">Item {{ formatMoney(tx.itemPrice) }} · Fee {{ formatMoney(tx.escrowFee) }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border" :class="statusClass(tx.status)">
                  <component :is="statusIcon(tx.status)" class="w-3 h-3 mr-1" />
                  {{ statusLabel(tx.status) }}
                </span>
                <div v-if="tx.resolution" class="text-xs text-slate-400 mt-1">
                  {{ tx.resolution === 'release' ? 'Released' : 'Refunded' }}
                  <span v-if="tx.amountMoved !== undefined">· {{ formatMoney(tx.amountMoved) }}</span>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(tx._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Transaction actions">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === tx._id" class="absolute right-0 mt-2 w-52 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div class="p-1">
                      <button @click="openResolve(tx); activeDropdown = null" :disabled="!canResolve(tx)" class="w-full text-left flex items-center px-3 py-2 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed" :class="canResolve(tx) ? 'text-brand-700 hover:bg-brand-50' : 'text-slate-400'">
                        <ArrowLeftRight class="w-4 h-4 mr-2" /> Resolve transaction
                      </button>
                      <button @click="reviewTransaction(tx); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Search class="w-4 h-4 mr-2 text-slate-400" /> Review details
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredTransactions.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredTransactions.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Transaction review -->
    <Teleport to="body">
      <div v-if="selectedTransaction" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="selectedTransaction = null">
        <div class="bg-white rounded-2xl w-full max-w-lg border border-slate-200 max-h-[90vh] flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-slate-900">Transaction Review</h3>
              <p class="text-xs font-mono text-slate-500 mt-1 break-all">{{ selectedTransaction._id }}</p>
            </div>
            <button @click="selectedTransaction = null" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-4 sm:p-6 overflow-y-auto">
            <dl class="divide-y divide-slate-100 text-sm">
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Status</dt>
                <dd class="font-semibold text-slate-900">{{ statusLabel(selectedTransaction.status) }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Amount</dt>
                <dd class="font-semibold text-slate-900">{{ formatMoney(selectedTransaction.amount) }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Item price</dt>
                <dd class="font-semibold text-slate-900">{{ formatMoney(selectedTransaction.itemPrice) }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Escrow fee</dt>
                <dd class="font-semibold text-slate-900">{{ formatMoney(selectedTransaction.escrowFee) }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Delivery</dt>
                <dd class="font-semibold text-slate-900">{{ selectedTransaction.deliveryMethod || '—' }} · {{ formatMoney(selectedTransaction.deliveryFee) }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Buyer</dt>
                <dd class="font-semibold text-slate-900 text-right">{{ partyName(selectedTransaction.buyer) }}<br><span class="font-mono text-xs text-slate-400">{{ selectedTransaction.buyerId }}</span></dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Seller</dt>
                <dd class="font-semibold text-slate-900 text-right">{{ partyName(selectedTransaction.seller) }}<br><span class="font-mono text-xs text-slate-400">{{ selectedTransaction.sellerId }}</span></dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Item</dt>
                <dd class="font-semibold text-slate-900 text-right">{{ selectedTransaction.item?.title || '—' }}<br><span class="font-mono text-xs text-slate-400">{{ selectedTransaction.itemId }}</span></dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Payment ref</dt>
                <dd class="font-mono text-xs text-slate-900 text-right break-all">{{ selectedTransaction.paymentReference || '—' }}</dd>
              </div>
              <div v-if="selectedTransaction.resolution" class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Resolution</dt>
                <dd class="font-semibold text-slate-900 text-right capitalize">{{ selectedTransaction.resolution }} · {{ formatMoney(selectedTransaction.amountMoved ?? (selectedTransaction.resolution === 'release' ? selectedTransaction.sellerPayout : selectedTransaction.refundAmount)) }}</dd>
              </div>
              <div v-if="selectedTransaction.resolutionNote" class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Note</dt>
                <dd class="text-slate-700 text-right">{{ selectedTransaction.resolutionNote }}</dd>
              </div>
              <div class="flex justify-between py-2.5 gap-4">
                <dt class="text-slate-500">Created</dt>
                <dd class="font-semibold text-slate-900">{{ selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : '—' }}</dd>
              </div>
            </dl>
          </div>

          <div class="p-4 border-t border-slate-100 flex justify-end gap-3">
            <button @click="selectedTransaction = null" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Close</button>
            <button v-if="canResolve(selectedTransaction)" @click="openResolve(selectedTransaction); selectedTransaction = null" class="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">Resolve transaction</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Resolve modal -->
    <Teleport to="body">
      <div v-if="resolveTarget" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" @click.self="!resolveBusy && closeResolve()">
        <div class="bg-white rounded-2xl w-full max-w-lg border border-slate-200 max-h-[90vh] flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Resolve Dispute</h3>
              <p class="text-xs font-mono text-slate-500 mt-1 break-all">{{ resolveTarget._id }}</p>
            </div>
            <button @click="closeResolve" :disabled="resolveBusy" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-40">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-4 sm:p-6 overflow-y-auto space-y-5">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
              <div class="flex justify-between"><span class="text-slate-500">Buyer</span><span class="font-semibold text-slate-900">{{ partyName(resolveTarget.buyer) }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-slate-500">Seller</span><span class="font-semibold text-slate-900">{{ partyName(resolveTarget.seller) }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-slate-500">Amount paid</span><span class="font-semibold text-slate-900">{{ formatMoney(resolveTarget.amount) }}</span></div>
              <div class="flex justify-between mt-1"><span class="text-slate-500">Item price</span><span class="font-semibold text-slate-900">{{ formatMoney(resolveTarget.itemPrice) }}</span></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" class="text-left border-2 rounded-xl p-4 transition-colors" :class="resolution === 'release' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'" @click="resolution = 'release'">
                <div class="flex items-center gap-2 font-bold text-slate-900"><CheckCircle2 class="w-4 h-4 text-emerald-600" /> Release to seller</div>
                <p class="text-xs text-slate-500 mt-1">Pays the seller the item price minus the configured seller commission. The escrow closes as released.</p>
              </button>
              <button type="button" class="text-left border-2 rounded-xl p-4 transition-colors" :class="resolution === 'refund' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'" @click="resolution = 'refund'">
                <div class="flex items-center gap-2 font-bold text-slate-900"><Undo2 class="w-4 h-4 text-blue-600" /> Refund buyer</div>
                <p class="text-xs text-slate-500 mt-1">Credits the full amount the buyer paid to their Barter wallet, from which they can withdraw it.</p>
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Reason <span class="text-red-500">*</span></label>
              <textarea v-model="resolveNote" rows="3" placeholder="Explain the evidence and why this outcome is correct. Kept on the transaction as the audit note." class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"></textarea>
              <p v-if="!resolveNote.trim()" class="text-xs text-slate-400 mt-1">A reason is required before a resolution can be confirmed.</p>
            </div>

            <div v-if="resolveStep === 'confirm'" class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <p class="font-bold">Confirm this resolution</p>
              <p class="mt-1">
                <template v-if="resolution === 'release'">
                  Release the escrow to <strong>{{ partyName(resolveTarget.seller) }}</strong>. The seller receives the item price minus the configured seller commission. This cannot be undone.
                </template>
                <template v-else>
                  Refund <strong>{{ formatMoney(resolveTarget.amount) }}</strong> to <strong>{{ partyName(resolveTarget.buyer) }}</strong>'s Barter wallet. This cannot be undone.
                </template>
              </p>
            </div>

            <div v-if="resolveError" class="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2">
              <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
              <span>{{ resolveError }}</span>
            </div>
          </div>

          <div class="p-4 border-t border-slate-100 flex justify-between gap-3">
            <button @click="resolveStep === 'confirm' ? (resolveStep = 'choose') : closeResolve()" :disabled="resolveBusy" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50">{{ resolveStep === 'confirm' ? 'Back' : 'Cancel' }}</button>
            <button v-if="resolveStep === 'choose'" :disabled="!resolveNote.trim()" class="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors disabled:opacity-50" @click="resolveStep = 'confirm'">Review resolution</button>
            <button v-else :disabled="resolveBusy || !resolveNote.trim()" class="px-5 py-2 text-sm font-bold text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2" :class="resolution === 'refund' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brand-600 hover:bg-brand-700'" @click="confirmResolve">
              <Loader2 v-if="resolveBusy" class="w-4 h-4 animate-spin" />
              {{ resolveBusy ? 'Resolving…' : resolution === 'release' ? 'Confirm release to seller' : 'Confirm refund to buyer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  adminManagementApi,
  adminErrorMessage,
  type AdminEscrow,
  type AdminItemSummary,
  type AdminUserSummary,
} from '~/api_factory/modules/adminManagement';
import { useCustomToast } from '~/composables/core/useCustomToast';
import {
  Search, Download, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Hash, MoreVertical, X, RefreshCw, ArrowLeftRight, Undo2, AlertCircle,
} from 'lucide-vue-next';

const transactions = ref<AdminEscrow[]>([]);
const loading = ref(true);
const error = ref('');
const filterStatus = ref('all');
const selectedTransaction = ref<AdminEscrow | null>(null);
const activeDropdown = ref<string | null>(null);
const { showToast } = useCustomToast();

const resolveTarget = ref<AdminEscrow | null>(null);
const resolution = ref<'release' | 'refund'>('release');
const resolveNote = ref('');
const resolveStep = ref<'choose' | 'confirm'>('choose');
const resolveBusy = ref(false);
const resolveError = ref('');

const currentPage = ref(1);
const itemsPerPage = 10;

const filteredTransactions = computed(() => {
  if (filterStatus.value === 'all') return transactions.value;
  return transactions.value.filter((tx) => tx.status === filterStatus.value);
});

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1);
const paginatedTransactions = computed(() =>
  filteredTransactions.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage,
  ),
);

watch(filterStatus, () => {
  currentPage.value = 1;
});

const formatMoney = (value?: number) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

const partyName = (party?: AdminUserSummary | null) => {
  if (!party) return 'Unknown';
  const full = `${party.firstName || ''} ${party.lastName || ''}`.trim();
  return full || party.email || 'Unknown';
};

const statusLabel = (status?: string) => {
  if (status === 'held_in_escrow') return 'Held in escrow';
  if (status === 'released') return 'Released';
  if (status === 'disputed') return 'Disputed';
  if (status === 'refunded') return 'Refunded';
  return status ? status.replace(/_/g, ' ') : 'Unknown';
};

const statusClass = (status?: string) => {
  if (status === 'released') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'disputed') return 'bg-red-100 text-red-700 border-red-200';
  if (status === 'refunded') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (status === 'held_in_escrow') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const statusIcon = (status?: string) => {
  if (status === 'released') return CheckCircle2;
  if (status === 'disputed') return AlertTriangle;
  if (status === 'refunded') return Undo2;
  return Clock;
};

const canResolve = (tx: AdminEscrow) =>
  tx.canResolve === true || tx.status === 'held_in_escrow' || tx.status === 'disputed';

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

const reviewTransaction = (tx: AdminEscrow) => {
  selectedTransaction.value = tx;
};

const openResolve = (tx: AdminEscrow) => {
  resolveTarget.value = tx;
  resolution.value = 'release';
  resolveNote.value = '';
  resolveStep.value = 'choose';
  resolveError.value = '';
};

const closeResolve = () => {
  if (resolveBusy.value) return;
  resolveTarget.value = null;
  resolveError.value = '';
};

const confirmResolve = async () => {
  const tx = resolveTarget.value;
  if (!tx || resolveBusy.value || !resolveNote.value.trim()) return;

  resolveBusy.value = true;
  resolveError.value = '';
  try {
    const { data } = await adminManagementApi.resolveEscrow(tx._id, {
      resolution: resolution.value,
      note: resolveNote.value.trim(),
    });

    const index = transactions.value.findIndex((candidate) => candidate._id === tx._id);
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...data };
    }

    showToast({
      title: 'Dispute resolved',
      message: data.message || `Transaction marked as ${data.status || resolution.value}.`,
      toastType: 'success',
    });
    resolveTarget.value = null;
  } catch (err: any) {
    resolveError.value = adminErrorMessage(
      err,
      'The transaction could not be resolved. Nothing was moved.',
    );
    // A 409 means someone else resolved it; refresh so the row shows the real state.
    if (err?.response?.status === 409) {
      await fetchData();
    }
  } finally {
    resolveBusy.value = false;
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminManagementApi.listEscrows();
    transactions.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value = adminErrorMessage(err, 'Could not load transactions. The API did not respond.');
    transactions.value = [];
  } finally {
    loading.value = false;
  }
};

const exportReport = () => {
  if (typeof window === 'undefined' || !transactions.value.length) return;

  const header = [
    'Transaction ID', 'Status', 'Amount', 'Item price', 'Escrow fee', 'Delivery method',
    'Buyer', 'Seller', 'Item', 'Payment reference', 'Resolution', 'Resolution note',
    'Amount moved', 'Created',
  ];
  const rows = transactions.value.map((tx) => [
    tx._id,
    tx.status,
    tx.amount ?? 0,
    tx.itemPrice ?? 0,
    tx.escrowFee ?? 0,
    tx.deliveryMethod,
    tx.buyer?.email || tx.buyerId,
    tx.seller?.email || tx.sellerId,
    (tx.item as AdminItemSummary | null)?.title || tx.itemId,
    tx.paymentReference,
    tx.resolution,
    tx.resolutionNote,
    tx.amountMoved ?? '',
    tx.createdAt ? new Date(tx.createdAt).toISOString() : '',
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `barter-escrows-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  fetchData();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>
