# handle_waitlist_email.py
import os
import json
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from firebase_admin import firestore
import google.cloud.firestore

def send_notification_email_raw(user_email: str) -> None:
    """Send notification email via SMTP"""
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    notification_email_raw = os.environ.get("NOTIFICATION_EMAIL_RAW")

    if not all([smtp_user, smtp_password, notification_email_raw]):
        print("Warning: SMTP config incomplete. Skipping email.")
        return

    team_emails = [e.strip() for e in notification_email_raw.split(",") if e.strip()]

    try:
        msg_internal = MIMEMultipart()
        msg_internal["From"] = smtp_user
        msg_internal["To"] = notification_email_raw
        msg_internal["Subject"] = "New Evalin Waitlist Signup"

        msg_external = MIMEMultipart()
        msg_external["From"] = smtp_user
        msg_external["To"] = user_email
        msg_external["Subject"] = "Thanks for Joining Evalin — Smarter Product Launch Decisions Start Here"

        body_interal = f"""
        New waitlist signup!

        Email: {user_email}
        Timestamp: {datetime.utcnow().isoformat()} UTC
        """

        body_external = f"""
        Hi there,
        
        Thanks for signing up to Evalin's waitlist. We're building the first “FICO-style” score that helps e-commerce brands evaluate whether a product is worth launching before investing in inventory, marketing, or production.
        
        As an early subscriber, you'll be first to access tools that help you:

        • Predict product demand and competitiveness
        • Identify red flags before committing capital
        • Reduce risk across new product launches
        • Validate ideas with real market intelligence
        
        We'll keep you updated as we approach launch and will reach out soon with early access opportunities.
        
        Thanks again for your interest,
        The Evalin Team
        """

        msg_internal.attach(MIMEText(body_interal, "plain"))

        msg_external.attach(MIMEText(body_external, "plain"))


        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg_internal, to_addrs=team_emails)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg_external)

        print(f"Email sent to {notification_email_raw}")
    except Exception as e:
        print(f"Email send failed: {e}")


def process_waitlist_signup(db: google.cloud.firestore.Client, email: str) -> tuple[dict, int]:
    """
    Core business logic. Returns (response_dict, status_code)
    """
    email = email.strip().lower()

    if not email or "@" not in email:
        return {"error": "Valid email address is required"}, 400

    # Check duplicate
    snapshot = db.collection("waitlist") \
        .where("email", "==", email) \
        .limit(1) \
        .get()

    if list(snapshot):
        return {"message": "Email already on waitlist", "duplicate": True}, 200

    # Add to Firestore
    _, doc_ref = db.collection("waitlist").add({
        "email": email,
        "created_at": datetime.utcnow(),
        "status": "pending"
    })

    print(f"Added {email} to waitlist (ID: {doc_ref.id})")

    # Send notification
    send_notification_email_raw(email)

    return {"message": "Successfully added to waitlist", "email": email}, 200