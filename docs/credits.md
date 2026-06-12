# Credits

This repo learns from excellent open-source slide and design tools. Credit here does not mean their authors endorse this project.

## Frontend Slides

`frontend-slides` by Zara Zhang is a major inspiration for this repo's custom HTML deck direction.

- Repository: https://github.com/zarazhangrui/frontend-slides
- License: MIT, copyright 2025 Zara Zhang.
- Vendored references: `vendor/frontend-slides/`

What this repo learns from it:

- HTML slides can be treated as real frontend surfaces, not weak exports.
- Visual style discovery should happen through previews, not only verbal taste descriptions.
- Distinctive curated styles help avoid generic AI-generated deck aesthetics.
- Fixed 16:9 stages, presenter navigation and browser QA matter.
- A compact template index plus progressive loading is a good way to offer many styles without overloading the agent.

What this repo keeps distinct:

- Source grounding and claim ledgers are mandatory for factual decks.
- Research artifacts, legal/cost caveats and source maps remain first-class.
- The default workflow is artifact-first: deck plan, source map, claim ledger, story spine, slide sorter, design contract, slide specs, QA, then render.
- Any copied MIT-licensed code or assets must preserve the required copyright and license notice.

The vendored folder keeps the upstream license in `vendor/frontend-slides/LICENSE` and a repo-local notice in `vendor/frontend-slides/NOTICE.md`.

## Slidev

Slidev is an important reference for developer-friendly presentation systems, especially Markdown-driven decks, presenter mode, drawing/annotation, Vue components, diagrams and export paths.

- Repository: https://github.com/slidevjs/slidev
- Website: https://sli.dev/

This repo may use Slidev as a future renderer option, but the current first-class renderer remains the local artifact workflow and Marp/custom HTML output.

## Gamma, Canva, Figma Slides, Plus AI and SlideSpeak

These products inform workflow expectations:

- outline before render,
- fast theme exploration,
- template and asset breadth,
- editable review surfaces,
- global style changes separate from slide-local edits,
- export and collaboration expectations.

They are product references, not copied implementations.

## Palette And Consulting References

The style workbench also references public inspiration sources:

- Coolors popular PowerPoint palettes: https://coolors.co/palettes/popular/powerpoint
- Happy Hues: https://www.happyhues.co/
- Adobe Color: https://color.adobe.com/
- Color Hunt: https://colorhunt.co/
- Ampler McKinsey deck collection: https://ampler.io/articles/50-free-mckinsey-powerpoint-slide-decks/
- Slideworks BCG slide-writing guide: https://slideworks.io/resources/bcg-approach-to-great-slides-practical-guide-from-former-consultant
- SlideGenius Accenture portfolio: https://www.slidegenius.com/portfolio/accenture
- HyperFrames design page: https://www.hyperframes.dev/design
- HyperFrames by HeyGen: https://github.com/heygen-com/hyperframes
- Refero Styles: https://styles.refero.design/
- Refero Skill: https://github.com/referodesign/refero_skill
- VoltAgent awesome-design-md: https://github.com/VoltAgent/awesome-design-md
- pptx-design-styles by TodayCode: https://github.com/corazzon/pptx-design-styles

These are attribution links and pattern references. They do not grant permission to copy proprietary templates, screenshots, client work or private assets.

Use company and product names for attribution only. Public-facing style labels should stay neutral unless the user owns the brand or explicitly asks for a private comparison.

For the fuller import/reference policy, see [template-source-registry.md](template-source-registry.md).
