<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Platform Settings</h1>
        <p class="text-slate-500 font-medium">Configure global parameters, fees, and logistics.</p>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm max-w-2xl">
      <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings class="w-5 h-5 text-brand-600" /> Platform Configuration
      </h2>
      
      <div v-if="loading" class="text-center py-10">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-slate-500 font-bold text-sm">Loading settings...</p>
      </div>

      <form v-else @submit.prevent="saveSettings" class="space-y-6">
        
        <!-- Logistics Settings -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <h3 class="font-bold text-slate-800 mb-4">Logistics</h3>
          <div>
            <label class="block text-sm font-bold text-slate-700 uppercase mb-2">Base Errander Delivery Fee (₦)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
              <input 
                v-model.number="baseErranderFee" 
                type="number" 
                required
                class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
              />
            </div>
            <p class="text-sm text-slate-500 mt-2 font-medium">This is the minimum fee buyers must offer when selecting Errander Delivery.</p>
          </div>
        </div>

        <!-- Monetization Settings -->
        <div class="bg-brand-50 p-4 rounded-2xl border border-brand-200">
          <h3 class="font-bold text-brand-900 mb-4">Monetization & Fees</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-brand-800 uppercase mb-2">Escrow Fee Percentage (%)</label>
              <div class="relative">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span>
                <input 
                  v-model.number="escrowFeePercentage" 
                  type="number" 
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
                />
              </div>
              <p class="text-sm text-brand-700/80 mt-1 font-medium">The percentage charged to the buyer at checkout for buyer protection (e.g., 2%). Set to 0 for free.</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-brand-800 uppercase mb-2">Seller Commission (%)</label>
              <div class="relative">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span>
                <input 
                  v-model.number="sellerCommissionPercentage" 
                  type="number" 
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
                />
              </div>
              <p class="text-sm text-brand-700/80 mt-1 font-medium">Platform fee deducted from the seller's earnings when funds are released (e.g., 2%).</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-brand-800 uppercase mb-2">Errander Commission (%)</label>
              <div class="relative">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span>
                <input 
                  v-model.number="erranderCommissionPercentage" 
                  type="number" 
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
                />
              </div>
              <p class="text-sm text-brand-700/80 mt-1 font-medium">The percentage of the delivery fee that Barter takes as commission from the Errander (e.g., 10%).</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-brand-800 uppercase mb-2">Promoted Listing Flat Fee (₦)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span>
                <input 
                  v-model.number="promotedListingFee" 
                  type="number" 
                  min="0"
                  required
                  class="w-full bg-white border border-brand-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors" 
                />
              </div>
              <p class="text-sm text-brand-700/80 mt-1 font-medium">The flat fee sellers can optionally pay to feature their listing at the top of the Explore page.</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="saving"
          class="bg-brand-600 text-white font-bold py-3 px-4 sm:px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useCustomToast } from '@/composables/core/useCustomToast';
import { Settings } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { settingsApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const loading = ref(true)
const saving = ref(false)
const baseErranderFee = ref(500)
const escrowFeePercentage = ref(0)
const sellerCommissionPercentage = ref(0)
const erranderCommissionPercentage = ref(0)
const promotedListingFee = ref(500)

const fetchSettings = async () => {
  loading.value = true
  try {
    const [baseErranderRes, escrowFeeRes, erranderCommRes, sellerCommRes, promoFeeRes] = await Promise.all([
      settingsApi.get('base_errander_fee'),
      settingsApi.get('escrow_fee_percentage'),
      settingsApi.get('errander_commission_percentage'),
      settingsApi.get('seller_commission_percentage'),
      settingsApi.get('promoted_listing_fee')
    ])
    
    if (baseErranderRes.data && baseErranderRes.data.value) baseErranderFee.value = Number(baseErranderRes.data.value)
    if (escrowFeeRes.data && escrowFeeRes.data.value) escrowFeePercentage.value = Number(escrowFeeRes.data.value)
    if (erranderCommRes.data && erranderCommRes.data.value) erranderCommissionPercentage.value = Number(erranderCommRes.data.value)
    if (sellerCommRes.data && sellerCommRes.data.value) sellerCommissionPercentage.value = Number(sellerCommRes.data.value)
    if (promoFeeRes.data && promoFeeRes.data.value) promotedListingFee.value = Number(promoFeeRes.data.value)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    await Promise.all([
      settingsApi.update('base_errander_fee', baseErranderFee.value),
      settingsApi.update('escrow_fee_percentage', escrowFeePercentage.value),
      settingsApi.update('errander_commission_percentage', erranderCommissionPercentage.value),
      settingsApi.update('seller_commission_percentage', sellerCommissionPercentage.value),
      settingsApi.update('promoted_listing_fee', promotedListingFee.value)
    ])
    useCustomToast().showToast({ title: 'Notice', message: 'Settings updated successfully!', toastType: "success" })
  } catch (err) {
    useCustomToast().showToast({ title: 'Notice', message: 'Failed to update settings', toastType: "error" })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
