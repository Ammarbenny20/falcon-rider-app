from apps.accounts.notifications_service import _create_notification


def notify_provider_payout_created(payout):
    _create_notification(
        payout.provider.user,
        type_="payout_created",
        title="Payout yako inasubiri",
        body=f"Payout ya {payout.amount} {payout.currency} inasubiri idhini.",
        data={"payout_id": str(payout.id)},
    )


def notify_provider_payout_approved(payout):
    _create_notification(
        payout.provider.user,
        type_="payout_approved",
        title="Payout yako imeidhinishwa",
        body=f"Payout ya {payout.amount} {payout.currency} itatumwa hivi karibuni.",
        data={"payout_id": str(payout.id)},
    )


def notify_provider_payout_paid(payout):
    _create_notification(
        payout.provider.user,
        type_="payout_paid",
        title="Malipo yamefanyika",
        body=f"Umepokea {payout.amount} {payout.currency}. Ref: {payout.transaction_reference}",
        data={"payout_id": str(payout.id)},
    )


def notify_provider_payout_rejected(payout):
    _create_notification(
        payout.provider.user,
        type_="payout_rejected",
        title="Payout yako imekataliwa",
        body=f"Sababu: {payout.rejected_reason or 'Haijulikani'}",
        data={"payout_id": str(payout.id)},
    )
