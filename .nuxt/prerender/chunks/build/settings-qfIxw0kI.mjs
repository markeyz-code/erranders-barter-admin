import { ref, mergeProps, unref, useSSRContext } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/server-renderer/index.mjs';
import { Settings } from 'file:///Users/marquis/erranders/barter/admin/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';

const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const saving = ref(false);
    const baseErranderFee = ref(500);
    const escrowFeePercentage = ref(0);
    const sellerCommissionPercentage = ref(0);
    const erranderCommissionPercentage = ref(0);
    const promotedListingFee = ref(500);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-end"><div><h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Platform Settings</h1><p class="text-slate-500 font-medium">Configure global parameters, fees, and logistics.</p></div></div><div class="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm max-w-2xl"><h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-brand-600" }, null, _parent));
      _push(` Platform Configuration </h2>`);
      if (loading.value) {
        _push(`<div class="text-center py-10"><div class="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2"></div><p class="text-slate-500 font-bold text-sm">Loading settings...</p></div>`);
      } else {
        _push(`<form class="space-y-6"><div class="bg-slate-50 p-4 rounded-2xl border border-slate-200"><h3 class="font-bold text-slate-800 mb-4">Logistics</h3><div><label class="block text-sm font-bold text-slate-700 uppercase mb-2">Base Errander Delivery Fee (\u20A6)</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">\u20A6</span><input${ssrRenderAttr("value", baseErranderFee.value)} type="number" required class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-sm text-slate-500 mt-2 font-medium">This is the minimum fee buyers must offer when selecting Errander Delivery.</p></div></div><div class="bg-brand-50 p-4 rounded-2xl border border-brand-200"><h3 class="font-bold text-brand-900 mb-4">Monetization &amp; Fees</h3><div class="space-y-4"><div><label class="block text-sm font-bold text-brand-800 uppercase mb-2">Escrow Fee Percentage (%)</label><div class="relative"><span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span><input${ssrRenderAttr("value", escrowFeePercentage.value)} type="number" min="0" max="100" step="0.1" required class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-sm text-brand-700/80 mt-1 font-medium">The percentage charged to the buyer at checkout for buyer protection (e.g., 2%). Set to 0 for free.</p></div><div><label class="block text-sm font-bold text-brand-800 uppercase mb-2">Seller Commission (%)</label><div class="relative"><span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span><input${ssrRenderAttr("value", sellerCommissionPercentage.value)} type="number" min="0" max="100" step="0.1" required class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-sm text-brand-700/80 mt-1 font-medium">Platform fee deducted from the seller&#39;s earnings when funds are released (e.g., 2%).</p></div><div><label class="block text-sm font-bold text-brand-800 uppercase mb-2">Errander Commission (%)</label><div class="relative"><span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">%</span><input${ssrRenderAttr("value", erranderCommissionPercentage.value)} type="number" min="0" max="100" step="0.1" required class="w-full bg-white border border-brand-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-sm text-brand-700/80 mt-1 font-medium">The percentage of the delivery fee that Barter takes as commission from the Errander (e.g., 10%).</p></div><div><label class="block text-sm font-bold text-brand-800 uppercase mb-2">Promoted Listing Flat Fee (\u20A6)</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">\u20A6</span><input${ssrRenderAttr("value", promotedListingFee.value)} type="number" min="0" required class="w-full bg-white border border-brand-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-sm text-brand-700/80 mt-1 font-medium">The flat fee sellers can optionally pay to feature their listing at the top of the Explore page.</p></div></div></div><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="bg-brand-600 text-white font-bold py-3 px-4 sm:px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50">${ssrInterpolate(saving.value ? "Saving..." : "Save Settings")}</button></form>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-qfIxw0kI.mjs.map
