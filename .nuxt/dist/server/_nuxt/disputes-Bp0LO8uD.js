import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderTeleport } from "vue/server-renderer";
import { Download, Loader2, ShieldCheck, Hash, AlertTriangle, CheckCircle2, Clock, MoreVertical, Search, MessageSquare, ArrowRightLeft } from "lucide-vue-next";
const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "disputes",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = ref([]);
    const loading = ref(true);
    const filterStatus = ref("all");
    const activeDropdown = ref(null);
    const currentPage = ref(1);
    const showModal = ref(false);
    const modalTitle = ref("");
    const modalMessage = ref("");
    ref(null);
    const filteredTransactions = computed(() => {
      if (filterStatus.value === "all") return transactions.value;
      return transactions.value.filter((tx) => tx.status === filterStatus.value);
    });
    const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1);
    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredTransactions.value.slice(start, end);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h2 class="text-2xl font-black text-slate-900 tracking-tight">Escrow Disputes</h2><p class="text-sm text-slate-500 mt-1">Review and resolve transaction disputes securely.</p></div><div class="flex gap-3"><button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center">`);
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Export Report </button></div></div><div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"><div class="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50"><div class="flex items-center gap-2"><select class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white min-w-[150px]"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "all") : ssrLooseEqual(filterStatus.value, "all")) ? " selected" : ""}>All Transactions</option><option value="disputed"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "disputed") : ssrLooseEqual(filterStatus.value, "disputed")) ? " selected" : ""}>Disputed Only</option><option value="released"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "released") : ssrLooseEqual(filterStatus.value, "released")) ? " selected" : ""}>Released</option><option value="held"${ssrIncludeBooleanAttr(Array.isArray(filterStatus.value) ? ssrLooseContain(filterStatus.value, "held") : ssrLooseEqual(filterStatus.value, "held")) ? " selected" : ""}>Held</option></select></div></div><div class="flex-1 overflow-x-auto min-h-[400px]">`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center h-64">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-10 w-10 text-brand-600 mb-4" }, null, _parent));
        _push(`<p class="text-slate-500 font-medium">Loading transactions...</p></div>`);
      } else if (filteredTransactions.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center h-64 text-center px-4"><div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-8 h-8 text-slate-400" }, null, _parent));
        _push(`</div><h3 class="text-lg font-bold text-slate-900 mb-1">No transactions found</h3><p class="text-slate-500 text-sm max-w-sm">There are no escrows matching the current filter. Excellent work keeping the dispute queue clean!</p><button class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Filter</button></div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-slate-100 text-left"><thead class="bg-slate-50/50"><tr><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Transaction ID</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Amount</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th></tr></thead><tbody class="bg-white divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(paginatedTransactions.value, (tx) => {
          _push(`<tr class="hover:bg-slate-50/80 transition-colors group"><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">`);
          _push(ssrRenderComponent(unref(Hash), { class: "w-4 h-4 text-slate-400" }, null, _parent));
          _push(`</div><div><div class="text-sm font-bold text-slate-900 font-mono">${ssrInterpolate(tx._id)}</div><div class="text-sm text-slate-500">Created: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</div></div></div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><div class="text-sm font-black text-slate-900">₦${ssrInterpolate(Number(tx.amount || 0).toLocaleString())}</div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap">`);
          if (tx.status === "disputed") {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">`);
            _push(ssrRenderComponent(unref(AlertTriangle), { class: "w-3 h-3 mr-1" }, null, _parent));
            _push(` Disputed </span>`);
          } else if (tx.status === "released") {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">`);
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-3 h-3 mr-1" }, null, _parent));
            _push(` Released </span>`);
          } else {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">`);
            _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3 mr-1" }, null, _parent));
            _push(` Held </span>`);
          }
          _push(`</td><td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="relative inline-block text-left"><button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">`);
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button>`);
          if (activeDropdown.value === tx._id) {
            _push(`<div class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50"><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` Review Details </button><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(MessageSquare), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` Contact Parties </button></div><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium">`);
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-4 h-4 mr-2 text-emerald-400" }, null, _parent));
            _push(` Force Release </button><button class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium mt-1">`);
            _push(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-4 h-4 mr-2 text-red-400" }, null, _parent));
            _push(` Force Refund </button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (filteredTransactions.value.length > 0) {
        _push(`<div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between"><span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">${ssrInterpolate((currentPage.value - 1) * itemsPerPage + 1)}</span> to <span class="font-semibold text-slate-900">${ssrInterpolate(Math.min(currentPage.value * itemsPerPage, filteredTransactions.value.length))}</span> of <span class="font-semibold text-slate-900">${ssrInterpolate(filteredTransactions.value.length)}</span> results</span><div class="flex gap-2"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/disputes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=disputes-Bp0LO8uD.js.map
