<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Escrow Disputes</h2>
        <p class="text-sm text-slate-500 mt-1">Review and resolve transaction disputes securely.</p>
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
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50">
        <div class="flex items-center gap-2">
          <select v-model="filterStatus" class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white min-w-[150px]">
            <option value="all">All Transactions</option>
            <option value="disputed">Disputed Only</option>
            <option value="released">Released</option>
            <option value="held_in_escrow">Held in escrow</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Loading transactions...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Could not load transactions</h3>
          <p class="text-slate-500 text-sm max-w-sm">{{ error }}</p>
          <button @click="fetchData" class="mt-4 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-sm">Try again</button>
        </div>

        <!-- Empty State -->
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
        
        <!-- Data Table -->
        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Transaction ID</th>
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
                      Created: {{ tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-black text-slate-900">₦{{ Number(tx.amount || 0).toLocaleString() }}</div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span v-if="tx.status === 'disputed'" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Disputed
                </span>
                <span v-else-if="tx.status === 'released'" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-3 h-3 mr-1" />
                  Released
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  <Clock class="w-3 h-3 mr-1" />
                  Held
                </span>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(tx._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === tx._id" class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div class="p-1">
                      <button @click="reviewDispute(tx); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Search class="w-4 h-4 mr-2 text-slate-400" /> Review Details
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredTransactions.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredTransactions.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Transaction Review Modal (real transaction fields) -->
    <Teleport to="body">
      <div v-if="selectedTransaction" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click.self="selectedTransaction = null">
        <div class="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 border border-slate-200">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Transaction Review</h3>
              <p class="text-xs font-mono text-slate-500 mt-1">{{ selectedTransaction._id }}</p>
            </div>
            <button @click="selectedTransaction = null" class="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <dl class="divide-y divide-slate-100 text-sm">
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Status</dt>
              <dd class="font-semibold text-slate-900">{{ selectedTransaction.status }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Amount</dt>
              <dd class="font-semibold text-slate-900">₦{{ Number(selectedTransaction.amount || 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Item price</dt>
              <dd class="font-semibold text-slate-900">₦{{ Number(selectedTransaction.itemPrice || 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Escrow fee</dt>
              <dd class="font-semibold text-slate-900">₦{{ Number(selectedTransaction.escrowFee || 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Delivery</dt>
              <dd class="font-semibold text-slate-900">{{ selectedTransaction.deliveryMethod || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Buyer</dt>
              <dd class="font-mono text-xs text-slate-900">{{ selectedTransaction.buyerId || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Seller</dt>
              <dd class="font-mono text-xs text-slate-900">{{ selectedTransaction.sellerId || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Item</dt>
              <dd class="font-mono text-xs text-slate-900">{{ selectedTransaction.itemId || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Payment ref</dt>
              <dd class="font-mono text-xs text-slate-900">{{ selectedTransaction.paymentReference || '—' }}</dd>
            </div>
            <div class="flex justify-between py-2.5">
              <dt class="text-slate-500">Created</dt>
              <dd class="font-semibold text-slate-900">{{ selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : '—' }}</dd>
            </div>
          </dl>

          <p class="mt-4 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
            Resolving a dispute requires a refund/release endpoint on the API. This screen is read-only
            until an admin resolution route exists.
          </p>

          <div class="flex justify-end pt-4">
            <button @click="selectedTransaction = null" class="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-xl transition-colors">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { adminApi } from '~/api_factory/modules/admin';
import {
  Search, Download, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Hash, MoreVertical, X,
} from 'lucide-vue-next';

const transactions = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const filterStatus = ref('all');
const selectedTransaction = ref<any | null>(null);

// Dropdown state
const activeDropdown = ref<string | null>(null);
const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};
const closeDropdowns = () => {
  activeDropdown.value = null;
};

// Pagination
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

const reviewDispute = (tx: any) => {
  selectedTransaction.value = tx;
};

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await adminApi.getEscrows();
    transactions.value = Array.isArray(data) ? data : [];
  } catch (err: any) {
    error.value =
      err?.response?.status === 401
        ? 'Your session has expired — sign in again.'
        : err?.response?.data?.message || 'Could not load transactions. The API did not respond.';
  } finally {
    loading.value = false;
  }
};

const exportReport = () => {
  if (typeof window === 'undefined' || !transactions.value.length) return;

  const header = [
    'Transaction ID', 'Status', 'Amount', 'Item price', 'Escrow fee', 'Delivery method',
    'Buyer', 'Seller', 'Item', 'Payment reference', 'Created',
  ];
  const rows = transactions.value.map((tx) => [
    tx._id,
    tx.status,
    tx.amount ?? 0,
    tx.itemPrice ?? 0,
    tx.escrowFee ?? 0,
    tx.deliveryMethod,
    tx.buyerId,
    tx.sellerId,
    tx.itemId,
    tx.paymentReference,
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