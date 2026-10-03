import { _ as __nuxt_component_0 } from "./nuxt-link-A89XnCLf.js";
import { ref, defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { a as GATEWAY_ENDPOINT_WITH_AUTH } from "./axios.config-CygDw6DA.js";
import { Loader2, AlertCircle, CreditCard, TrendingUp, Users, ShieldAlert, CheckCircle2 } from "lucide-vue-next";
import "/Users/marquis/erranders/barter/admin/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/marquis/erranders/barter/admin/node_modules/defu/dist/defu.mjs";
import "axios";
const adminApi = {
  getUsers: () => GATEWAY_ENDPOINT_WITH_AUTH.get("/users/admin/all"),
  getEscrows: () => GATEWAY_ENDPOINT_WITH_AUTH.get("/escrow/admin/all")
};
const useAdminStats = () => {
  const loading = ref(false);
  const users = ref([]);
  const escrows = ref([]);
  const error = ref(null);
  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [usersRes, escrowsRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getEscrows()
      ]);
      users.value = usersRes.data || [];
      escrows.value = escrowsRes.data || [];
    } catch (err) {
      console.warn("Dashboard fetch failed, showing empty state:", err.message);
      error.value = null;
      users.value = [];
      escrows.value = [];
    } finally {
      loading.value = false;
    }
  };
  return { loading, users, escrows, error, fetchStats };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    let statsInstance = {
      loading: ref(false),
      users: ref([]),
      escrows: ref([]),
      error: ref(null),
      fetchStats: async () => {
      }
    };
    try {
      statsInstance = useAdminStats();
    } catch (e) {
      console.warn("useAdminStats missing");
    }
    const { loading, users, escrows, error, fetchStats } = statsInstance;
    const totalVolume = computed(() => {
      return (escrows.value || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="py-12 flex justify-center items-center h-[60vh]">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin h-10 w-10 text-brand-600" }, null, _parent));
        _push(`</div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 mt-0.5 mr-2 shrink-0" }, null, _parent));
        _push(`<div><h3 class="font-bold">Error loading dashboard</h3><p class="text-sm mt-1">${ssrInterpolate(unref(error))}</p></div></div>`);
      } else {
        _push(`<div class="space-y-6"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">`);
        _push(ssrRenderComponent(unref(CreditCard), { class: "w-16 h-16 text-brand-600" }, null, _parent));
        _push(`</div><div class="relative z-10"><p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Volume</p><p class="text-3xl font-black text-slate-900">₦${ssrInterpolate(totalVolume.value.toLocaleString())}</p><div class="mt-4 flex items-center text-sm">`);
        _push(ssrRenderComponent(unref(TrendingUp), { class: "w-4 h-4 text-emerald-500 mr-1" }, null, _parent));
        _push(`<span class="text-emerald-600 font-medium">+12%</span><span class="text-slate-400 ml-2">from last month</span></div></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">`);
        _push(ssrRenderComponent(unref(Users), { class: "w-16 h-16 text-blue-600" }, null, _parent));
        _push(`</div><div class="relative z-10"><p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Total Users</p><p class="text-3xl font-black text-slate-900">${ssrInterpolate(unref(users).length)}</p><div class="mt-4 flex items-center text-sm">`);
        _push(ssrRenderComponent(unref(TrendingUp), { class: "w-4 h-4 text-emerald-500 mr-1" }, null, _parent));
        _push(`<span class="text-emerald-600 font-medium">+42</span><span class="text-slate-400 ml-2">new users</span></div></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">`);
        _push(ssrRenderComponent(unref(ShieldAlert), { class: "w-16 h-16 text-amber-600" }, null, _parent));
        _push(`</div><div class="relative z-10"><p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Active Disputes</p><p class="text-3xl font-black text-slate-900">3</p><div class="mt-4 flex items-center text-sm">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 text-amber-500 mr-1" }, null, _parent));
        _push(`<span class="text-amber-600 font-medium">Needs attention</span></div></div></div><div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-16 h-16 text-emerald-600" }, null, _parent));
        _push(`</div><div class="relative z-10"><p class="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Completed Escrows</p><p class="text-3xl font-black text-slate-900">${ssrInterpolate(unref(escrows).filter((e) => e.status === "completed").length)}</p><div class="mt-4 flex items-center text-sm"><span class="text-slate-400">Total successful trades</span></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col"><div class="p-6 border-b border-slate-100 flex justify-between items-center"><h3 class="text-lg font-bold text-slate-800">Recent Users</h3>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/users",
          class: "text-sm font-semibold text-brand-600 hover:text-brand-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`View All`);
            } else {
              return [
                createTextVNode("View All")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex-1 overflow-auto">`);
        if (unref(users).length === 0) {
          _push(`<div class="p-8 text-center text-slate-500 flex flex-col items-center">`);
          _push(ssrRenderComponent(unref(Users), { class: "w-10 h-10 text-slate-300 mb-2" }, null, _parent));
          _push(`<p>No users found</p></div>`);
        } else {
          _push(`<table class="min-w-full divide-y divide-slate-100"><thead class="bg-slate-50/50"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th><th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th></tr></thead><tbody class="bg-white divide-y divide-slate-100"><!--[-->`);
          ssrRenderList(unref(users).slice(0, 5), (user) => {
            _push(`<tr class="hover:bg-slate-50/50 transition-colors"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="h-10 w-10 flex-shrink-0"><img class="h-10 w-10 rounded-full bg-slate-200"${ssrRenderAttr("src", `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`)} alt=""></div><div class="ml-4"><div class="text-sm font-medium text-slate-900">${ssrInterpolate(user.name || "Unknown")}</div><div class="text-sm text-slate-500">${ssrInterpolate(user.email)}</div></div></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"> Active </span></td></tr>`);
          });
          _push(`<!--]--></tbody></table>`);
        }
        _push(`</div></div><div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col"><div class="p-6 border-b border-slate-100 flex justify-between items-center"><h3 class="text-lg font-bold text-slate-800">Recent Escrows</h3><button class="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</button></div><div class="flex-1 overflow-auto">`);
        if (unref(escrows).length === 0) {
          _push(`<div class="p-8 text-center text-slate-500 flex flex-col items-center">`);
          _push(ssrRenderComponent(unref(ShieldAlert), { class: "w-10 h-10 text-slate-300 mb-2" }, null, _parent));
          _push(`<p>No escrows found</p></div>`);
        } else {
          _push(`<table class="min-w-full divide-y divide-slate-100"><thead class="bg-slate-50/50"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th><th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th></tr></thead><tbody class="bg-white divide-y divide-slate-100"><!--[-->`);
          ssrRenderList(unref(escrows).slice(0, 5), (escrow) => {
            _push(`<tr class="hover:bg-slate-50/50 transition-colors"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-bold text-slate-900">₦${ssrInterpolate((escrow.amount || 0).toLocaleString())}</div><div class="text-xs text-slate-500 mt-1 flex items-center"><span class="font-mono">${ssrInterpolate((escrow.id || escrow._id).substring(0, 8))}...</span></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([{
              "bg-emerald-50 text-emerald-700 border-emerald-200": escrow.status === "completed",
              "bg-amber-50 text-amber-700 border-amber-200": escrow.status === "pending" || !escrow.status,
              "bg-red-50 text-red-700 border-red-200": escrow.status === "disputed"
            }, "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border"])}">${ssrInterpolate(escrow.status ? escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1) : "Pending")}</span></td></tr>`);
          });
          _push(`<!--]--></tbody></table>`);
        }
        _push(`</div></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DoM0fpOr.js.map
