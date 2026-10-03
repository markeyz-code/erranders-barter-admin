import { _ as __nuxt_component_0 } from "./nuxt-link-DxdT14GM.js";
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderTeleport } from "vue/server-renderer";
import { _ as _imports_0 } from "./_virtual_public-IWZl7zz2.js";
import { useRoute, useRouter } from "vue-router";
import { LayoutDashboard, ShieldAlert, Users, ShoppingBag, MessageSquare, Truck, Settings, LogOut, Menu, Bell, User } from "lucide-vue-next";
import "/Users/marquis/erranders/barter/admin/node_modules/klona/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/ufo/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/defu/dist/defu.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/admin/node_modules/ofetch/dist/node.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const showNotifications = ref(false);
    const showProfile = ref(false);
    const currentRouteName = computed(() => {
      if (route.path === "/dashboard" || route.path === "/dashboard/") return "Dashboard Overview";
      const parts = route.path.split("/");
      const name = parts[parts.length - 1];
      return name ? name.replace(/-/g, " ") : "";
    });
    const showLogoutModal = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 flex" }, _attrs))}><aside class="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col shrink-0 hidden md:flex transition-all duration-300"><div class="p-6 border-b border-slate-100 flex items-center justify-center"><img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter Admin" class="h-10 w-auto"></div><nav class="flex-1 p-4 space-y-1 overflow-y-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LayoutDashboard), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path === "/dashboard", "text-slate-400 group-hover:text-slate-600": _ctx.$route.path !== "/dashboard" }]
            }, null, _parent2, _scopeId));
            _push2(` Dashboard `);
          } else {
            return [
              createVNode(unref(LayoutDashboard), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path === "/dashboard", "text-slate-400 group-hover:text-slate-600": _ctx.$route.path !== "/dashboard" }]
              }, null, 8, ["class"]),
              createTextVNode(" Dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/disputes",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShieldAlert), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/disputes"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/disputes") }]
            }, null, _parent2, _scopeId));
            _push2(` Escrow Disputes `);
          } else {
            return [
              createVNode(unref(ShieldAlert), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/disputes"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/disputes") }]
              }, null, 8, ["class"]),
              createTextVNode(" Escrow Disputes ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/users",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Users), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/users"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/users") }]
            }, null, _parent2, _scopeId));
            _push2(` Users `);
          } else {
            return [
              createVNode(unref(Users), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/users"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/users") }]
              }, null, 8, ["class"]),
              createTextVNode(" Users ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/items",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShoppingBag), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/items"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/items") }]
            }, null, _parent2, _scopeId));
            _push2(` Marketplace `);
          } else {
            return [
              createVNode(unref(ShoppingBag), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/items"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/items") }]
              }, null, 8, ["class"]),
              createTextVNode(" Marketplace ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/chats",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MessageSquare), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/chats"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/chats") }]
            }, null, _parent2, _scopeId));
            _push2(` Chats &amp; Complaints <span class="absolute right-4 w-2 h-2 bg-red-500 rounded-full"${_scopeId}></span>`);
          } else {
            return [
              createVNode(unref(MessageSquare), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/chats"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/chats") }]
              }, null, 8, ["class"]),
              createTextVNode(" Chats & Complaints "),
              createVNode("span", { class: "absolute right-4 w-2 h-2 bg-red-500 rounded-full" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/logistics",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Truck), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/logistics"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/logistics") }]
            }, null, _parent2, _scopeId));
            _push2(` Logistics `);
          } else {
            return [
              createVNode(unref(Truck), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/logistics"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/logistics") }]
              }, null, 8, ["class"]),
              createTextVNode(" Logistics ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/settings",
        class: "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        "active-class": "bg-brand-50 text-brand-700",
        "inactive-class": "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Settings), {
              class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/settings"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/settings") }]
            }, null, _parent2, _scopeId));
            _push2(` Platform Settings `);
          } else {
            return [
              createVNode(unref(Settings), {
                class: ["w-5 h-5 mr-3 shrink-0", { "text-brand-600": _ctx.$route.path.startsWith("/dashboard/settings"), "text-slate-400 group-hover:text-slate-600": !_ctx.$route.path.startsWith("/dashboard/settings") }]
              }, null, 8, ["class"]),
              createTextVNode(" Platform Settings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="p-4 border-t border-slate-100"><button class="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200">`);
      _push(ssrRenderComponent(unref(LogOut), { class: "w-5 h-5 mr-3 text-slate-400" }, null, _parent));
      _push(` Sign out </button></div></aside><main class="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50"><header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0"><div class="flex items-center"><button class="md:hidden text-slate-500 hover:text-slate-700 mr-4">`);
      _push(ssrRenderComponent(unref(Menu), { class: "w-6 h-6" }, null, _parent));
      _push(`</button><h2 class="text-lg font-semibold text-slate-800 capitalize">${ssrInterpolate(currentRouteName.value)}</h2></div><div class="flex items-center space-x-4"><div class="relative"><button class="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">`);
      _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5" }, null, _parent));
      _push(`<span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>`);
      if (showNotifications.value) {
        _push(`<div class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"><div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 class="font-bold text-slate-800">Notifications</h3><button class="text-sm text-brand-600 font-semibold hover:underline">Mark all read</button></div><div class="divide-y divide-slate-50 max-h-[300px] overflow-y-auto"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="p-4 hover:bg-slate-50 cursor-pointer transition-colors"><p class="text-sm font-medium text-slate-800">New escrow dispute opened</p><p class="text-sm text-slate-500 mt-1">Transaction #TXN-${ssrInterpolate(i)}892 needs your attention.</p><span class="text-[10px] text-slate-400 mt-2 block">10 minutes ago</span></div>`);
        });
        _push(`<!--]--></div><div class="p-3 border-t border-slate-100 text-center bg-slate-50">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/notifications",
          onClick: ($event) => showNotifications.value = false,
          class: "text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`View All Notifications`);
            } else {
              return [
                createTextVNode("View All Notifications")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button class="h-9 w-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center overflow-hidden hover:border-brand-400 transition-colors"><img src="https://ui-avatars.com/api/?name=Admin+User&amp;background=6366f1&amp;color=fff" alt="Admin" class="w-full h-full object-cover"></button>`);
      if (showProfile.value) {
        _push(`<div class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"><div class="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3"><div class="h-10 w-10 rounded-full overflow-hidden bg-brand-100"><img src="https://ui-avatars.com/api/?name=Admin+User&amp;background=6366f1&amp;color=fff" alt="Admin"></div><div><h3 class="text-sm font-bold text-slate-900">Admin User</h3><p class="text-sm text-slate-500">Superadmin</p></div></div><div class="p-2 space-y-1">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/profile",
          class: "flex items-center px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { class: "w-4 h-4 mr-3 text-slate-400" }, null, _parent2, _scopeId));
              _push2(` My Profile `);
            } else {
              return [
                createVNode(unref(User), { class: "w-4 h-4 mr-3 text-slate-400" }),
                createTextVNode(" My Profile ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/settings",
          class: "flex items-center px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Settings), { class: "w-4 h-4 mr-3 text-slate-400" }, null, _parent2, _scopeId));
              _push2(` Preferences `);
            } else {
              return [
                createVNode(unref(Settings), { class: "w-4 h-4 mr-3 text-slate-400" }),
                createTextVNode(" Preferences ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="h-px bg-slate-100 my-1"></div><button class="w-full flex items-center px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors">`);
        _push(ssrRenderComponent(unref(LogOut), { class: "w-4 h-4 mr-3 text-red-400" }, null, _parent));
        _push(` Sign Out </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><div class="flex-1 overflow-y-auto p-6 md:p-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showLogoutModal.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"><div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200"><h3 class="text-lg font-bold text-slate-900 mb-2">Confirm Logout</h3><p class="text-slate-500 text-sm mb-6">Are you sure you want to sign out of the admin dashboard?</p><div class="flex gap-3 justify-end"><button class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button><button class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Sign Out</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-DB-XCnU0.js.map
