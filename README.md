# MXD Junk Removal CRM

Mobile-first operations command center, adapted from the Concrete Coating CRM with an MXD black, gray, and white design.

## Included
- Overview: pipeline, upcoming pickups, outstanding quotes, collections, and priority follow-ups.
- Leads and pipeline: add/edit leads, change stages, click to call/text/open map.
- Estimates: prepare and track quotes, convert approved estimates to jobs.
- Jobs: status, collection tracking, pickup date, arrival time, and field notes.
- Schedule: calendar and mobile agenda for jobs and follow-ups.
- Follow-ups: task creation, assignment, due dates and completion.

## Important: preview mode
This is a functioning browser-based preview with explicitly fictional demo data.
**It does not yet synchronize across users or automatically import inbound leads.**
Data persists only in that browser using localStorage. Do not enter real customer information in a production workflow until protected database, auth, and backups are configured.

## Start
```bash
npm install
npm run dev
npm run build
```

## Production rollout
1. Configure private Supabase project with RLS policies.
2. Implement login and team roles.
3. Replace localStorage with protected server-side data.
4. Connect inbound web forms / lead providers to the database through authenticated endpoints.
5. Set up data backups, import, and audit logging.
