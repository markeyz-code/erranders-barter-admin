import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><main class="flex-1 p-8"><h2 class="text-3xl font-black mb-6">Logistics (Erranders Sync)</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"><h3 class="font-bold text-xl mb-4">Active Deliveries</h3><p class="text-slate-600 text-sm mb-4">Currently tracking 18 automated Erranders dispatches.</p><div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2"><p class="font-bold text-slate-800">Dispatch #ER-8842</p><p class="text-xs text-slate-500">Pickup: Mellanby Hall -&gt; Dropoff: Agbowo</p><p class="text-sm font-bold text-blue-600 mt-2">Status: Rider En Route</p></div></div></div></main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/logistics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const logistics = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  logistics as default
};
//# sourceMappingURL=logistics-LSrWlJJO.js.map
