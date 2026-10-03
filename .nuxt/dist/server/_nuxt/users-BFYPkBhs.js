import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderTeleport } from "vue/server-renderer";
import { Download, Search, Loader2, Users, CheckCircle2, AlertCircle, MoreVertical, Eye, MessageSquare, ShieldAlert } from "lucide-vue-next";
const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const users = ref([]);
    const loading = ref(true);
    const searchQuery = ref("");
    const activeDropdown = ref(null);
    const currentPage = ref(1);
    const showModal = ref(false);
    const modalTitle = ref("");
    const modalMessage = ref("");
    ref(null);
    const filteredUsers = computed(() => {
      let result = users.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(
          (u) => (u.email || "").toLowerCase().includes(q) || (u.firstName || "").toLowerCase().includes(q) || (u.lastName || "").toLowerCase().includes(q)
        );
      }
      return result;
    });
    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1);
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredUsers.value.slice(start, end);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h2 class="text-2xl font-black text-slate-900 tracking-tight">User Management</h2><p class="text-sm text-slate-500 mt-1">Manage platform users, permissions, and statuses.</p></div><div class="flex gap-3"><button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center">`);
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Export CSV </button></div></div><div class="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"><div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-4 w-4 text-slate-400" }, null, _parent));
      _push(`</div><input type="text" placeholder="Search users by email or name..." class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400 min-w-[300px]"${ssrRenderAttr("value", searchQuery.value)}></div><div class="flex items-center gap-2"><select class="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"><option value="">All Statuses</option><option value="verified">Verified</option><option value="unverified">Unverified</option><option value="banned">Banned</option></select></div></div><div class="flex-1 overflow-x-auto min-h-[400px]">`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center h-64">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-10 w-10 text-brand-600 mb-4" }, null, _parent));
        _push(`<p class="text-slate-500 font-medium">Fetching users...</p></div>`);
      } else if (filteredUsers.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center h-64 text-center px-4"><div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(Users), { class: "w-8 h-8 text-slate-400" }, null, _parent));
        _push(`</div><h3 class="text-lg font-bold text-slate-900 mb-1">No users found</h3><p class="text-slate-500 text-sm max-w-sm">We couldn&#39;t find any users matching your criteria. Try adjusting your search filters.</p><button class="mt-4 px-4 py-2 text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-xl text-sm transition-colors">Clear Search</button></div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-slate-100 text-left"><thead class="bg-slate-50/50"><tr><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">User</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Contact</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th><th scope="col" class="px-4 sm:px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th></tr></thead><tbody class="bg-white divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(paginatedUsers.value, (user) => {
          _push(`<tr class="hover:bg-slate-50/80 transition-colors group"><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="h-10 w-10 flex-shrink-0"><img class="h-10 w-10 rounded-full bg-slate-200 object-cover"${ssrRenderAttr("src", `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || "") + " " + (user.lastName || ""))}&background=random`)} alt=""></div><div class="ml-4"><div class="text-sm font-bold text-slate-900">${ssrInterpolate(user.firstName)} ${ssrInterpolate(user.lastName)}</div><div class="text-sm text-slate-500 font-medium">Joined ${ssrInterpolate(new Date(user.createdAt || Date.now()).toLocaleDateString())}</div></div></div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap"><div class="text-sm text-slate-700 font-medium">${ssrInterpolate(user.email)}</div><div class="text-sm text-slate-500">${ssrInterpolate(user.phone || "No phone provided")}</div></td><td class="px-4 sm:px-6 py-4 whitespace-nowrap">`);
          if (user.isVerified) {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">`);
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-3 h-3 mr-1" }, null, _parent));
            _push(` Verified </span>`);
          } else {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">`);
            _push(ssrRenderComponent(unref(AlertCircle), { class: "w-3 h-3 mr-1" }, null, _parent));
            _push(` Unverified </span>`);
          }
          _push(`</td><td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="relative inline-block text-left"><button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">`);
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button>`);
          if (activeDropdown.value === user._id) {
            _push(`<div class="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden divide-y divide-slate-50"><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` View Details </button><button class="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">`);
            _push(ssrRenderComponent(unref(MessageSquare), { class: "w-4 h-4 mr-2 text-slate-400" }, null, _parent));
            _push(` Send Message </button></div><div class="p-1"><button class="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">`);
            _push(ssrRenderComponent(unref(ShieldAlert), { class: "w-4 h-4 mr-2 text-red-400" }, null, _parent));
            _push(` Ban User </button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (filteredUsers.value.length > 0) {
        _push(`<div class="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between"><span class="text-sm text-slate-500">Showing <span class="font-semibold text-slate-900">${ssrInterpolate((currentPage.value - 1) * itemsPerPage + 1)}</span> to <span class="font-semibold text-slate-900">${ssrInterpolate(Math.min(currentPage.value * itemsPerPage, filteredUsers.value.length))}</span> of <span class="font-semibold text-slate-900">${ssrInterpolate(filteredUsers.value.length)}</span> results</span><div class="flex gap-2"><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50">Next</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=users-BFYPkBhs.js.map
