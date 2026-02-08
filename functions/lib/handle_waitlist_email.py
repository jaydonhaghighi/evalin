import os
import smtplib
import ssl
from datetime import datetime
from email.message import EmailMessage
from typing import Any, Iterable, Optional
from urllib.parse import urljoin

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


def _build_msg(
    *,
    subject: str,
    from_addr: str,
    to_addrs: Iterable[str],
    body_text: str,
    body_html: Optional[str] = None,
) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = from_addr
    msg["To"] = ", ".join(list(to_addrs))
    msg["Subject"] = subject
    msg.set_content(body_text)
    if body_html:
        msg.add_alternative(body_html, subtype="html")
    return msg


def _safe_str(v: Any) -> str:
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    try:
        return str(v)
    except Exception:
        return ""


def _format_attribution(meta: Optional[dict[str, Any]]) -> str:
    if not isinstance(meta, dict) or not meta:
        return ""

    landing_path = _safe_str(meta.get("landing_path")).strip()
    landing_query = _safe_str(meta.get("landing_query")).strip()
    referrer = _safe_str(meta.get("referrer")).strip()
    user_agent = _safe_str(meta.get("user_agent")).strip()
    utm = meta.get("utm") if isinstance(meta.get("utm"), dict) else None
    click_ids = meta.get("click_ids") if isinstance(meta.get("click_ids"), dict) else None

    lines: list[str] = []

    # Best-effort landing URL (if you ever serve multiple domains, adjust this).
    if landing_path:
        base = os.environ.get("PUBLIC_BASE_URL", "https://evalin.io").strip() or "https://evalin.io"
        landing = urljoin(base.rstrip("/") + "/", landing_path.lstrip("/"))
        if landing_query:
            landing = f"{landing}{landing_query}"
        lines.append(f"Landing: {landing}")
    elif landing_query:
        lines.append(f"Landing query: {landing_query}")

    if referrer:
        lines.append(f"Referrer: {referrer}")

    if isinstance(utm, dict) and utm:
        utm_keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
        parts = []
        for k in utm_keys:
            v = _safe_str(utm.get(k)).strip()
            if v:
                parts.append(f"{k}={v}")
        if parts:
            lines.append("UTM: " + ", ".join(parts))

    if isinstance(click_ids, dict) and click_ids:
        parts = []
        for k, v in click_ids.items():
            sv = _safe_str(v).strip()
            if sv:
                parts.append(f"{k}={sv}")
        if parts:
            lines.append("Click IDs: " + ", ".join(parts))

    if user_agent:
        lines.append(f"User agent: {user_agent}")

    if not lines:
        return ""

    return "\n".join(["", "Attribution", "-----------", *lines])


def _build_confirmation_html(*, to_email: str) -> str:
    # NOTE: use a publicly reachable logo URL (CID embedding can be added later if needed).
    base = (os.environ.get("PUBLIC_BASE_URL") or "https://evalin.io").strip() or "https://evalin.io"
    logo_url = urljoin(base.rstrip("/") + "/", "landing/evalin_logo.png")
    how_it_works_url = urljoin(base.rstrip("/") + "/", "how-it-works")

    # Simple, broadly compatible HTML email (table layout, inline-ish styles).
    return f"""\
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Thanks for joining Evalin</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;">
    <!-- Preheader -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      You're on the Evalin waitlist. We'll reach out soon with early access.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
            <tr>
              <td style="padding:8px 8px 16px 8px;">
                <img src="{logo_url}" alt="Evalin" height="28" style="display:block;height:28px;width:auto;" />
              </td>
            </tr>

            <tr>
              <td style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.25;letter-spacing:-0.01em;">
                  Thanks for joining the waitlist
                </h1>
                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155;">
                  You're in. We'll reach out soon with early access to Evalin.
                </p>

                <div style="background:#F1F5F9;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;margin:0 0 16px 0;">
                  <p style="margin:0;font-size:13px;line-height:1.5;color:#0F172A;">
                    <strong>Email on file:</strong> {to_email}
                  </p>
                </div>

                <h2 style="margin:0 0 8px 0;font-size:14px;line-height:1.4;color:#0F172A;">
                  What happens next
                </h2>
                <ul style="margin:0 0 16px 18px;padding:0;color:#334155;font-size:14px;line-height:1.6;">
                  <li>We’ll invite you to early access as soon as it opens for you.</li>
                  <li>You’ll get product updates and short prompts to help us tailor Evalin to your workflow.</li>
                  <li>If you reply with your store/category, we’ll prioritize relevant features.</li>
                </ul>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
                  <tr>
                    <td>
                      <a href="{how_it_works_url}"
                         style="display:inline-block;background:#111827;color:#FFFFFF;text-decoration:none;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">
                        See how it works
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:16px 0 0 0;font-size:12px;line-height:1.6;color:#64748B;">
                  If you didn’t request this, you can ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 8px 0 8px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94A3B8;">
                  © {datetime.utcnow().year} Evalin
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


def send_waitlist_emails(user_email: str, meta: Optional[dict[str, Any]] = None) -> dict:
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
        attribution_block = _format_attribution(meta)
        internal_body = "\n".join(
            [
                "New waitlist signup!",
                "",
                f"Email: {user_email}",
                f"Timestamp: {datetime.utcnow().isoformat()} UTC",
            ]
        ) + attribution_block

        subject_suffix = ""
        try:
            if isinstance(meta, dict):
                lp = _safe_str(meta.get("landing_path")).strip()
                campaign = ""
                utm = meta.get("utm") if isinstance(meta.get("utm"), dict) else None
                if isinstance(utm, dict):
                    campaign = _safe_str(utm.get("utm_campaign")).strip()
                if lp and campaign:
                    subject_suffix = f" ({lp} · {campaign})"
                elif lp:
                    subject_suffix = f" ({lp})"
                elif campaign:
                    subject_suffix = f" ({campaign})"
        except Exception:
            subject_suffix = ""

        messages.append(
            _build_msg(
                subject=f"New Evalin Waitlist Signup{subject_suffix}",
                from_addr=smtp_from,
                to_addrs=notify_to,
                body_text=internal_body,
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

        external_html = _build_confirmation_html(to_email=user_email)
        messages.append(
            _build_msg(
                subject="Thanks for Joining Evalin",
                from_addr=smtp_from,
                to_addrs=[user_email],
                body_text=external_body,
                body_html=external_html,
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


def process_waitlist_signup(
    db: google.cloud.firestore.Client, email: str, meta: Optional[dict[str, Any]] = None
) -> tuple[dict, int]:
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
                "meta": meta or {},
            }
        )
        print(f"Added {email} to waitlist (ID: {doc_ref.id})")
    except AlreadyExists:
        return {"message": "Email already on waitlist", "duplicate": True}, 200

    # Send notification (best-effort)
    smtp_status = send_waitlist_emails(email, meta)

    return {
        "message": "Successfully added to waitlist",
        "email": email,
        "smtp": smtp_status,
    }, 200