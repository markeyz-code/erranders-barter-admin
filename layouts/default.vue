<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col shrink-0 hidden md:flex transition-all duration-300">
      <div class="p-6 border-b border-slate-100 flex items-center justify-center">
        <img src="/logo.png" alt="Erranders Barter Admin" class="h-10 w-auto" />
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <NuxtLink to="/dashboard" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <LayoutDashboard class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path === '/dashboard', 'text-slate-400 group-hover:text-slate-600': $route.path !== '/dashboard'}" />
          Dashboard
        </NuxtLink>
        
        <NuxtLink to="/dashboard/disputes" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <ShieldAlert class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/disputes'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/disputes')}" />
          Escrow Disputes
        </NuxtLink>
        
        <NuxtLink to="/dashboard/users" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Users class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/users'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/users')}" />
          Users
        </NuxtLink>

        <NuxtLink to="/dashboard/items" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <ShoppingBag class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/items'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/items')}" />
          Marketplace
        </NuxtLink>

        <NuxtLink to="/dashboard/chats" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <MessageSquare class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/chats'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/chats')}" />
          Conversations
        </NuxtLink>
        
        <NuxtLink to="/dashboard/logistics" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Truck class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/logistics'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/logistics')}" />
          Logistics
        </NuxtLink>
        <NuxtLink to="/dashboard/services" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Briefcase class="w-5 h-5 mr-3 shrink-0" />
          Services
        </NuxtLink>
        <NuxtLink to="/dashboard/bookings" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <CalendarDays class="w-5 h-5 mr-3 shrink-0" />
          Bookings
        </NuxtLink>
        <NuxtLink to="/dashboard/providers" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Users class="w-5 h-5 mr-3 shrink-0" />
          Providers
        </NuxtLink>
        <NuxtLink to="/dashboard/businesses" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Building2 class="w-5 h-5 mr-3 shrink-0" />
          Businesses
        </NuxtLink>

        <NuxtLink to="/dashboard/categories" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Tags class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/categories'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/categories')}" />
          Categories
        </NuxtLink>

        <NuxtLink to="/dashboard/settings" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Settings class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/settings'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/settings')}" />
          Platform Settings
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <button @click="handleLogout" class="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200">
          <LogOut class="w-5 h-5 mr-3 text-slate-400" />
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
      <!-- Top header -->
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
        <div class="flex items-center">
          <h2 class="text-lg font-semibold text-slate-800 capitalize">{{ currentRouteName }}</h2>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Profile Dropdown (real signed-in account from GET /users/me) -->
          <div class="relative">
            <button @click="showProfile = !showProfile" class="h-9 w-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center overflow-hidden hover:border-brand-400 transition-colors">
              <img v-if="profile?.avatar" :src="profile.avatar" alt="Account" class="w-full h-full object-cover">
              <span v-else class="text-xs font-black text-brand-700">{{ accountInitials }}</span>
            </button>
            <div v-if="showProfile" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div class="h-10 w-10 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center">
                  <img v-if="profile?.avatar" :src="profile.avatar" alt="Account" class="w-full h-full object-cover">
                  <span v-else class="text-xs font-black text-brand-700">{{ accountInitials }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 truncate">{{ accountName }}</h3>
                  <p class="text-sm text-slate-500 truncate">{{ profile?.email || 'Signed in' }}</p>
                </div>
              </div>
              <div class="p-2 space-y-1">
                <NuxtLink to="/dashboard/settings" class="flex items-center px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                  <Settings class="w-4 h-4 mr-3 text-slate-400" /> Platform settings
                </NuxtLink>
                <div class="h-px bg-slate-100 my-1"></div>
                <button @click="handleLogout" class="w-full flex items-center px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut class="w-4 h-4 mr-3 text-red-400" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        <slot />
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Confirm Logout</h3>
          <p class="text-slate-500 text-sm mb-6">Are you sure you want to sign out of the admin dashboard?</p>
          <div class="flex gap-3 justify-end">
            <button @click="showLogoutModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button @click="confirmLogout" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LayoutDashboard, ShieldAlert, Users, Truck, LogOut, MessageSquare, ShoppingBag, Settings, Briefcase, CalendarDays, Tags, Building2 } from 'lucide-vue-next';
import { usersApi } from '~/api_factory/modules/users';

const route = useRoute();
const router = useRouter();

const showProfile = ref(false);
const profile = ref<any | null>(null);

const currentRouteName = computed(() => {
  if (route.path === '/dashboard' || route.path === '/dashboard/') return 'Dashboard Overview';
  const parts = route.path.split('/');
  const name = parts[parts.length - 1]; // get the last part of the url, eg 'users' from '/dashboard/users'
  return name ? name.replace(/-/g, ' ') : '';
});

const accountName = computed(() => {
  if (!profile.value) return 'Account';
  const full = `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
  return full || profile.value.email || 'Account';
});

const accountInitials = computed(() => {
  if (!profile.value) return 'A';
  const initials = `${profile.value.firstName?.[0] || ''}${profile.value.lastName?.[0] || ''}`;
  return (initials || profile.value.email?.[0] || 'A').toUpperCase();
});

onMounted(async () => {
  try {
    const { data } = await usersApi.getProfile();
    profile.value = data || null;
  } catch {
    // The header shows "Account" until a real profile is available. It never
    // invents a name or a role.
  }
});

const showLogoutModal = ref(false);

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  showLogoutModal.value = false;
  const token = useCookie('barter_token', { path: '/' });
  token.value = null;
  if (typeof window !== 'undefined') {
    document.cookie = 'barter_token=; Max-Age=0; path=/';
    localStorage.removeItem('barter_token');
  }
  router.push('/login');
};
</script>
