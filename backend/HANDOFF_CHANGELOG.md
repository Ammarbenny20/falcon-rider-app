# Falcon Rider — Backend Changelog

Since the last handoff, the following changes have been made in
response to the audit.

## Session 1 — Security & Data Integrity

- **B1** — Ownership checks on `/payments/{id}/` and `/journeys/{id}/`
- **B2** — `select_for_update` row locking on bookings (prevents overselling)
- **B3** — Booking cancel restores seats; status transitions validated
- **B4** — All `.objects.get()` replaced with `get_object_or_404` (404 not 500)
- **B5** — Production settings fail loudly if secrets missing
- **B6** — Redis-backed cache for OTP + throttling (multi-worker safe)
- **B7** — All versions pinned (Django==5.0.14, DRF==3.15.2, etc.)
- **Bonus A3** — Journey row auto-created on booking accept

## Session 2 — Missing Features

### Provider Registration (A1)
`POST /api/v1/provider/register/` — upgrades a user to PROVIDER and creates
ProviderProfile + Vehicle in one atomic call.

### Vehicle CRUD (A2)
- POST /api/v1/vehicles/
- GET /api/v1/vehicles/
- GET /api/v1/vehicles/{id}/
- PATCH /api/v1/vehicles/{id}/
- DELETE /api/v1/vehicles/{id}/

Ownership enforced — providers see only their own vehicles.

### Community Journey Join (A4)
`POST /api/v1/community-journeys/{id}/join/` — passenger joins directly,
bypassing the matching engine.

### Notification Events (A6)
Notifications fire automatically on:
- Booking accepted / cancelled
- Journey started / completed / cancelled
- Payment succeeded / failed / refunded
- Provider verified / rejected
- SOS alerts

Endpoints:
- GET /api/v1/notifications/
- POST /api/v1/notifications/register-device/
- POST /api/v1/notifications/{id}/read/

### Extended Admin (A5)
- GET /api/v1/admin/providers/pending/
- POST /api/v1/admin/providers/{id}/approve|reject|suspend/
- GET /api/v1/admin/users/
- POST /api/v1/admin/users/{id}/suspend|activate/
- GET /api/v1/admin/analytics/
- GET /api/v1/admin/analytics/revenue/
- GET /api/v1/admin/analytics/trips/
- GET /api/v1/admin/disputes/  (stub)
- POST /api/v1/admin/payments/{id}/refund/

## Tests
19 passing: auth (3), session 2 (8), booking flow (8).

Run: pytest apps/ -v

## Version Pins
Django==5.0.14
djangorestframework==3.15.2
django-redis==5.4.0
drf-spectacular==0.27.2

## Not Yet Done
- A7 — Real payment gateway (blocked on business credentials)
- B8 — More tests (webhook HMAC, document upload, notification delivery)
- Docker — Files ready; Docker not installed on dev machine

## Contract
Nothing in the frontend contract changed. All existing endpoints keep
their exact shapes. New endpoints are additive.

Base URL: http://localhost:8000/api/v1/
Health:   http://localhost:8000/health/
Docs:     http://localhost:8000/api/docs/

## Demo Mode — Payment Simulation

The payment gateway is stubbed because real M-PESA credentials are not available.
Demo helpers are enabled so frontend can build the payment UI today.

### POST /api/v1/payments/initiate/
Response includes demo hints:
  "demo_confirm_endpoint": "/api/v1/payments/{id}/confirm/"
  "demo_confirm_hint": "POST to simulate gateway success"

### POST /api/v1/payments/{id}/confirm/  (DEMO ONLY)
Simulates gateway callback. Body: {"simulate": "SUCCESS" | "FAILED"}
Effects: Payment.status -> SUCCESS, SharedCost.payment_status -> PAID,
fires notification, logs audit entry. Owner-only permission.

### Exit Demo Mode
Edit .env:  PAYMENT_DEMO_MODE=False
Restart runserver. /confirm/ returns 403. No frontend changes needed.

### Real Gateway Integration
Replace 3 functions in apps/payments/services.py:
1. generate_gateway_reference() -> real API
2. PaymentInitiateView.post() -> store real STK push response
3. process_webhook() -> map gateway payload
Frontend code stays identical.


## Live Tracking (verified)

Both driver and passenger tracking endpoints are fully working.

### Driver POST — /api/v1/journeys/{id}/location/
Provider-only. Body: {"latitude": ..., "longitude": ...}
Response:
  {
    "detail": "Location updated",
    "distance_to_destination_km": 4.176,
    "eta_seconds": 601
  }

