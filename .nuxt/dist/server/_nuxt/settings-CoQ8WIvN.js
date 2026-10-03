import { ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import { Settings } from "lucide-vue-next";
import "./axios.config-CnWRis1o.js";
import "/Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs";
import "axios";
const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const saving = ref(false);
    const baseErranderFee = ref(500);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-end"><div><h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Platform Settings</h1><p class="text-slate-500 font-medium">Configure global parameters and logistics.</p></div></div><div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl"><h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-5 h-5 text-brand-600" }, null, _parent));
      _push(` Logistics Settings </h2>`);
      if (loading.value) {
        _push(`<div class="text-center py-10"><div class="w-8 h-8 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-2"></div><p class="text-slate-500 font-bold text-sm">Loading settings...</p></div>`);
      } else {
        _push(`<form class="space-y-6"><div><label class="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Base Errander Delivery Fee (₦)</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span><input${ssrRenderAttr("value", baseErranderFee.value)} type="number" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 font-bold transition-colors"></div><p class="text-xs text-slate-500 mt-2 font-medium">This is the minimum fee buyers must offer when selecting Errander Delivery. Buyers can negotiate by offering higher amounts for faster service.</p></div><button type="submit"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50">${ssrInterpolate(saving.value ? "Saving..." : "Save Settings")}</button></form>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=settings-CoQ8WIvN.js.map
