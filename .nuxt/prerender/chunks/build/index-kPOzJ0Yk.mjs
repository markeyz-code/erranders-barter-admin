import { defineComponent, useSSRContext } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/index.mjs';
import { ssrRenderAttrs } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue/server-renderer/index.mjs';
import { useRouter } from 'file:///Users/marquis/erranders/barter/admin/node_modules/vue-router/vue-router.node.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-kPOzJ0Yk.mjs.map
