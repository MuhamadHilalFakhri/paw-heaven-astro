# PawCare+

PawCare+ is a single-page Astro landing site. Astro components render the content, React islands handle interactions, and shadcn/ui provides the shared controls. Copy lives in `src/data/site-content.ts`.

## Development

Requirements: Node.js 22.12 or newer and npm 9.6.5 or newer.

```sh
npm install
npm run dev
```

Run the Astro and TypeScript checks, then create a production build and preview it locally with:

```sh
npm run check
npm run build
npm run preview
```

The page is in `src/pages/index.astro`, the page shell is in `src/layouts/BaseLayout.astro`, styles are split under `src/styles`, and the page imports WebP images from `src/assets/clear`. Original image files are kept beside the WebP versions as source material.

The previous TanStack Start source is archived beside this project at `D:\Landing Page - Vet - legacy-source`; it is not part of the Astro build.

## Motion and responsive layout

GSAP and ScrollTrigger animate the hero, section reveals, and desktop decorations in
`src/scripts/page-animations.ts`. Menu, accordion, and popover motion comes from shadcn/ui.
Content is visible without JavaScript, and all motion respects `prefers-reduced-motion`.
Shadcn ScrollArea uses browser scrolling; desktop hover effects are limited to fine pointers, and mobile
uses shorter reveals. Layout and readable mobile text overrides are in
`src/styles/responsive-refinements.css`; shared interaction styles are in
`src/styles/interactions.css`. Keep every authored code file under 200 lines.

## Interactive features

The header stays visible throughout the landing page on desktop and mobile.
Shadcn dialogs provide service details and a four-step appointment request.
Booking, feedback, and newsletter requests prepare an email draft or copyable
summary; they do not send emails, reserve slots, or automatically subscribe anyone.
Confirm requests with the clinic. Connect a booking service before advertising live
availability or automated confirmation. Personal form data stays in the current page.

The plan finder highlights existing plan benefits and provides a comparison table.
`src/data/community-content.ts` holds clinic photos, adoption profiles, and client
reviews. Arrays are intentionally empty until real content is supplied; only reviews
with publication permission are displayed. Add real photo assets under public/images.
The site shows an adoption enquiry and feedback form when those records are absent.
Doctor profiles are outside the current scope.

## UI components

Reusable shadcn/ui primitives live in `src/components/ui`; product interactions
live in `src/components/interactive`. `components.json` configures the official
CLI. Shared styling uses Tailwind CSS 4 and the existing PawCare+ design tokens.
The page uses Select, ScrollArea, Dialog, Sheet, Accordion, Calendar, Popover,
Button, Input, Textarea, Label, Checkbox, Table, Card, Badge, ToggleGroup, and
Carousel. Calendar and Carousel are split into smaller files to keep the 200-line
limit. Styling adjustments are in `shadcn-controls.css` and `shadcn-overlays.css`.
GSAP starts after the page ScrollArea hydrates to avoid React hydration conflicts.
