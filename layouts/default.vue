
<template>
  <div class="min-h-screen bg-slate-100 flex">
    <aside class="w-64 bg-slate-900 text-white p-6 hidden md:block shrink-0">
      <h1 class="text-2xl font-black mb-8 text-blue-500">Barter Admin</h1>
      <nav class="space-y-4">
        <NuxtLink to="/" class="block hover:text-white font-bold" active-class="text-blue-400" inactive-class="text-slate-400">Dashboard</NuxtLink>
        <NuxtLink to="/disputes" class="block hover:text-white font-bold" active-class="text-blue-400" inactive-class="text-slate-400">Escrow Disputes</NuxtLink>
        <NuxtLink to="/users" class="block hover:text-white font-bold" active-class="text-blue-400" inactive-class="text-slate-400">Users</NuxtLink>
        <NuxtLink to="/logistics" class="block hover:text-white font-bold" active-class="text-blue-400" inactive-class="text-slate-400">Logistics</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
