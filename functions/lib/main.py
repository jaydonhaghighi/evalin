# main.py
import json
import os
from dotenv import load_dotenv
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore

# Import logic
from handle_waitlist_email import process_waitlist_signup

# Avoid scanning parent directories during deploy analysis.
# If you want dotenv for local emulators, place it next to this file at functions/lib/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

_db: firestore.Client | None = None


def _get_db() -> firestore.Client:
    """
    Lazy init: Firebase CLI imports user code during deploy analysis.
    Creating clients at import-time can hang/fail and cause "User code failed to load".
    """
    global _db
    if _db is None:
        initialize_app()
        database_id = (os.environ.get("FIRESTORE_DATABASE_ID") or "evalin").strip()
        _db = firestore.client(database_id=database_id)
    return _db

@https_fn.on_request(
    memory=256,
    timeout_sec=60,
    # CORS configuration
    cors=options.CorsOptions(
        cors_origins=[
            r"http://localhost:3000",         
            r"http://localhost:5173",
            r"http://localhost:8080",
            # Firebase Hosting (prod + preview channels)
            r"https://.*\.web\.app",
            r"https://.*\.firebaseapp\.com",
        ],
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
        result, status_code = process_waitlist_signup(_get_db(), email)

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


@https_fn.on_request(
    memory=256,
    timeout_sec=60,
    cors=options.CorsOptions(
        cors_origins=[
            r"http://localhost:3000",
            r"http://localhost:5173",
            r"http://localhost:8080",
            # Firebase Hosting (prod + preview channels)
            r"https://.*\.web\.app",
            r"https://.*\.firebaseapp\.com",
        ],
        cors_methods=["POST", "OPTIONS"],
    ),
)
def add_to_waitlist_v2(req: https_fn.Request) -> https_fn.Response:
    """
    New endpoint (kept separate from add_to_waitlist):
    - POST { "email": "user@example.com" }
    - Returns { message, email } or { error }
    """
    if req.method == "OPTIONS":
        # CORS preflight is handled by the decorator, but returning an empty 204 is safe.
        return https_fn.Response("", status=204)

    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405,
            mimetype="application/json",
        )

    try:
        data = req.get_json(silent=True) or {}
        email = data.get("email")
        if not isinstance(email, str) or not email.strip():
            return https_fn.Response(
                json.dumps({"error": "Missing 'email' in JSON body"}),
                status=400,
                mimetype="application/json",
            )

        result, status_code = process_waitlist_signup(_get_db(), email)
        return https_fn.Response(
            json.dumps(result),
            status=status_code,
            mimetype="application/json",
        )
    except Exception as e:
        print(f"Error in add_to_waitlist_v2: {e}")
        return https_fn.Response(
            json.dumps({"error": "Internal server error"}),
            status=500,
            mimetype="application/json",
        )