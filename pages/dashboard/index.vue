<template>
  <div class="space-y-6">
    <div v-if="loading" class="py-12 flex justify-center items-center h-[60vh]">
      <Loader2 class="animate-spin h-10 w-10 text-brand-600" />
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start justify-between gap-4">
      <div class="flex items-start">
        <AlertCircle class="w-5 h-5 mt-0.5 mr-2 shrink-0" />
        <div>
          <h3 class="font-bold">Error loading dashboard</h3>
          <p class="text-sm mt-1">{{ error }}</p>
        </div>
      </div>
      <button @click="fetchStats" class="shrink-0 px-4 py-2 bg-white border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors">
        Try again
      </button>
    </div>

    <div v-else class="space-y-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard class="w-16 h-16 text-brand-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Volume</p>
            <p class="text-3xl font-black text-slate-900">₦{{ totalVolume.toLocaleString() }}</p>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-slate-400">Across {{ escrows.length }} escrow transaction{{ escrows.length === 1 ? '' : 's' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users class="w-16 h-16 text-blue-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Users</p>
            <p class="text-3xl font-black text-slate-900">{{ users.length }}</p>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-slate-400">{{ verifiedUsers }} verified account{{ verifiedUsers === 1 ? '' : 's' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert class="w-16 h-16 text-amber-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Active Disputes</p>
            <p class="text-3xl font-black text-slate-900">{{ activeDisputes }}</p>
            <div class="mt-4 flex items-center text-sm">
              <AlertCircle class="w-4 h-4 text-amber-500 mr-1" />
              <span class="text-amber-600 font-medium">{{ activeDisputes > 0 ? 'Needs attention' : 'Nothing to review' }}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 class="w-16 h-16 text-emerald-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Completed Escrows</p>
            <p class="text-3xl font-black text-slate-900">{{ escrows.filter(e => e.status === 'completed').length }}</p>
            <div class="mt-4 flex items-center text-sm">
              <span class="text-slate-400">Total successful trades</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Users Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-800">Recent Users</h3>
            <NuxtLink to="/dashboard/users" class="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</NuxtLink>
          </div>
          <div class="flex-1 overflow-auto">
            <div v-if="users.length === 0" class="p-4 sm:p-8 text-center text-slate-500 flex flex-col items-center">
              <Users class="w-10 h-10 text-slate-300 mb-2" />
              <p>No users found</p>
            </div>
            <table v-else class="min-w-full divide-y divide-slate-100">
              <thead class="bg-slate-50/50">
                <tr>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-100">
                <tr v-for="user in users.slice(0, 5)" :key="user.id || user._id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img class="h-10 w-10 rounded-full bg-slate-200" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`" alt="">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">{{ user.name || 'Unknown' }}</div>
                        <div class="text-sm text-slate-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span v-if="user.isVerified" class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                    <span v-else class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      Unverified
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Escrows Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-800">Recent Escrows</h3>
            <NuxtLink to="/dashboard/disputes" class="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</NuxtLink>
          </div>
          <div class="flex-1 overflow-auto">
            <div v-if="escrows.length === 0" class="p-4 sm:p-8 text-center text-slate-500 flex flex-col items-center">
              <ShieldAlert class="w-10 h-10 text-slate-300 mb-2" />
              <p>No escrows found</p>
            </div>
            <table v-else class="min-w-full divide-y divide-slate-100">
              <thead class="bg-slate-50/50">
                <tr>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-100">
                <tr v-for="escrow in escrows.slice(0, 5)" :key="escrow.id || escrow._id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-slate-900">₦{{ (escrow.amount || 0).toLocaleString() }}</div>
                    <div class="text-sm text-slate-500 mt-1 flex items-center">
                      <span class="font-mono">{{ (escrow.id || escrow._id).substring(0, 8) }}...</span>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': escrow.status === 'completed',
                        'bg-amber-50 text-amber-700 border-amber-200': escrow.status === 'pending' || !escrow.status,
                        'bg-red-50 text-red-700 border-red-200': escrow.status === 'disputed'
                      }">
                      {{ escrow.status ? (escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)) : 'Pending' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAdminStats } from '@/composables/modules/admin/useAdmin';
import {
  Loader2,
  AlertCircle,
  CreditCard,
  Users,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-vue-next';

const { loading, users, escrows, error, fetchStats } = useAdminStats();

const totalVolume = computed(() =>
  (escrows.value || []).reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0),
);

const verifiedUsers = computed(() =>
  (users.value || []).filter((user: any) => user.isVerified).length,
);

const activeDisputes = computed(() =>
  (escrows.value || []).filter((tx: any) => tx.status === 'disputed').length,
);

onMounted(() => {
  fetchStats();
});
</script>