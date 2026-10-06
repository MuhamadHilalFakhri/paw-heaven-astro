# Pet-care landing page from the reference

## Goal
Rebuild the uploaded design as the home page: a cheerful, illustration-led pet-care site with the same overall hierarchy, spacing, colors, and visual rhythm, adapted cleanly across desktop and mobile.

## What I’ll build
- A compact top navigation with brand, section links, and a prominent appointment button.
- A centered opening section with the “Loved by Pets, Trusted by Owners” message, decorative pet motifs, and a custom pet-and-owner illustration.
- Three highlighted trust/service cards for grooming, at-home care, and veterinary help.
- A testimonial band, followed by a six-item services grid.
- A split care-information section with benefits and appointment actions.
- A vaccination promotion panel with custom veterinary illustration.
- Three pricing plans with clear feature lists and selection buttons.
- Frequently asked questions with working expand/collapse behavior.
- A colorful closing illustration strip and a structured footer with newsletter signup and contact links.

## Visual direction
- Closely follow the reference’s airy white and pale-blue sections, teal framing, pink accents, black pill-shaped actions, rounded panels, and playful hand-drawn details.
- Create a cohesive set of original pet-care illustrations inspired by the reference rather than embedding the screenshot itself.
- Use distinctive friendly typography, generous whitespace, subtle entrance motion, and accessible contrast.
- Preserve the dense desktop composition while reorganizing all sections for comfortable phone reading and tapping.

## Technical details
- Implement the page in the existing TanStack home route with reusable React sections and data-driven cards.
- Add semantic design tokens in the global stylesheet and load the chosen web fonts through the document head.
- Store generated artwork inside the project and reference it as normal bundled assets.
- Add unique page title, description, Open Graph metadata, and Twitter card metadata.
- Keep all interactions frontend-only; appointment, plan, and newsletter actions will be presentational because no booking destination or submission service was supplied.

## Verification
- Confirm the page builds without errors.
- Check the full page visually at desktop and mobile widths.
- Test navigation, FAQ controls, buttons, and newsletter input for clear states and no overlaps or clipped content.
