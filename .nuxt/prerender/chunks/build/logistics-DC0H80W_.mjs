import { ssrRenderAttrs } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/h3/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/ufo/dist/index.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/destr/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/hookable/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unstorage/drivers/fs.mjs';
import 'node:crypto';
import 'node:fs/promises';
import 'node:path';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/ohash/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/klona/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/defu/dist/defu.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/scule/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unctx/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/pathe/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unhead/dist/server.mjs';
import 'node:async_hooks';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/devalue/index.js';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unhead/dist/utils.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/unhead/dist/plugins.mjs';
import 'file:///Users/marquis/erranders/barter/admin/node_modules/vue-router/vue-router.node.mjs';

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

export { logistics as default };
//# sourceMappingURL=logistics-DC0H80W_.mjs.map
