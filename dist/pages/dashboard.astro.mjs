import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DOpggxVl.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const pathname = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pathname": pathname }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardWrapper", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/user/EducatorEval/src/pages/_DashboardWrapper", "client:component-export": "default" })} ` })}`;
}, "/home/user/EducatorEval/src/pages/dashboard.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
