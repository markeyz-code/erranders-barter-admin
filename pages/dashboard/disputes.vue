<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Escrow Disputes</h2>
        <p class="text-sm text-slate-500 mt-1">Review and resolve transaction disputes securely.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center">
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
            <option value="held">Held</option>
          </select>
        </div>
      </div>
      
      <div class="flex-1 overflow-x-auto min-h-[400px]">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-64">
          <Loader2 class="animate-spin h-10 w-10 text-brand-600 mb-4" />
          <p class="text-slate-500 font-medium">Loading transactions...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="filteredTransactions.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">No transactions found</h3>
          <p class="text-slate-500 text-sm max-w-sm">There are no escrows matching the current filter. Excellent work keeping the dispute queue clean!</p>
          <button @click="filterStatus = 'all'" class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filter</button>
        </div>
        
        <!-- Data Table -->
        <table v-else class="min-w-full divide-y divide-slate-100 text-left">
          <thead class="bg-slate-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="tx in paginatedTransactions" :key="tx._id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Hash class="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-slate-900 font-mono">{{ tx._id }}</div>
                    <div class="text-xs text-slate-500">Created: {{ new Date().toLocaleDateString() }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-black text-slate-900">₦{{ Number(tx.amount || 0).toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="tx.status === 'disputed'" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                  <AlertTriangle class="w-3 h-3 mr-1" />
                  Disputed
                </span>
                <span v-else-if="tx.status === 'released'" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-3 h-3 mr-1" />
                  Released
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  <Clock class="w-3 h-3 mr-1" />
                  Held
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative inline-block text-left" @click.stop>
                  <button @click="toggleDropdown(tx._id)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <div v-if="activeDropdown === tx._id" class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50">
                    <div class="p-1">
                      <button @click="reviewDispute(tx); activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <Search class="w-4 h-4 mr-2 text-slate-400" /> Review Details
                      </button>
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        <MessageSquare class="w-4 h-4 mr-2 text-slate-400" /> Contact Parties
                      </button>
                    </div>
                    <div class="p-1">
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium">
                        <CheckCircle2 class="w-4 h-4 mr-2 text-emerald-400" /> Force Release
                      </button>
                      <button @click="activeDropdown = null" class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium mt-1">
                        <ArrowRightLeft class="w-4 h-4 mr-2 text-red-400" /> Force Refund
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
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" v-if="filteredTransactions.length > 0">
        <span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span> of <span class="font-semibold text-slate-900">{{ filteredTransactions.length }}</span> results</span>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200">
          <h3 class="text-lg font-bold text-slate-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-slate-500 text-sm mb-6">{{ modalMessage }}</p>
          <div class="flex gap-3 justify-end">
            <button @click="showModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button @click="executeModalAction" class="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">Confirm</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Search, Download, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Hash, MoreVertical, MessageSquare, ArrowRightLeft } from 'lucide-vue-next';

const transactions = ref<any[]>([]);
const loading = ref(true);
const filterStatus = ref('all');

// Dropdown State
const activeDropdown = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

// Close dropdowns on outside click
const closeDropdowns = () => {
  activeDropdown.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
  fetchData();
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

// Modal State
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const pendingAction = ref<(() => void) | null>(null);

const filteredTransactions = computed(() => {
  if (filterStatus.value === 'all') return transactions.value;
  return transactions.value.filter(tx => tx.status === filterStatus.value);
});

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1);

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const executeModalAction = () => {
  if (pendingAction.value) pendingAction.value();
  showModal.value = false;
};

const reviewDispute = (tx: any) => {
  modalTitle.value = 'Review Transaction';
  modalMessage.value = `Opening review panel for transaction: ${tx._id}. (Feature coming soon)`;
  pendingAction.value = () => {};
  showModal.value = true;
};

const fetchData = async () => {
  try {
    const token = localStorage.getItem('barter_token') || 'test';
    const response = await fetch('http://localhost:3005/api/v1/escrow/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      transactions.value = await response.json();
    } else {
      // Mock data for demo
      transactions.value = [
        { _id: 'TXN-8F92A-4B', amount: 45000, status: 'disputed' },
        { _id: 'TXN-1B77X-9C', amount: 120000, status: 'released' },
        { _id: 'TXN-3J90Q-5M', amount: 15500, status: 'held' }
      ];
    }
  } catch (err) {
    console.error(err);
    // Mock data for demo
    transactions.value = [
      { _id: 'TXN-8F92A-4B', amount: 45000, status: 'disputed' },
      { _id: 'TXN-1B77X-9C', amount: 120000, status: 'released' },
      { _id: 'TXN-3J90Q-5M', amount: 15500, status: 'held' }
    ];
  } finally {
    loading.value = false;
  }
};
</script>