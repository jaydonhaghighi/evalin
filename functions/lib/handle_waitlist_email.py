import os
import smtplib
import ssl
from datetime import datetime
from email.message import EmailMessage
from typing import Iterable, Optional

import google.cloud.firestore
from firebase_admin import firestore
from google.api_core.exceptions import AlreadyExists


def _env_bool(name: str, default: bool = False) -> bool:
    val = os.environ.get(name)
    if val is None:
        return default
    return val.strip().lower() in {"1", "true", "yes", "y", "on"}


def _parse_recipients(raw: Optional[str]) -> list[str]:
    if not raw:
        return []
    return [e.strip() for e in raw.split(",") if e.strip()]


def _build_msg(*, subject: str, from_addr: str, to_addrs: Iterable[str], body: str) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = from_addr
    msg["To"] = ", ".join(list(to_addrs))
    msg["Subject"] = subject
    msg.set_content(body)
    return msg


def send_waitlist_emails(user_email: str) -> dict:
    """
    Very simple SMTP sender.

    """
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = (os.environ.get("SMTP_USER") or "").strip()
    smtp_password = (os.environ.get("SMTP_PASSWORD") or "").strip()
    smtp_from = (os.environ.get("SMTP_FROM") or smtp_user).strip()

    notify_to = _parse_recipients(os.environ.get("SMTP_NOTIFY_TO"))

    send_confirmation = _env_bool("SMTP_SEND_CONFIRMATION", default=True)
    use_ssl = _env_bool("SMTP_USE_SSL", default=(smtp_port == 465))

    if not smtp_user or not smtp_password:
        print("Warning: SMTP_USER/SMTP_PASSWORD not set; skipping email.")
        return {
            "attempted": False,
            "sent": False,
            "reason": "missing_smtp_credentials",
        }

    print(
        "SMTP config:"
        f" host={smtp_host}"
        f" port={smtp_port}"
        f" use_ssl={use_ssl}"
        f" notify_recipients={len(notify_to)}"
        f" send_confirmation={send_confirmation}"
    )

    ctx = ssl.create_default_context()

    def _connect():
        if use_ssl:
            return smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx)
        return smtplib.SMTP(smtp_host, smtp_port)

    # Compose messages
    messages: list[EmailMessage] = []

    if notify_to:
        internal_body = "\n".join(
            [
                "New waitlist signup!",
                "",
                f"Email: {user_email}",
                f"Timestamp: {datetime.utcnow().isoformat()} UTC",
            ]
        )
        messages.append(
            _build_msg(
                subject="New Evalin Waitlist Signup",
                from_addr=smtp_from,
                to_addrs=notify_to,
                body=internal_body,
            )
        )

    if send_confirmation:
        external_body = "\n".join(
            [
                "Hi there,",
                "",
                "Thanks for signing up to Evalin's waitlist. We're building a score that helps e-commerce brands decide whether a product is worth launching before investing in inventory, marketing, or production.",
                "",
                "As an early subscriber, you'll be first to access tools that help you:",
                "",
                "- Predict product demand and competitiveness",
                "- Identify red flags before committing capital",
                "- Reduce risk across new product launches",
                "- Validate ideas with real market intelligence",
                "",
                "We'll keep you updated as we approach launch and will reach out soon with early access opportunities.",
                "",
                "Thanks again for your interest,",
                "The Evalin Team",
            ]
        )
        messages.append(
            _build_msg(
                subject="Thanks for Joining Evalin",
                from_addr=smtp_from,
                to_addrs=[user_email],
                body=external_body,
            )
        )

    if not messages:
        # Nothing to send (e.g., notify list empty and confirmation disabled)
        print("SMTP: no emails to send (empty recipients and/or confirmation disabled).")
        return {
            "attempted": False,
            "sent": False,
            "reason": "no_recipients_or_confirmation_disabled",
        }

    try:
        with _connect() as server:
            if not use_ssl:
                server.starttls(context=ctx)
            server.login(smtp_user, smtp_password)
            for msg in messages:
                server.send_message(msg)
        print("SMTP email(s) sent.")
        return {
            "attempted": True,
            "sent": True,
            "internal_recipients": len(notify_to),
            "confirmation_sent": bool(send_confirmation),
        }
    except Exception as e:
        # Don't fail signup if SMTP fails.
        print(f"SMTP send failed: {e}")
        return {
            "attempted": True,
            "sent": False,
            "reason": "smtp_error",
            "error": str(e),
        }


def process_waitlist_signup(db: google.cloud.firestore.Client, email: str) -> tuple[dict, int]:
    """
    Core business logic. Returns (response_dict, status_code)
    """
    email = email.strip().lower()

    if not email or "@" not in email:
        return {"error": "Valid email address is required"}, 400

    # Atomic de-dupe: use the email as the document id.
    # (Firestore doc ids can't contain '/', which emails don't.)
    doc_ref = db.collection("waitlist").document(email)

    try:
        doc_ref.create(
            {
                "email": email,
                "created_at": firestore.SERVER_TIMESTAMP,
                "status": "pending",
            }
        )
        print(f"Added {email} to waitlist (ID: {doc_ref.id})")
    except AlreadyExists:
        return {"message": "Email already on waitlist", "duplicate": True}, 200

    # Send notification (best-effort)
    smtp_status = send_waitlist_emails(email)

    return {
        "message": "Successfully added to waitlist",
        "email": email,
        "smtp": smtp_status,
    }, 200