/**
 * Blog content for Rukhsar Ahmad — Web Development, AI & UI/UX.
 *
 * Articles are first-hand write-ups of real work. Every claim must be
 * grounded in the projects in src/data/projects.ts or in work actually
 * performed on this site. Do not add fabricated results or fake metrics.
 */

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; lang: string; code: string };

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  tags: string[];
  readingTime: string;
  intro: string;
  blocks: PostBlock[];
  /** Related case studies / pages, shown at the end of the article */
  related: { label: string; href: string }[];
}

export const posts: Post[] = [
  {
    slug: 'mern-ecommerce-full-stack',
    title: 'How I Built a Full-Stack E-commerce Application with MERN',
    description:
      'A first-hand walkthrough of building Craft PC — a full-stack e-commerce platform with React, Node.js, Express and MongoDB, including a custom PC builder with part-compatibility validation, authentication, cart, checkout and an admin dashboard.',
    date: '2026-10-03',
    tags: ['MERN', 'MongoDB', 'Express', 'React', 'E-commerce'],
    readingTime: '7 min read',
    intro:
      'Craft PC started with a simple observation: people buying PCs online pick parts that often don\'t work together, and most storefronts have no way to stop an incompatible order. This is the walkthrough of how I built the platform end-to-end with the MERN stack — the data model, the compatibility validator, the commerce flow and the admin dashboard — and what I\'d do differently.',
    blocks: [
      { type: 'h3', text: 'The product in one sentence' },
      { type: 'p', text: 'A storefront where you can buy prebuilt PCs, laptops and individual components — plus a custom PC builder that refuses to let you check out with parts that don\'t fit together. Behind it: authentication, a cart, checkout, order history, and an admin dashboard for inventory and orders.' },
      { type: 'h3', text: 'Modeling the catalog in MongoDB' },
      { type: 'p', text: 'I started with three core collections: products, builds and orders. Components carry a type (CPU, GPU, motherboard, RAM, storage, PSU, case) plus the attributes the validator needs — socket, chipset, memory type, wattage and physical size. Prebuilt systems are products too, just with a parts list attached.' },
      { type: 'code', lang: 'javascript', code: `// What a compatibility-relevant component document looks like\n{\n  _id: ObjectId,\n  name: "B650 Motherboard",\n  type: "motherboard",\n  socket: "AM5",\n  memoryType: "DDR5",\n  formFactor: "ATX",\n  price: 18900\n}` },
      { type: 'p', text: 'The key decision was keeping compatibility attributes on the product documents themselves rather than in a separate rules table. When a CPU declares its socket and a motherboard declares its socket, the validator becomes a set of simple comparisons instead of a lookup into a second system that can drift out of sync with the catalog.' },
      { type: 'h3', text: 'The compatibility validator' },
      { type: 'p', text: 'The builder tracks the current selection client-side for instant feedback, but the rules live on the server. When a part is added, the Express API receives the full candidate build and returns which rules pass and which fail — the UI then greys out incompatible options rather than letting users discover problems at checkout.' },
      { type: 'list', items: [
        'CPU socket must match motherboard socket.',
        'Motherboard memory type must match RAM type (DDR4 vs DDR5).',
        'PSU wattage must cover the estimated draw of CPU + GPU with headroom.',
        'GPU length and case clearance, motherboard form factor and case size.',
      ] },
      { type: 'p', text: 'Re-validating the whole build on every change sounds heavy, but a build has at most ~8 parts and the comparisons are cheap. Correctness beat cleverness here: one canonical validateBuild(build) function, called by the API and mirrored in the UI, so the frontend never shows a green checkout button the backend would reject.' },
      { type: 'h3', text: 'Authentication, cart and checkout' },
      { type: 'p', text: 'Auth is JWT-based with two roles: customer and admin. Passwords are hashed server-side, tokens are short-lived, and admin-only routes are gated in middleware — not just hidden in the UI. The cart is a plain client-side state until checkout, which keeps browsing fast; only at checkout does an order document get created, holding line items with a frozen copy of name and price so later catalog changes never mutate historical orders.' },
      { type: 'h3', text: 'The admin dashboard' },
      { type: 'p', text: 'The dashboard covers the two things a small store actually needs daily: inventory (create/edit products, adjust stock) and orders (view, update status). I kept it deliberately boring — tables, forms and clear states — because the user there wants speed, not motion.' },
      { type: 'h3', text: 'What I\'d do differently' },
      { type: 'list', items: [
        'Add integration tests around the validator earlier — the rules multiplied faster than I expected.',
        'Introduce pagination and filtering at the API level from day one instead of bolting it on when the catalog grew.',
        'Consider Stripe (or a local equivalent) from the start instead of a manual payment step, since order status handling assumed it.',
      ] },
      { type: 'p', text: 'If you want to see the result rather than read about it, the Craft PC case study page on this portfolio lists exactly what shipped.' },
    ],
    related: [
      { label: 'MERN development services', href: '/services/mern-stack-development' },
      { label: 'Craft PC — case study', href: '/project/craft-pc' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
  {
    slug: 'figma-to-react-workflow',
    title: 'From Figma to React: My UI/UX Development Workflow',
    description:
      'The exact workflow I use to turn Figma designs into production React components — design tokens first, component inventory, Tailwind mapping, responsive strategy and motion with Framer Motion.',
    date: '2026-10-03',
    tags: ['UI/UX', 'Figma', 'React', 'Tailwind CSS', 'Framer Motion'],
    readingTime: '6 min read',
    intro:
      'Most of my projects start in Figma and ship as React. Over storefronts like EcoBazar and Furniro and marketing sites for logistics and IT companies, I\'ve settled into a workflow that keeps the gap between the design file and the deployed UI small. This is that workflow, step by step.',
    blocks: [
      { type: 'h3', text: 'Step 1: Extract tokens before touching components' },
      { type: 'p', text: 'Before building anything, I pull the design\'s real decisions out of Figma: color scales, spacing rhythm, type scale and radii. Those become Tailwind theme tokens (or CSS variables) so the codebase has one source of truth. If a Figma file uses "light gray #F4F4F2" in twelve places, that becomes one token used in twelve places — not twelve hex codes.' },
      { type: 'h3', text: 'Step 2: Inventory components, not screens' },
      { type: 'p', text: 'Walking the design screen by screen produces one-off markup. Walking it component by component produces a system. I list every repeated element — buttons, inputs, cards, section headers, badges — and note their variants (size, state, emphasis). On e-commerce work that inventory is short and dense: product card, price display, category chip, cart line. On marketing sites it\'s section shells and heading patterns.' },
      { type: 'h3', text: 'Step 3: Build mobile-first, at the breakpoints the design actually defines' },
      { type: 'p', text: 'I implement from the smallest layout upward, and I only add breakpoints where the Figma file actually changes structure — not every breakpoint Tailwind offers. If the desktop design splits a section into a 12-column grid, I write the mobile stack first and let the grid appear at the breakpoint where the design says so. This keeps responsive behavior intentional instead of accidental.' },
      { type: 'h3', text: 'Step 4: Motion is a design decision, not a garnish' },
      { type: 'p', text: 'When the design calls for motion, I use Framer Motion — but I map it back to the same tokens: consistent easing curves, consistent durations, and a single scroll-reveal pattern reused across sections. Two rules I keep: respect prefers-reduced-motion, and never animate anything the user needs to read. Motion should draw the eye once, then get out of the way.' },
      { type: 'code', lang: 'tsx', code: `// The one scroll-reveal pattern I reuse everywhere\n<motion.div\n  initial={{ opacity: 0, y: 40 }}\n  whileInView={{ opacity: 1, y: 0 }}\n  viewport={{ once: true, margin: '-80px' }}\n  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}\n>\n  {children}\n</motion.div>` },
      { type: 'h3', text: 'Step 5: Compare in the browser, not in screenshots' },
      { type: 'p', text: 'Side-by-side screenshots lie about spacing and type rendering. At the end of each component I open the Figma frame and the live component next to each other at the same viewport width and walk the differences down. It\'s slower per component and much faster per project.' },
      { type: 'h3', text: 'The handoff rules that matter' },
      { type: 'list', items: [
        'Name Figma layers like you\'d name components — future-you reads them as documentation.',
        'Agree on what "done" means per breakpoint before building.',
        'Push back on states the design forgot: empty, loading, error, long text. They always exist.',
      ] },
      { type: 'p', text: 'Furniro is the project where this workflow is most visible — an airy furniture showcase where typography and whitespace carry the design. The case study is on this site.' },
    ],
    related: [
      { label: 'UI/UX design services', href: '/services/ui-ux-design' },
      { label: 'Furniro — case study', href: '/project/furniro' },
      { label: 'EcoBazar — case study', href: '/project/ecobazar' },
    ],
  },
  {
    slug: 'react-technical-seo-checklist',
    title: 'Technical SEO Checklist for React Websites',
    description:
      'A practical technical SEO checklist for React SPAs — titles and meta per route, canonical URLs, structured data, sitemaps, robots.txt, images and Core Web Vitals — written from actually doing it on this portfolio.',
    date: '2026-10-03',
    tags: ['SEO', 'React', 'Web Performance', 'Structured Data'],
    readingTime: '8 min read',
    intro:
      'React single-page applications ship empty HTML shells, so search engines have to render JavaScript to see your content — and many never do it well. I just went through a full technical SEO pass on this portfolio, and this is the checklist I worked through, in the order I\'d apply it to any React site.',
    blocks: [
      { type: 'h3', text: '1. Fix the domain signals first' },
      { type: 'p', text: 'Pick one canonical origin and make everything derive from it: canonical links, Open Graph URLs, sitemap entries and structured-data @id fields. This portfolio previously pointed its canonical domain, robots.txt sitemap line and project images at an old deployment domain — splitting authority across two origins. One exported SITE_URL constant now feeds every URL on the site, which also makes a future custom-domain move a one-line change.' },
      { type: 'h3', text: '2. Per-route titles and meta descriptions' },
      { type: 'p', text: 'A SPA has one index.html, so every route needs a component that updates document.title, description, canonical and Open Graph tags when the route changes. Two rules: every indexable page gets a unique title and description, and titles that already contain the brand name shouldn\'t get it appended twice. Test with rendered HTML, not the source — crawlers evaluate what the browser ends up with.' },
      { type: 'h3', text: '3. Structured data that reflects reality' },
      { type: 'list', items: [
        'Person schema for a personal site — real name, job title, location, and sameAs links only to profiles that actually exist.',
        'BreadcrumbList on nested pages so the trail (Home → Portfolio → Project) is explicit.',
        'CreativeWork or Article on content pages with absolute image URLs.',
        'FAQPage only where real questions and real answers exist.',
        'Never add Review, Rating or SearchAction schema without the real feature or evidence behind it — invalid or fake structured data is worse than none.',
      ] },
      { type: 'p', text: 'Validate everything in Google\'s Rich Results Test. On this site I found a SearchAction pointing to a search page that didn\'t exist — schema advertising a feature the site doesn\'t have.' },
      { type: 'h3', text: '4. Sitemap and robots.txt that agree with reality' },
      { type: 'p', text: 'The sitemap should list exactly the indexable URLs — no 404s, no duplicates, no query-parameter variants — and robots.txt should point to it using the same canonical origin. Check the sitemap URLs actually return 200. If your hosting is a SPA rewrite (like Firebase Hosting\'s catch-all to index.html), every URL returns 200, so your 404 page must carry a robots noindex meta and your sitemap must never include routes that don\'t exist.' },
      { type: 'h3', text: '5. Images: the biggest Core Web Vitals lever' },
      { type: 'list', items: [
        'Convert screenshots and photos to WebP — this portfolio\'s hero went from a 4.9 MB PNG to a 196 KB WebP with no visible loss.',
        'Give every image a descriptive filename and honest alt text; they\'re both ranking inputs and accessibility features.',
        'Set width/height (or an aspect-ratio container) on images to prevent layout shift.',
        'Lazy-load everything below the fold; eager-load and preload only the LCP image.',
        'Serve images from your own canonical domain — cross-origin assets are a reliability and SEO liability.',
      ] },
      { type: 'h3', text: '6. Ship less JavaScript' },
      { type: 'p', text: 'Code-split routes with React.lazy so each page pays only for itself. Audit your entry chunk for dead weight — I removed an unused Firebase SDK initialization that loaded on every page and did nothing. Lazy-load heavy features (3D, charts, editors) below the fold. The goal isn\'t a perfect Lighthouse number; it\'s that a user on a mid-range phone gets content fast.' },
      { type: 'h3', text: '7. Rendering: know your limit' },
      { type: 'p', text: 'A client-rendered SPA can rank, but content-heavy sites that need maximum crawlability should consider prerendering or a framework with server rendering (Next.js). Don\'t migrate for migration\'s sake — for a portfolio, a well-optimized SPA with clean meta, structured data and fast images covers the real needs. Revisit when content volume grows.' },
      { type: 'h3', text: '8. Verify like a search engine' },
      { type: 'p', text: 'Finally, test the way crawlers see things: render each route in a real browser and check the title, meta description, canonical, headings and structured data that exist after JavaScript runs. Confirm robots.txt and sitemap.xml return 200. Submit the sitemap in Search Console. Then leave Lighthouse as a regression check, not a religion.' },
    ],
    related: [
      { label: 'About — who built this', href: '/about' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
  {
    slug: 'ai-api-integration-guide',
    title: 'AI API Integration: A Practical Guide for Web Developers',
    description:
      'How to integrate the Gemini API and OpenAI API into a web application without building a liability — grounding model output in your own data, validating responses, handling failures, and keeping AI off the critical path.',
    date: '2026-10-03',
    tags: ['AI Integration', 'Gemini API', 'OpenAI API', 'Node.js'],
    readingTime: '7 min read',
    intro:
      'Most AI integrations I see fail for the same reason: the developer wires the model straight into the UI and lets it say whatever it wants. I\'ve built AI features into production products — including the AI Stylist in ZYRA — and the pattern that works is almost boring: the model interprets, your data answers, and nothing reaches the user unvalidated.',
    blocks: [
      { type: 'h3', text: 'Rule 1: the model is the interpreter, not the inventory' },
      { type: 'p', text: 'If your AI feature recommends products, answers support questions, or searches content, the model should never be the source of that information. It should translate the user\'s messy natural-language request into something your system can answer from real data — a database query, an API call, a filtered list. Your database is the source of truth; the model is the language layer in front of it.' },
      { type: 'p', text: 'In ZYRA, a shopper can ask for "an outfit for a summer wedding". The Gemini API turns that into structured intent — occasion, style, category — and the storefront runs a vector search over product embeddings in Pinecone, verified against the MongoDB catalog before anything is shown. The assistant\'s reply is composed from those retrieval results. If a product isn\'t in the catalog, it cannot appear in the answer, no matter how confidently the model mentions it.' },
      { type: 'h3', text: 'Rule 2: validate everything before it reaches the user' },
      { type: 'p', text: 'Model output is untrusted input. Treat it exactly like user input: check it against your schema, your catalog, your rules. When the model suggests a product ID that doesn\'t exist, drop it. When a response breaks your format, retry once with a tighter prompt, then fall back to a non-AI path. This one habit eliminates the majority of "AI hallucinated my store\'s inventory" bugs before users ever see them.' },
      { type: 'code', lang: 'javascript', code: `// Server-side: only catalog products survive to the response\nconst suggested = modelOutput.productIds\n  .map(id => products.find(p => p._id.equals(id)))\n  .filter(Boolean);\n\nif (suggested.length === 0) {\n  return fallbackResponse(); // never show an empty promise\n}` },
      { type: 'h3', text: 'Rule 3: keep AI off the critical path' },
      { type: 'p', text: 'Model calls are slow (hundreds of milliseconds to seconds) and occasionally fail. If your checkout waits on an AI call, you\'ve built a liability. The AI layer should decorate the experience — recommendations, a stylist, smarter search — while browsing, cart and checkout run on plain database queries. In ZYRA the store is fully usable with the AI layer disabled, which is exactly how I\'d build any AI-powered product.' },
      { type: 'h3', text: 'Rule 4: pick the API by fit, not hype' },
      { type: 'list', items: [
        'Gemini API: strong multimodal understanding and a generous free tier — my default for product-aware assistants.',
        'OpenAI API: excellent instruction-following and structured output modes — solid for text-heavy workflows.',
        'The integration pattern matters more than the provider. Grounding, validation and fallbacks are portable; vendor lock-in mostly lives in prompt design, which you\'ll rewrite anyway.',
      ] },
      { type: 'h3', text: 'Rule 5: budget latency and cost from day one' },
      { type: 'p', text: 'Every AI call is a per-request cost and a latency tax. Cache what you can (recommendation sets, common questions), stream responses where the UI allows it, and make the model do less: retrieve candidates with cheap database queries first, then let the model do only the language work. Retrieval-first design is cheaper and faster than asking the model to know everything.' },
      { type: 'h3', text: 'The honest checklist before shipping' },
      { type: 'list', items: [
        'Can every AI output be traced back to real data in my system?',
        'Does the product still work end-to-end if the model call fails or times out?',
        'Is there a validation layer between model output and the UI?',
        'Have I measured the latency and cost per interaction at realistic volume?',
        'Would a user forgive this feature if it were merely okay? If not, it shouldn\'t be AI-powered.',
      ] },
    ],
    related: [
      { label: 'AI integration services', href: '/services/ai-integration' },
      { label: 'ZYRA — AI-powered e-commerce case study', href: '/project/zyra' },
    ],
  },
  {
    slug: 'add-ai-features-mern',
    title: 'How to Add AI Features to a MERN Stack Application',
    description:
      'A practical walkthrough of adding AI features to a MERN application — where the model call belongs in a React + Node.js + Express + MongoDB architecture, how to keep recommendations grounded in MongoDB, and what to build first.',
    date: '2026-10-03',
    tags: ['MERN', 'AI Integration', 'MongoDB', 'Node.js', 'React'],
    readingTime: '6 min read',
    intro:
      'If you have a working MERN application and want to add AI features, the good news is that the stack already gives you everything you need: MongoDB holds the truth, Express can hold the API keys, and React just needs a place to put the interface. This is the architecture I use, drawn from adding an AI Stylist and catalog-grounded recommendations to a MERN e-commerce platform.',
    blocks: [
      { type: 'h3', text: 'Where the AI call belongs: the API layer, never the client' },
      { type: 'p', text: 'The model call goes in an Express route. That\'s non-negotiable: your API key stays server-side, you can validate and log the exchange, and you can change providers later without touching the frontend. The React client calls your own endpoint — /api/assistant, /api/recommendations — the way it calls any other REST route.' },
      { type: 'code', lang: 'javascript', code: `// Express: the only place that talks to the model\nrouter.post("/api/assistant", auth, async (req, res) => {\n  const intent = await gemini.interpret(req.body.message); // structured intent\n  const products = await queryCatalog(intent);             // MongoDB does the answering\n  res.json({ reply: composeReply(products), products });\n});` },
      { type: 'h3', text: 'Let MongoDB do the answering' },
      { type: 'p', text: 'The pattern that keeps AI features honest in a MERN app: the model converts language into a query, and MongoDB returns the results. If a user asks for running shoes under a budget, the model extracts { category: "shoes", type: "running", maxPrice: 120 } and your existing product query handles the rest. You already trust your MongoDB queries — this just puts a language interface in front of them.' },
      { type: 'p', text: 'This also gives you a debugging story. When a recommendation is wrong, there is a query to inspect and a document to fix — not a prompt to sacrifice a weekend to.' },
      { type: 'h3', text: 'Design the AI routes like any other route' },
      { type: 'list', items: [
        'Authenticate them — AI endpoints cost money, so they\'re not public utilities.',
        'Rate-limit them per user to protect the bill.',
        'Validate model output against your schema before responding.',
        'Define a non-AI fallback response for when the model call fails or times out.',
      ] },
      { type: 'h3', text: 'What to build first' },
      { type: 'p', text: 'Start with the feature your users would pay for, not the one that demos well. In e-commerce that\'s usually search and recommendations (helping users find products they\'d have bought anyway); in dashboards it\'s summarization of data the user already has. A rule of thumb: if a plain database query plus a good UI gets you 80% there, build that first and add the model for the last mile.' },
      { type: 'h3', text: 'The MERN stack is genuinely good at this' },
      { type: 'p', text: 'Node handles streaming model responses naturally, MongoDB\'s flexible documents hold the structured attributes that make retrieval reliable, and React renders conversational UI without ceremony. You don\'t need a new stack to add AI features — you need one disciplined route, one validation layer, and the humility to keep your database in charge.' },
    ],
    related: [
      { label: 'AI integration services', href: '/services/ai-integration' },
      { label: 'MERN development services', href: '/services/mern-stack-development' },
      { label: 'ZYRA — the case study behind this article', href: '/project/zyra' },
    ],
  },
  {
    slug: 'shopify-vs-wordpress',
    title: 'When Should a Business Choose Shopify vs WordPress?',
    description:
      'A developer who builds on both platforms gives an honest comparison — where Shopify wins, where WordPress wins, and the questions that actually decide it for a business.',
    date: '2026-10-03',
    tags: ['Shopify', 'WordPress', 'E-commerce', 'Business websites'],
    readingTime: '5 min read',
    intro:
      'Clients ask me this in almost every first call: Shopify or WordPress? I build on both, which means I don\'t get a commission for either answer. Here\'s the version I give — the questions that actually decide it, not a feature table.',
    blocks: [
      { type: 'h3', text: 'The one question that decides most cases' },
      { type: 'p', text: 'Is your business primarily the store, or primarily the content with a store attached? If the store is the business — products, variants, inventory, shipping, checkout — Shopify wins, because commerce is its whole reason to exist and it takes payments, security and inventory maintenance off your plate. If the store is one part of a content-driven site — services, blog, portfolio, with a shop alongside — WordPress usually fits better and costs less to run.' },
      { type: 'h3', text: 'Where Shopify wins' },
      { type: 'list', items: [
        'Checkout and payments you never have to think about maintaining.',
        'Inventory, variants and shipping handled natively — no plugin archaeology.',
        'An app ecosystem for the things it doesn\'t do natively (with the caveat that every app taxes speed).',
        'Hosting and security are Shopify\'s problem, not yours.',
      ] },
      { type: 'p', text: 'The trade-off: monthly costs add up (platform + apps + themes), deep customization hits the ceiling of Liquid and the theme system, and content publishing is serviceable but not pleasant.' },
      { type: 'h3', text: 'Where WordPress wins' },
      { type: 'list', items: [
        'Content-heavy sites: publishing, SEO control, editorial workflows.',
        'Business and service websites where "the team edits pages themselves" is the core requirement.',
        'Cost structure: often cheaper to run for a site whose commerce is modest.',
        'WooCommerce covers real stores when the catalog isn\'t enormous.',
      ] },
      { type: 'p', text: 'The trade-off: you own the maintenance. Updates, backups, security hardening and plugin conflicts are on you — or on your developer, which is exactly the kind of work I do for clients.' },
      { type: 'h3', text: 'Questions I ask before recommending either' },
      { type: 'list', items: [
        'How many products, and how complex are variants?',
        'Who updates the site, and how often — a founder or a content team?',
        'Is the blog/content a traffic source that matters, or an afterthought?',
        'What\'s the realistic monthly budget for platform + apps + maintenance?',
        'Are there integrations that already exist for one platform (CRMs, GoHighLevel, marketplaces)?',
      ] },
      { type: 'h3', text: 'The answer I gave last week' },
      { type: 'p', text: 'A service business with a small merchandise line: WordPress, because the site\'s job is to sell expertise and the shop is a side door. A fashion brand with hundreds of SKUs and seasonal drops: Shopify, because their team should spend time on products, not plugin updates. Neither answer was surprising — the honest questions got them there. If you\'re stuck between the two, you can run your situation by me through the contact page; the platform decision is cheap to get right and expensive to get wrong.' },
    ],
    related: [
      { label: 'Shopify development services', href: '/services/shopify-development' },
      { label: 'WordPress development services', href: '/services/wordpress-development' },
    ],
  },
];

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const getRelatedPosts = (slug: string): Post[] =>
  posts.filter((p) => p.slug !== slug);
