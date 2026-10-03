<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Platform Settings</h1>
        <p class="text-slate-500 font-medium">Configure global parameters and logistics.</p>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl">
      <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings class="w-5 h-5 text-brand-600" /> Logistics Settings
      </h2>
      
      <div v-if="loading" class="text-center py-10">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-slate-500 font-bold text-sm">Loading settings...</p>
      </div>

      <form v-else @submit.prevent="saveSettings" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Base Errander Delivery Fee (₦)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
            <input 
              v-model.number="baseErranderFee" 
              type="number" 
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
            />
          </div>
          <p class="text-xs text-slate-500 mt-2 font-medium">This is the minimum fee buyers must offer when selecting Errander Delivery. Buyers can negotiate by offering higher amounts for faster service.</p>
        </div>

        <button 
          type="submit" 
          :disabled="saving"
          class="bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { settingsApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const loading = ref(true)
const saving = ref(false)
const baseErranderFee = ref(500)

const fetchSettings = async () => {
  loading.value = true
  try {
    const { data } = await settingsApi.get('base_errander_fee')
    if (data && data.value) {
      baseErranderFee.value = Number(data.value)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    await settingsApi.update('base_errander_fee', baseErranderFee.value)
    alert('Settings updated successfully!')
  } catch (err) {
    alert('Failed to update settings')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
