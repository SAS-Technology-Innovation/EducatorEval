import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DOpggxVl.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Schedule = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Schedule;
  const pathname = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pathname": pathname }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 p-6"> <div class="max-w-7xl mx-auto"> ${renderComponent($$result2, "ObservationScheduler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/user/EducatorEval/src/components/ObservationScheduler", "client:component-export": "default" })} </div> </div> ` })}`;
}, "/home/user/EducatorEval/src/pages/schedule.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/schedule.astro";
const $$url = "/schedule";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Schedule,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
