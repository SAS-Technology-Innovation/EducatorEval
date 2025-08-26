import { c as createComponent, a as createAstro, d as addAttribute, e as renderHead, f as renderScript, b as renderTemplate } from '../chunks/astro/server_BoYrjx9A.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Profile - CRP Observation System</title>${renderHead()}</head> <body class="bg-gray-50"> <div id="profile-root"></div> ${renderScript($$result, "/home/user/EducatorEval/src/pages/profile.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/user/EducatorEval/src/pages/profile.astro", void 0);

const $$file = "/home/user/EducatorEval/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
