import { _ as __nuxt_component_0 } from "./nuxt-link-A89XnCLf.js";
import { defineComponent, ref, watch, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { ArrowLeft, Loader2, MessageSquare, Play, Paperclip, Send, Mic } from "lucide-vue-next";
import "/Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/admin/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/marquis/erranders/barter/admin/node_modules/defu/dist/defu.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chats",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("Sellers");
    const loadingChats = ref(true);
    const newMessage = ref("");
    const messages = ref([
      { id: 1, text: "Hello, I have an issue with the recent transaction. Please help!", isMine: false, time: "10:41 AM" },
      { id: 2, text: "Hello! Admin here. I can see the transaction. Give me a moment to review the escrow state.", isMine: true, time: "10:45 AM" }
    ]);
    watch(activeTab, () => {
      messages.value = [
        { id: 1, text: `I need help with my ${activeTab.value.toLowerCase()} transaction.`, isMine: false, time: "09:00 AM" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen w-full flex flex-col bg-slate-50 relative" }, _attrs))}><div class="flex items-center justify-between shrink-0 p-6 border-b border-slate-200 bg-white"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-5 h-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h2 class="text-2xl font-black text-slate-900 tracking-tight">Support &amp; Complain Handling (Chat)</h2><p class="text-sm text-slate-500 mt-1">Aggressive WebSocket integrated notification &amp; chat management.</p></div></div><div class="flex items-center gap-2"><span class="flex h-3 w-3 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span><span class="text-sm font-semibold text-emerald-600">WebSocket Connected</span></div></div><div class="bg-white flex-1 flex flex-col overflow-hidden"><div class="border-b border-slate-100 bg-slate-50/50 px-4 flex gap-4 shrink-0"><!--[-->`);
      ssrRenderList(["Sellers", "Buyers", "Swapping"], (tab) => {
        _push(`<button class="${ssrRenderClass([activeTab.value === tab ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800", "px-4 py-4 text-sm font-bold border-b-2 transition-colors relative"])}">${ssrInterpolate(tab)} Complaints `);
        if (tab === "Sellers") {
          _push(`<span class="absolute top-3 right-0 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">3</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><div class="flex-1 flex overflow-hidden"><div class="w-80 border-r border-slate-100 flex flex-col bg-white"><div class="p-4 border-b border-slate-100"><input type="text" placeholder="Search conversations..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500"></div><div class="flex-1 overflow-y-auto">`);
      if (loadingChats.value) {
        _push(`<div class="flex justify-center p-8">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "animate-spin text-brand-600 w-6 h-6" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="${ssrRenderClass([{ "bg-brand-50/50": i === 1 }, "p-4 hover:bg-slate-50 cursor-pointer transition-colors relative"])}"><div class="flex justify-between items-start mb-1"><span class="font-bold text-slate-900 text-sm">User ${ssrInterpolate(i)}8472</span><span class="text-xs text-slate-400">10:4${ssrInterpolate(i)} AM</span></div><p class="text-xs text-slate-500 truncate pr-4">I have an issue with the recent ${ssrInterpolate(activeTab.value.toLowerCase())} transaction. Please help!</p>`);
          if (i === 1) {
            _push(`<div class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-500 rounded-full"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="flex-1 flex flex-col bg-slate-50/30 relative"><div class="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-slate-200 rounded-full"></div><div><h3 class="font-bold text-slate-900 text-sm">User 18472</h3><p class="text-xs text-slate-500">Active now</p></div></div><button class="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">Resolve Ticket</button></div><div class="flex-1 p-6 overflow-y-auto space-y-6" id="chat-messages">`);
      if (messages.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center h-full opacity-50">`);
        _push(ssrRenderComponent(unref(MessageSquare), { class: "w-12 h-12 text-slate-300 mb-4" }, null, _parent));
        _push(`<p class="text-slate-500 font-medium">Select a conversation to start chatting</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(messages.value, (msg) => {
        _push(`<div class="${ssrRenderClass([{ "flex-row-reverse": msg.isMine }, "flex items-start gap-3"])}">`);
        if (!msg.isMine) {
          _push(`<div class="w-8 h-8 bg-slate-200 rounded-full shrink-0"></div>`);
        } else {
          _push(`<div class="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0"><span class="font-bold text-brand-600 text-xs">B.</span></div>`);
        }
        _push(`<div class="${ssrRenderClass([msg.isMine ? "bg-brand-600 rounded-2xl rounded-tr-none p-4" : "bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4", "max-w-md shadow-sm"])}">`);
        if (msg.image) {
          _push(`<div class="mb-2 rounded-xl overflow-hidden"><img${ssrRenderAttr("src", msg.image)} class="w-full object-cover"></div>`);
        } else {
          _push(`<!---->`);
        }
        if (msg.isVoice) {
          _push(`<div class="${ssrRenderClass([msg.isMine ? "text-white" : "text-slate-700", "flex items-center gap-2 mb-2 w-48 bg-black/10 p-2 rounded-lg"])}">`);
          _push(ssrRenderComponent(unref(Play), { class: "w-5 h-5 cursor-pointer hover:opacity-70" }, null, _parent));
          _push(`<div class="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div class="h-full bg-white/80 w-1/3"></div></div><span class="text-xs">0:14</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="${ssrRenderClass([msg.isMine ? "text-white" : "text-slate-700", "text-sm"])}">${ssrInterpolate(msg.text)}</p><span class="${ssrRenderClass([msg.isMine ? "text-brand-200 text-right" : "text-slate-400", "text-[10px] mt-2 block"])}">${ssrInterpolate(msg.time)}</span></div></div>`);
      });
      _push(`<!--]--></div><div class="p-4 bg-white border-t border-slate-100 shrink-0"><form class="flex gap-2"><button type="button" class="p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors" title="Upload Image/Asset">`);
      _push(ssrRenderComponent(unref(Paperclip), { class: "w-5 h-5" }, null, _parent));
      _push(`</button><input${ssrRenderAttr("value", newMessage.value)} type="text" placeholder="Type your message to resolve the complain..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">`);
      if (newMessage.value.trim()) {
        _push(`<button type="submit" class="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm">`);
        _push(ssrRenderComponent(unref(Send), { class: "w-5 h-5" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<button type="button" class="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm" title="Send Voice Note">`);
        _push(ssrRenderComponent(unref(Mic), { class: "w-5 h-5" }, null, _parent));
        _push(`</button>`);
      }
      _push(`</form></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/chats.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=chats-0BEDbU0o.js.map
