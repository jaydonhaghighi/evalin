"""
Firebase HTTPS function entrypoint.

Note: This repo's frontend runs on Vite (port 8080 by default). CORS must allow
that origin for local development, otherwise waitlist signups will fail.
"""

import json
import os
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore

# Import logic
from handle_waitlist_email import process_waitlist_signup

initialize_app()
db = firestore.client(database_id="evalin")

def _cors_origins() -> list[str]:
    """
    Comma-separated allowlist via env (CORS_ORIGINS), otherwise allow common local dev origins.
    Supports regex strings (firebase-functions CORS accepts regex patterns).
    """
    raw = os.environ.get("CORS_ORIGINS", "").strip()
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]

    # Allow localhost/127.0.0.1 on any port (Vite default is 8080; others include 5173/3000)
    return [
        r"http://localhost:\d+",
        r"http://127\.0\.0\.1:\d+",
    ]

@https_fn.on_request(
    memory=256,
    timeout_sec=60,
    # CORS configuration
    cors=options.CorsOptions(
        cors_origins=_cors_origins(),
        cors_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        # Optional: allow credentials if you send cookies/auth headers
        # allow_credentials=True,
    )
)
def add_to_waitlist(req: https_fn.Request) -> https_fn.Response:

    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405,
            mimetype="application/json"        
        )

    try:
        data = req.get_json(silent=True)
        if not data or "email" not in data:
            return https_fn.Response(
                json.dumps({"error": "Missing 'email' in JSON body"}),
                status=400,
                mimetype="application/json"
            )

        email = data["email"]
        result, status_code = process_waitlist_signup(db, email)

        return https_fn.Response(
            json.dumps(result),
            status=status_code,
            mimetype="application/json",
            
        )
    except Exception as e:
        print(f"Error: {e}")
        return https_fn.Response(
            json.dumps({"error": "Internal server error"}),
            status=500,
            mimetype="application/json",
            
        )