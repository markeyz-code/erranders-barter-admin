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

    <div v-else-if="stats" class="space-y-6">
      <!-- Every tile below is a real counter from GET /admin/stats. -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users class="w-16 h-16 text-blue-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Users</p>
            <p class="text-3xl font-black text-slate-900">{{ stats.users.total.toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ stats.users.verified.toLocaleString() }} verified</span>
              <span v-if="stats.users.suspended > 0" class="text-red-500 font-medium">{{ stats.users.suspended }} suspended</span>
              <span v-if="stats.users.admins > 0" class="text-brand-600 font-medium">{{ stats.users.admins }} admin{{ stats.users.admins === 1 ? '' : 's' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingBag class="w-16 h-16 text-emerald-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Active Listings</p>
            <p class="text-3xl font-black text-slate-900">{{ stats.items.active.toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ stats.items.total.toLocaleString() }} total</span>
              <span>{{ stats.items.promoted.toLocaleString() }} featured</span>
              <span v-if="stats.items.inactive > 0" class="text-amber-600 font-medium">{{ stats.items.inactive }} inactive</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard class="w-16 h-16 text-brand-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Escrow Value Held</p>
            <p class="text-3xl font-black text-slate-900">{{ formatMoney(stats.escrows.valueHeld) }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ stats.escrows.held.toLocaleString() }} held</span>
              <span :class="stats.escrows.disputed > 0 ? 'text-amber-600 font-medium' : ''">{{ stats.escrows.disputed.toLocaleString() }} disputed</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet class="w-16 h-16 text-purple-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Platform Fees</p>
            <p class="text-3xl font-black text-slate-900">{{ formatMoney(stats.revenue.totalFees) }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ formatMoney(stats.revenue.escrowFees) }} escrow</span>
              <span>{{ formatMoney(stats.revenue.sellerCommissions) }} commission</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock class="w-16 h-16 text-amber-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Pending Withdrawals</p>
            <p class="text-3xl font-black text-slate-900">{{ stats.withdrawals.pending.toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ formatMoney(stats.withdrawals.pendingValue) }} requested</span>
              <span v-if="stats.withdrawals.processing > 0" class="text-blue-600 font-medium">{{ stats.withdrawals.processing }} processing</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 class="w-16 h-16 text-emerald-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Released Escrows</p>
            <p class="text-3xl font-black text-slate-900">{{ stats.escrows.released.toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>{{ stats.escrows.refunded.toLocaleString() }} refunded</span>
              <span>{{ stats.escrows.total.toLocaleString() }} total</span>
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase class="w-16 h-16 text-indigo-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Campus Services</p>
            <p class="text-3xl font-black text-slate-900">{{ (stats.services?.total ?? 0).toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span class="text-emerald-600 font-medium">{{ stats.services?.active ?? 0 }} active</span>
              <span>{{ stats.services?.remote ?? 0 }} online/remote</span>
              <span v-if="(stats.services?.inactive ?? 0) > 0" class="text-amber-600 font-medium">{{ stats.services?.inactive }} paused</span>
            </div>
          </div>
        </div>

        <!-- Bookings -->
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar class="w-16 h-16 text-rose-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Bookings</p>
            <p class="text-3xl font-black text-slate-900">{{ (stats.bookings?.total ?? 0).toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span class="text-emerald-600 font-medium">{{ stats.bookings?.confirmed ?? 0 }} confirmed</span>
              <span>{{ stats.bookings?.completed ?? 0 }} completed</span>
              <span class="text-slate-600 font-semibold">{{ formatMoney(stats.bookings?.totalValue ?? 0) }}</span>
            </div>
          </div>
        </div>

        <!-- Providers -->
        <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles class="w-16 h-16 text-violet-600" />
          </div>
          <div class="relative z-10">
            <p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Service Providers</p>
            <p class="text-3xl font-black text-slate-900">{{ (stats.providers?.total ?? 0).toLocaleString() }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              <span class="text-indigo-600 font-medium">Students offering skills</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
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
                <tr v-for="user in users.slice(0, 5)" :key="user._id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img class="h-10 w-10 rounded-full bg-slate-200 object-cover" :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userName(user))}&background=random`" alt="">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">{{ userName(user) }}</div>
                        <div class="text-sm text-slate-500">{{ user.email || '—' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span v-if="user.isActive === false" class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
                      Suspended
                    </span>
                    <span v-else-if="user.isVerified" class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                    <span v-else class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      Unverified
                    </span>
                    <span v-if="user.isAdmin" class="ml-2 px-2 py-0.5 inline-flex text-xs font-bold rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      Admin
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Escrows -->
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
                <tr v-for="escrow in escrows.slice(0, 5)" :key="escrow._id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-slate-900">{{ formatMoney(escrow.amount) }}</div>
                    <div class="text-xs text-slate-500 mt-1">
                      {{ partyName(escrow.buyer) }} → {{ partyName(escrow.seller) }}
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border" :class="escrowStatusClass(escrow.status)">
                      {{ escrowStatusLabel(escrow.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        <div class="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Recent Service Bookings</h3>
            <p class="text-xs text-slate-400 mt-0.5">Real-time appointments booked across campus skill providers</p>
          </div>
          <NuxtLink to="/dashboard/bookings" class="text-sm font-semibold text-brand-600 hover:text-brand-700">View All Bookings</NuxtLink>
        </div>
        <div class="flex-1 overflow-auto">
          <div v-if="bookings.length === 0" class="p-4 sm:p-8 text-center text-slate-500 flex flex-col items-center">
            <Calendar class="w-10 h-10 text-slate-300 mb-2" />
            <p>No bookings found</p>
          </div>
          <table v-else class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/50">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer & Provider</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-for="b in bookings.slice(0, 5)" :key="b._id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      <Video v-if="isBookingRemote(b)" class="w-4 h-4 text-emerald-600" />
                      <Briefcase v-else class="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-slate-900">{{ bookingServiceName(b) }}</div>
                      <span v-if="isBookingRemote(b)" class="inline-flex items-center text-xs font-medium text-emerald-600">
                        Online / Video Call
                      </span>
                      <span v-else class="inline-flex items-center text-xs text-slate-400">
                        In-person appointment
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                  <div class="font-medium text-slate-900">{{ bookingParty(b.customerId) }} <span class="text-slate-400 font-normal">(Customer)</span></div>
                  <div class="text-slate-500 mt-0.5">by {{ bookingParty(b.providerId) }} <span class="text-slate-400 font-normal">(Provider)</span></div>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                  <div class="font-medium text-slate-900">{{ b.date || '—' }}</div>
                  <div class="text-slate-500 mt-0.5">{{ b.startTime || '—' }} <span v-if="b.endTime">- {{ b.endTime }}</span></div>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                  {{ formatMoney(b.amount) }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize" :class="bookingStatusClass(b.status)">
                    {{ b.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStats } from '@/composables/modules/admin/useAdmin';
import type { AdminUser, AdminUserSummary, AdminBooking } from '@/api_factory/modules/adminManagement';
import {
  Loader2,
  AlertCircle,
  CreditCard,
  Users,
  ShieldAlert,
  CheckCircle2,
  ShoppingBag,
  Wallet,
  Clock,
  Briefcase,
  Calendar,
  Sparkles,
  Video,
} from 'lucide-vue-next';

const { loading, stats, users, escrows, bookings, error, fetchStats } = useAdminStats();

const formatMoney = (value?: number) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

const userName = (user: AdminUser) => {
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return full || user.email || 'Unknown user';
};

const partyName = (party?: AdminUserSummary | null) => {
  if (!party) return 'Unknown';
  const full = `${party.firstName || ''} ${party.lastName || ''}`.trim();
  return full || party.email || 'Unknown';
};

const bookingParty = (party?: any) => {
  if (!party) return 'User';
  if (typeof party === 'string') return 'User';
  const full = `${party.firstName || ''} ${party.lastName || ''}`.trim();
  return full || party.email || 'User';
};

const bookingServiceName = (b: AdminBooking) => {
  if (b.serviceId && typeof b.serviceId === 'object' && b.serviceId.title) {
    return b.serviceId.title;
  }
  return 'Service';
};

const isBookingRemote = (b: AdminBooking) => {
  if (b.serviceId && typeof b.serviceId === 'object') {
    return !!b.serviceId.isRemote;
  }
  return !!b.meetingUrl;
};

const bookingStatusClass = (status?: string) => {
  if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'completed') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'cancelled') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

const escrowStatusLabel = (status?: string) => {
  if (status === 'held_in_escrow') return 'Held in escrow';
  if (status === 'released') return 'Released';
  if (status === 'disputed') return 'Disputed';
  if (status === 'refunded') return 'Refunded';
  return status ? status.replace(/_/g, ' ') : 'Unknown';
};

const escrowStatusClass = (status?: string) => {
  if (status === 'released') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'disputed') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'refunded') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'held_in_escrow') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

onMounted(() => {
  fetchStats();
});
</script>
