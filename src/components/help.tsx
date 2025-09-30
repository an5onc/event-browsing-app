/* 
help.tsx — App Help & Support page

Purpose: Central place for FAQs, quick how-tos, troubleshooting, and contact options so users can self-solve common issues fast.

Audience: All users. No auth required to read. If signed in, show user-specific tips (e.g., “Where to find my RSVPs”).

What this page should do:
- Display a searchable list of FAQs (expand/collapse answers).
- Link to key tasks with deep links (Create Event, Search, RSVP, Edit Profile).
- Provide a lightweight “Having trouble?” flow: surface common fixes, then offer contact options.
- Show system status/messages if the app detects degraded features (read from config/context).
- Optional: show app version/build and last content update timestamp.

Common references:
- Routing: src/App.tsx (for deep links)
- Events list/detail: src/pages/EventsPage.tsx, src/components/events/*
- Create event: src/pages/NewEventPage.tsx (or CreateEvent.tsx if used)
- Search/filters: src/components/common/SearchBar.tsx, src/components/events/EventFilters.tsx
- Context/state: src/lib/api.ts, Events context/hooks if present
- Buttons/atoms: reuse existing button/text components for consistency

Content sections (in order):
1) Page header: “Help & Support” + concise subtitle.
2) Quick Actions (buttons/links):
   - “Create an event”
   - “Find events”
   - “See my RSVPs”
   - “Edit or delete my event”
3) FAQ (accordion):
   - Creating events (title/date/time/location/category/image URL)
   - Editing/deleting events (owners/admins only)
   - RSVPs and un-RSVPs
   - Likes and un-likes
   - Searching and filtering by date range/category
   - Account basics (sign up with Bear ID), deleting account
4) Troubleshooting:
   - Form won’t submit? (check required fields, date/time format, network)
   - Event not visible? (refresh, check filters/date order, ownership)
   - Can’t RSVP? (sign in, event RSVP windows)
5) Still need help?
   - Primary: mailto: support (placeholder) or opens a minimal contact modal with subject + description
   - Secondary: link to system status page/section if available
6) Footer:
   - App version/build (from env/config)
   - Links to Terms/Privacy (if available)

Data sources:
- FAQs: start with a static array in this file; allow future fetch from /help or CMS.
- Status/version: read from config/env or a lightweight /health endpoint.

UX rules:
- Keyboard accessible: all accordion items focusable; Enter/Space toggles.
- Search filters FAQs client-side (title + body).
- Keep answers short; link to pages that execute the task.
- Never block the user with modals; modals are optional and dismissible.

Error/empty states:
- If FAQ fetch fails, fall back to bundled static list.
- If status fetch fails, hide status area; do not show errors to user.

Metrics hooks (optional):
- Track: help_search_used, faq_opened, quick_action_clicked, contact_clicked.
- Include minimal context (faq_id, query length). No PII.

Accessibility:
- Use semantic headings (h1, h2), <details>/<summary> or ARIA accordion pattern.
- Provide visible focus, 16px+ body text, sufficient contrast.

Performance:
- Keep page zero-data and tree-shakeable. Load any status/FAQ fetch after first paint.

Future ideas:
- Context-aware tips (e.g., show “How to edit your event” if user owns events).
- Inline short videos or GIFs (lazy-loaded).
- Localized content.

Assignment: Diego
Owner note: Treat this as living documentation. If you add new user-visible features (e.g., Waitlist, Reports), add a new FAQ + Quick Action link here.

*/