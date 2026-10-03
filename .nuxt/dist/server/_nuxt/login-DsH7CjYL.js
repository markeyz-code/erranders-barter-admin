import { ref, defineComponent, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderVNode, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _imports_0 } from "./_virtual_public-IWZl7zz2.js";
import { useRouter } from "vue-router";
import { Mail, Lock, EyeOff, Eye, AlertCircle, Loader2, ArrowRight } from "lucide-vue-next";
import { G as GATEWAY_ENDPOINT } from "./axios.config-CnWRis1o.js";
import { parse } from "/Users/marquis/erranders/barter/admin/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import { getRequestHeader, setCookie, getCookie, deleteCookie } from "/Users/marquis/erranders/barter/admin/node_modules/h3/dist/index.mjs";
import destr from "/Users/marquis/erranders/barter/admin/node_modules/destr/dist/index.mjs";
import { isEqual } from "/Users/marquis/erranders/barter/admin/node_modules/ohash/dist/index.mjs";
import { klona } from "/Users/marquis/erranders/barter/admin/node_modules/klona/dist/index.mjs";
import { a as useNuxtApp, b as useRequestEvent } from "../server.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs";
import "#internal/nuxt/paths";
import "axios";
import "/Users/marquis/erranders/barter/admin/node_modules/ofetch/dist/node.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/ufo/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/@unhead/vue/dist/index.mjs";
const authApi = {
  signup: (data) => GATEWAY_ENDPOINT.post("/auth/signup", data),
  login: (data) => GATEWAY_ENDPOINT.post("/auth/login", data)
};
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);
  const login = async (data) => {
    loading.value = true;
    try {
      const res = await authApi.login(data);
      const token = useCookie("barter_token", { maxAge: 60 * 60 * 24 * 7, path: "/" });
      token.value = res.data.access_token;
      if (false) ;
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const signup = async (data) => {
    loading.value = true;
    try {
      const res = await authApi.signup(data);
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Signup failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return { login, signup, loading, error };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loginRole = ref("admin");
    useRouter();
    let authInstance = { login: async () => {
    }, loading: ref(false), error: ref("") };
    try {
      authInstance = useAuth();
    } catch (e) {
      console.warn("useAuth composable might be missing or broken");
    }
    const { login, loading, error } = authInstance;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden" }, _attrs))}><div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-3xl"></div><div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400/10 blur-3xl"></div><div class="max-w-md w-full mx-4 relative z-10"><div class="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-white"><div class="text-center mb-6 flex flex-col items-center"><img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter Admin" class="h-16 w-auto mb-4"><p class="mt-2 text-sm text-slate-500 font-medium"> Welcome back! Select your role to continue </p></div><div class="flex p-1 bg-slate-100 rounded-xl mb-6"><button class="${ssrRenderClass([loginRole.value === "admin" ? "bg-white shadow-sm text-slate-900 font-bold" : "text-slate-500 font-medium hover:text-slate-700", "flex-1 py-2 text-sm rounded-lg transition-all"])}"> Admin </button><button class="${ssrRenderClass([loginRole.value === "support" ? "bg-white shadow-sm text-slate-900 font-bold" : "text-slate-500 font-medium hover:text-slate-700", "flex-1 py-2 text-sm rounded-lg transition-all"])}"> Support </button></div><form class="space-y-5"><div><label for="email-address" class="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Mail), { class: "h-5 w-5 text-slate-400" }, null, _parent));
      _push(`</div><input id="email-address" name="email" type="email" autocomplete="email" required${ssrRenderAttr("value", email.value)} class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400" placeholder="admin@barter.com"></div></div><div><label for="password" class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Lock), { class: "h-5 w-5 text-slate-400" }, null, _parent));
      _push(`</div><input id="password" name="password"${ssrRenderAttr("type", showPassword.value ? "text" : "password")} autocomplete="current-password" required${ssrRenderDynamicModel(showPassword.value ? "text" : "password", password.value, null)} class="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white text-slate-900 transition-all placeholder:text-slate-400" placeholder="••••••••"><button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(showPassword.value ? unref(EyeOff) : unref(Eye)), { class: "h-5 w-5" }, null), _parent);
      _push(`</button></div></div><div class="flex items-center justify-between mt-4"><div class="flex items-center"><input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"><label for="remember-me" class="ml-2 block text-sm text-slate-600 font-medium"> Remember me </label></div><div class="text-sm"><a href="#" class="font-semibold text-brand-600 hover:text-brand-500 transition-colors"> Forgot password? </a></div></div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-start">`);
        _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 mt-0.5 mr-2 shrink-0" }, null, _parent));
        _push(` ${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-brand-500/25 mt-6">`);
      if (unref(loading)) {
        _push(`<span class="flex items-center">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin -ml-1 mr-2 h-5 w-5 text-white" }, null, _parent));
        _push(` Signing in... </span>`);
      } else {
        _push(`<span class="flex items-center justify-center w-full"> Sign in as ${ssrInterpolate(loginRole.value === "admin" ? "Admin" : "Support")} `);
        _push(ssrRenderComponent(unref(ArrowRight), { class: "ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" }, null, _parent));
        _push(`</span>`);
      }
      _push(`</button></form></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-DsH7CjYL.js.map
