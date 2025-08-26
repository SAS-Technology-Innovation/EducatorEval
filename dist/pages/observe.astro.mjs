import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DOpggxVl.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Observe = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Observe;
  const pathname = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pathname": pathname }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50"> <!-- Header --> <div class="bg-white shadow-sm border-b"> <div class="px-4 py-3"> <div class="flex items-center justify-between"> <div class="flex items-center space-x-3"> <h1 class="text-lg font-semibold text-gray-900">Live Observation</h1> </div> <div class="flex items-center space-x-2"> <span class="text-sm text-gray-600">15:23</span> </div> </div> </div> </div> <!-- MobileObservationForm React component --> ${renderComponent($$result2, "MobileObservationForm", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/user/EducatorEval/src/components/MobileObservationForm", "client:component-export": "default" })} </div> ` })}`;
}, "/home/user/EducatorEval/src/pages/observe.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/observe.astro";
const $$url = "/observe";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Observe,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
