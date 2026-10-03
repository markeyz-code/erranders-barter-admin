<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col shrink-0 hidden md:flex transition-all duration-300">
      <div class="p-6 border-b border-slate-100 flex items-center gap-2">
        <div class="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border border-slate-200">
          <ArrowRightLeft class="w-4 h-4 text-white" />
        </div>
        <span class="font-black text-xl tracking-tighter text-slate-900">Barter.</span>
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
          Chats & Complaints
          <span class="absolute right-4 w-2 h-2 bg-red-500 rounded-full"></span>
        </NuxtLink>
        
        <NuxtLink to="/dashboard/logistics" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group" active-class="bg-brand-50 text-brand-700" inactive-class="text-slate-600 hover:bg-slate-50 hover:text-slate-900">
          <Truck class="w-5 h-5 mr-3 shrink-0" :class="{'text-brand-600': $route.path.startsWith('/dashboard/logistics'), 'text-slate-400 group-hover:text-slate-600': !$route.path.startsWith('/dashboard/logistics')}" />
          Logistics
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
          <button class="md:hidden text-slate-500 hover:text-slate-700 mr-4">
            <Menu class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-semibold text-slate-800 capitalize">{{ currentRouteName }}</h2>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Notifications Dropdown -->
          <div class="relative">
            <button @click="showNotifications = !showNotifications; showProfile = false" class="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-slate-800">Notifications</h3>
                <button class="text-xs text-brand-600 font-semibold hover:underline">Mark all read</button>
              </div>
              <div class="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
                <div class="p-4 hover:bg-slate-50 cursor-pointer transition-colors" v-for="i in 3" :key="i">
                  <p class="text-sm font-medium text-slate-800">New escrow dispute opened</p>
                  <p class="text-xs text-slate-500 mt-1">Transaction #TXN-{{i}}892 needs your attention.</p>
                  <span class="text-[10px] text-slate-400 mt-2 block">10 minutes ago</span>
                </div>
              </div>
              <div class="p-3 border-t border-slate-100 text-center bg-slate-50">
                <NuxtLink to="/dashboard/notifications" @click="showNotifications = false" class="text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors">View All Notifications</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button @click="showProfile = !showProfile; showNotifications = false" class="h-9 w-9 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center overflow-hidden hover:border-brand-400 transition-colors">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin" class="w-full h-full object-cover">
            </button>
            <div v-if="showProfile" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div class="h-10 w-10 rounded-full overflow-hidden bg-brand-100">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin">
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Admin User</h3>
                  <p class="text-xs text-slate-500">Superadmin</p>
                </div>
              </div>
              <div class="p-2 space-y-1">
                <NuxtLink to="/dashboard/profile" class="flex items-center px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                  <User class="w-4 h-4 mr-3 text-slate-400" /> My Profile
                </NuxtLink>
                <NuxtLink to="/dashboard/settings" class="flex items-center px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                  <Settings class="w-4 h-4 mr-3 text-slate-400" /> Preferences
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  Truck, 
  LogOut,
  Menu,
  Bell,
  ArrowRightLeft,
  MessageSquare,
  ShoppingBag,
  User,
  Settings
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const showNotifications = ref(false);
const showProfile = ref(false);

const currentRouteName = computed(() => {
  if (route.path === '/dashboard' || route.path === '/dashboard/') return 'Dashboard Overview';
  const parts = route.path.split('/');
  const name = parts[parts.length - 1]; // get the last part of the url, eg 'users' from '/dashboard/users'
  return name ? name.replace(/-/g, ' ') : '';
});

const showLogoutModal = ref(false);

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  showLogoutModal.value = false;
  router.push('/login');
};
</script>