### Passenger GET — /api/v1/journeys/{id}/location/
Participants-only (booking owner or provider). Response:
  {
    "latitude": -6.8,
    "longitude": 39.24,
    "updated_at": "...",
    "distance_to_destination_km": 4.176,
    "eta_seconds": 601,
    "status": "IN_PROGRESS"
  }

Non-participants receive 404. Journey state gates the endpoint:
must be IN_PROGRESS for tracking to be meaningful.

### Frontend usage
- Driver: POST every 5s while status = IN_PROGRESS
- Passenger: GET every 5s, place marker + show ETA/distance

### Polling vs WebSockets
Currently uses polling. Frontend fetches every 5s. For MVP this is
sufficient. WebSockets (Django Channels) can replace polling later
without changing the response shape.


## Admin Portal — Complete Backend Implementation

All requests from the frontend team's refinement doc are implemented
and verified end-to-end.

### Command Center (5 endpoints)
GET /api/v1/admin/dashboard/overview/       — full aggregate
GET /api/v1/admin/dashboard/live-stats/     — lightweight, 15s refresh
GET /api/v1/admin/dashboard/action-center/  — action items
GET /api/v1/admin/dashboard/activity/       — recent events feed
GET /api/v1/admin/dashboard/map/            — live markers

### Disputes (full workflow)
POST /api/v1/disputes/                      — customer files
GET  /api/v1/disputes/mine/                 — own disputes
GET  /api/v1/admin/disputes/                — admin list, filterable
GET  /api/v1/admin/disputes/{id}/           — detail
POST /api/v1/admin/disputes/{id}/investigate/
POST /api/v1/admin/disputes/{id}/assign/
POST /api/v1/admin/disputes/{id}/resolve/
POST /api/v1/admin/disputes/{id}/close/

### Refund Workflow
POST /api/v1/refund-requests/               — customer files
GET  /api/v1/refund-requests/mine/
GET  /api/v1/admin/refund-requests/         — filter: ?status=
GET  /api/v1/admin/refund-requests/{id}/
POST /api/v1/admin/refund-requests/{id}/approve/
POST /api/v1/admin/refund-requests/{id}/reject/
POST /api/v1/admin/refund-requests/{id}/complete/

### Payouts + Earnings (15% commission)
GET  /api/v1/earnings/                      — provider's own
GET  /api/v1/payouts/mine/                  — provider's own payouts
GET  /api/v1/admin/earnings/
GET  /api/v1/admin/payouts/
POST /api/v1/admin/payouts/generate/        — batch all available earnings
GET  /api/v1/admin/payouts/{id}/
POST /api/v1/admin/payouts/{id}/approve/
POST /api/v1/admin/payouts/{id}/reject/
POST /api/v1/admin/payouts/{id}/mark-paid/

### Receipts + Reconciliation
GET /api/v1/receipts/mine/
GET /api/v1/receipts/mine/{booking_id}/
GET /api/v1/admin/receipts/
GET /api/v1/admin/receipts/{booking_id}/
GET /api/v1/admin/reconciliation/
GET /api/v1/admin/reconciliation/exceptions/
GET /api/v1/admin/reconciliation/{booking_id}/

### Governance
GET   /api/v1/admin/staff/
GET   /api/v1/admin/roles/
GET   /api/v1/admin/permissions/
GET   /api/v1/admin/notifications/
POST  /api/v1/admin/notifications/{id}/retry/
GET   /api/v1/admin/settings/
PATCH /api/v1/admin/settings/
GET   /api/v1/admin/search/?q=

### Verification + Vehicles + Community Journeys
GET  /api/v1/admin/verification/queue/
GET  /api/v1/admin/verification/{id}/
POST /api/v1/admin/verification/{id}/approve/
POST /api/v1/admin/verification/{id}/reject/
GET  /api/v1/admin/vehicles/
GET  /api/v1/admin/vehicles/{id}/
GET  /api/v1/admin/journeys/                — COMMUNITY_JOURNEY only
GET  /api/v1/admin/journeys/{id}/
GET  /api/v1/admin/journey-templates/
GET  /api/v1/admin/journey-instances/

### Semantic Fixes
POST /api/v1/admin/providers/{id}/professional/approve|reject|suspend/
POST /api/v1/admin/providers/{id}/community/approve|reject|suspend/
GET  /api/v1/admin/trips/                   — PROFESSIONAL only
GET  /api/v1/admin/audit-logs/?action=&target_type=&target_id=&user_email=

### Notes
- Platform commission: 15% (configurable via PLATFORM_COMMISSION_PERCENT env)
- Settings stored in Redis (multi-worker safe, no migration)
- Roles are static catalog (6 predefined roles)
- Receipts + Reconciliation are computed from existing records, no new model
- All new endpoints inherit the existing error contract (Shape A / Shape B)
- All state changes write to the audit log with X-Request-ID tracing
