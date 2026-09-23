"""
Static catalogs for roles, permissions, and settings.

No models — this is configuration the frontend renders in the admin UI.
If RBAC is needed later (permissions checked per-endpoint), promote
this to real models without changing the response shape.
"""


ROLES = [
    {
        "code": "SUPER_ADMIN",
        "name": "Super Admin",
        "description": "Full access to every part of the platform.",
        "permissions": ["*"],
    },
    {
        "code": "ADMIN",
        "name": "Admin",
        "description": "General administrative access.",
        "permissions": [
            "providers.view", "providers.approve", "providers.suspend",
            "users.view", "users.suspend",
            "rides.view", "trips.view",
            "payments.view", "payments.refund",
            "disputes.view", "disputes.resolve",
            "refunds.view", "refunds.approve",
            "payouts.view", "payouts.approve",
            "receipts.view", "reconciliation.view",
            "analytics.view", "audit.view",
            "settings.view",
        ],
    },
    {
        "code": "SUPPORT",
        "name": "Support Agent",
        "description": "Handle customer support and disputes.",
        "permissions": [
            "users.view", "providers.view",
            "rides.view", "trips.view",
            "disputes.view", "disputes.resolve",
            "safety.view",
        ],
    },
    {
        "code": "FINANCE",
        "name": "Finance Officer",
        "description": "Manage payments, refunds, and payouts.",
        "permissions": [
            "payments.view", "payments.refund",
            "refunds.view", "refunds.approve",
            "payouts.view", "payouts.approve",
            "receipts.view", "reconciliation.view",
            "analytics.revenue",
        ],
    },
    {
        "code": "OPS",
        "name": "Operations",
        "description": "Live operations and monitoring.",
        "permissions": [
            "rides.view", "trips.view",
            "providers.view", "safety.view",
            "analytics.view",
        ],
    },
    {
        "code": "READONLY",
        "name": "Read Only",
        "description": "View-only access.",
        "permissions": [
            "providers.view", "users.view", "rides.view", "trips.view",
            "payments.view", "refunds.view", "payouts.view",
            "receipts.view", "disputes.view", "analytics.view",
        ],
    },
]


PERMISSIONS = [
    # Providers
    {"code": "providers.view", "name": "View providers", "group": "Providers"},
    {"code": "providers.approve", "name": "Approve providers", "group": "Providers"},
    {"code": "providers.suspend", "name": "Suspend providers", "group": "Providers"},
    # Users
    {"code": "users.view", "name": "View users", "group": "Users"},
    {"code": "users.suspend", "name": "Suspend users", "group": "Users"},
    # Rides / Trips
    {"code": "rides.view", "name": "View rides", "group": "Rides"},
    {"code": "trips.view", "name": "View trips", "group": "Trips"},
    # Money
    {"code": "payments.view", "name": "View payments", "group": "Money"},
    {"code": "payments.refund", "name": "Refund payments", "group": "Money"},
    {"code": "refunds.view", "name": "View refunds", "group": "Money"},
    {"code": "refunds.approve", "name": "Approve refunds", "group": "Money"},
    {"code": "payouts.view", "name": "View payouts", "group": "Money"},
    {"code": "payouts.approve", "name": "Approve payouts", "group": "Money"},
    {"code": "receipts.view", "name": "View receipts", "group": "Money"},
    {"code": "reconciliation.view", "name": "View reconciliation", "group": "Money"},
    # Disputes
    {"code": "disputes.view", "name": "View disputes", "group": "Disputes"},
    {"code": "disputes.resolve", "name": "Resolve disputes", "group": "Disputes"},
    # Safety
    {"code": "safety.view", "name": "View safety alerts", "group": "Safety"},
    # System
    {"code": "analytics.view", "name": "View analytics", "group": "System"},
    {"code": "analytics.revenue", "name": "View revenue analytics", "group": "System"},
    {"code": "audit.view", "name": "View audit logs", "group": "System"},
    {"code": "settings.view", "name": "View platform settings", "group": "System"},
    {"code": "settings.edit", "name": "Edit platform settings", "group": "System"},
]


DEFAULT_SETTINGS = {
    "platform_name": "Falcon Rider",
    "support_email": "support@falconrider.local",
    "support_phone": "+255700000000",
    "default_currency": "TZS",
    "platform_commission_percent": 15.0,
    "min_payout_amount": 10000.0,
    "payout_schedule": "weekly",  # daily | weekly | monthly | on_demand
    "sos_auto_escalate_minutes": 5,
    "provider_auto_verify": False,
    "maintenance_mode": False,
}
