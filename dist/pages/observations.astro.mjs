import { c as createComponent, r as renderComponent, b as renderTemplate } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DOpggxVl.mjs';
export { renderers } from '../renderers.mjs';

const $$Observations = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pathname": "/observations" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ObservationWrapper", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/user/EducatorEval/src/pages/_ObservationWrapper", "client:component-export": "default" })} ` })}`;
}, "/home/user/EducatorEval/src/pages/observations.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/observations.astro";
const $$url = "/observations";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Observations,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
