---
name: responsive-dashboard-ui
description: Improve responsive React/Tailwind dashboard-style apps with mobile-first UI/UX practices. Use when Codex needs to redesign or refine auth screens, app shells, dashboards, tables, cards, forms, filters, charts, and modals so they work cleanly across phone, tablet, and desktop.
---

# Responsive Dashboard UI

Use this skill when working on dashboard-oriented products that need stronger UI/UX quality and reliable responsive behavior across devices.

## Workflow

1. Audit the routed pages and shared layout first.
2. Start at a narrow phone viewport before changing desktop layouts.
3. Fix structure and hierarchy before cosmetic polish.
4. Standardize spacing, surfaces, actions, and form states across related screens.
5. Re-test on phone, tablet, and desktop after each major layout change.

## Page Audit Order

1. Shared shell: navigation, header, content width, and spacing rhythm.
2. Auth flows: headline hierarchy, panel size, input density, validation visibility, and background treatment.
3. Dashboard views: cards, charts, summary panels, and empty states.
4. Data views: filters, tables, card fallbacks, row actions, and modals.
5. Forms: grouping, labels, hints, validation, file inputs, and submit placement.

## Responsive Defaults

- Design mobile-first at roughly `360px` wide, then expand to tablet and desktop.
- Prefer single-column layouts first; add columns only when they clearly improve scanning.
- Convert dense tables into stacked cards on small screens unless horizontal scrolling is genuinely better.
- Keep charts inside containers with explicit height and readable axis labels.
- Keep primary actions visible without forcing the user to hunt through crowded toolbars.
- Let text wrap; do not rely on tiny font sizes to preserve desktop layouts.
- Make touch targets comfortable on mobile, especially icon-only actions.

## Interaction Rules

- Show validation and failure states visibly, not only through screen-reader text.
- Keep focus states obvious for buttons, fields, links, dialogs, and navigation.
- Make destructive actions visually distinct and easy to confirm.
- Ensure dialogs fit inside the viewport and scroll internally when content grows.
- Preserve background media only when overlays still allow the image to read.

## React/Tailwind Guidance

- Prefer shared layout primitives and CSS tokens over one-off page styling.
- Use deliberate breakpoint changes rather than relying on accidental inheritance.
- Avoid fixed heights unless the content is intentionally constrained and tested.
- Keep filters, headers, and action rows wrap-friendly.
- For dashboard lists, support both desktop comparison and mobile readability.

## Verification

Read `references/mobile-checklist.md` for viewport QA and `references/dashboard-patterns.md` for concrete layout patterns before final validation.
