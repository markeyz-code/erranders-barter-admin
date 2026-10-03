import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderTeleport } from "vue/server-renderer";
import { Settings, Search, Loader2, ShoppingBag, Image, MapPin, MoreVertical, Eye, Edit2, Trash2 } from "lucide-vue-next";
const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "items",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const filterType = ref("all");
    const activeDropdown = ref(null);
    const currentPage = ref(1);
    const showModal = ref(false);
    const modalTitle = ref("");
    const modalMessage = ref("");
    ref(null);
    const filteredItems = computed(() => {
      let result = items.value;
      if (filterType.value !== "all") {
        result = result.filter((i) => i.type === filterType.value);
      }
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((i) => (i.title || "").toLowerCase().includes(q));
      }
      return result;
    });
    const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredItems.value.slice(start, end);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h2 class="text-2xl font-black text-slate-900 tracking-tight">Marketplace &amp; Monetization</h2><p class="text-sm text-slate-500 mt-1">Manage all Buy, Sell, and Swap listings. Automate fee collection and market integrity.</p></div><div class="flex gap-3"><button class="px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center">`);
      _push(ssrRenderComponent(unref(Settings), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Automation Rules </button></div></div><div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"><div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input type="text" placeholder="Search items by title..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[300px]"${ssrRenderAttr("value", searchQuery.value)}></div><div class="flex items-center gap-2"><select class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filterType.value) ? ssrLooseContain(filterType.value, "all") : ssrLooseEqual(filterType.value, "all")) ? " selected" : ""}>All Types</option><option value="sell"${ssrIncludeBooleanAttr(Array.isArray(filterType.value) ? ssrLooseContain(filterType.value, "sell") : ssrLooseEqual(filterType.value, "sell")) ? " selected" : ""}>Sell</option><option value="swap"${ssrIncludeBooleanAttr(Array.isArray(filterType.value) ? ssrLooseContain(filterType.value, "swap") : ssrLooseEqual(filterType.value, "swap")) ? " selected" : ""}>Swap</option><option value="service"${ssrIncludeBooleanAttr(Array.isArray(filterType.value) ? ssrLooseContain(filterType.value, "service") : ssrLooseEqual(filterType.value, "service")) ? " selected" : ""}>Services</option></select></div></div><div class="flex-1 overflow-x-auto min-h-[400px]">`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center h-64">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-10 w-10 text-brand-600 mb-4" }, null, _parent));
        _push(`<p class="text-slate-500 font-medium">Syncing live marketplace data...</p></div>`);
      } else if (filteredItems.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center h-64 text-center px-4"><div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(ShoppingBag), { class: "w-8 h-8 text-slate-400" }, null, _parent));
        _push(`</div><h3 class="text-lg font-bold text-slate-900 mb-1">No listings found</h3><p class="text-slate-500 text-sm max-w-sm">There are no items matching your criteria in the live database.</p><button class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filters</button></div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-slate-100 text-left"><thead class="bg-slate-50/50"><tr><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Item Details</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Type / Value</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Location</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Moderation</th></tr></thead><tbody class="bg-white divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(paginatedItems.value, (item) => {
          _push(`<tr class="hover:bg-slate-50/80 transition-colors group"><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">`);
          if (item.images && item.images.length) {
            _push(`<img class="h-12 w-12 object-cover"${ssrRenderAttr("src", item.images[0])}${ssrRenderAttr("alt", item.title)}>`);
          } else {
            _push(`<div class="h-full w-full flex items-center justify-center">`);
            _push(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-slate-400" }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="ml-4"><div class="text-sm font-bold text-slate-900">${ssrInterpolate(item.title)}</div><div class="text-sm text-slate-500 max-w-[200px] truncate">${ssrInterpolate(item.description)}</div></div></div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([{
            "bg-blue-100 text-blue-700": item.type === "sell",
            "bg-purple-100 text-purple-700": item.type === "swap",
            "bg-teal-100 text-teal-700": item.type === "service"
          }, "px-2 py-1 rounded-md text-sm font-bold uppercase tracking-wider"])}">${ssrInterpolate(item.type)}</span>`);
          if (item.price) {
            _push(`<div class="text-sm font-black text-slate-900 mt-1">₦${ssrInterpolate(item.price)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (item.swapPreference) {
            _push(`<div class="text-sm text-slate-500 mt-1 truncate max-w-[150px]">Wants: ${ssrInterpolate(item.swapPreference)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600"><div class="flex items-center">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "w-3 h-3 mr-1 text-slate-400" }, null, _parent));
          _push(` ${ssrInterpolate(item.location)}</div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">${ssrInterpolate(item.status)}</span></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="relative inline-block text-left"><button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">`);
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button>`);
          if (activeDropdown.value === item._id) {
            _push(`<div class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50"><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` View Listing </button><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(Edit2), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` Edit Metadata </button></div><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">`);
            _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4 mr-2 text-red-400" }, null, _parent));
            _push(` Remove Listing </button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (filteredItems.value.length > 0) {
        _push(`<div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between"><span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">${ssrInterpolate((currentPage.value - 1) * itemsPerPage + 1)}</span> to <span class="font-semibold text-slate-900">${ssrInterpolate(Math.min(currentPage.value * itemsPerPage, filteredItems.value.length))}</span> of <span class="font-semibold text-slate-900">${ssrInterpolate(filteredItems.value.length)}</span> results</span><div class="flex gap-2"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showModal.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"><div class="bg-white rounded-2xl w-full max-w-sm p-4 sm:p-6 border border-slate-200"><h3 class="text-lg font-bold text-slate-900 mb-2">${ssrInterpolate(modalTitle.value)}</h3><p class="text-slate-500 text-sm mb-6">${ssrInterpolate(modalMessage.value)}</p><div class="flex gap-3 justify-end"><button class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button><button class="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">Confirm</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/items.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=items-DRfWJoKn.js.map
