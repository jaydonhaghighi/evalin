# main.py
import json
import os
from typing import Any
from dotenv import load_dotenv
from firebase_functions import https_fn
from firebase_functions.params import SecretParam
from firebase_admin import initialize_app, firestore
from handle_waitlist_email import process_waitlist_signup

_DOTENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(_DOTENV_PATH):
    # Only load local dev env if the file exists.
    # (Avoid parsing unrelated .env files during deploy analysis.)
    load_dotenv(dotenv_path=_DOTENV_PATH)

_db: firestore.Client | None = None

# Secrets (Google Secret Manager) bound to functions at deploy-time.
# These names must be UPPER_SNAKE_CASE.
SMTP_USER = SecretParam("SMTP_USER")
SMTP_PASSWORD = SecretParam("SMTP_PASSWORD")
SMTP_NOTIFY_TO = SecretParam("SMTP_NOTIFY_TO")

_ALLOWED_CORS_ORIGINS = {
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "https://evalin.io",
    "https://www.evalin.io",
}


def _cors_headers(req: https_fn.Request) -> dict[str, str]:
    """
    Ensure preflight (OPTIONS) and normal responses include CORS headers.
    Some runtimes won't add CORS headers to early-return OPTIONS responses.
    """
    origin = (req.headers.get("Origin") or "").strip()
    if origin not in _ALLOWED_CORS_ORIGINS:
        return {}

    requested_headers = (req.headers.get("Access-Control-Request-Headers") or "Content-Type").strip()
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": requested_headers,
        "Access-Control-Max-Age": "3600",
        "Vary": "Origin",
    }


def _options_response(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("", status=204, headers=_cors_headers(req))


def _json_response(req: https_fn.Request, payload: Any, *, status: int) -> https_fn.Response:
    return https_fn.Response(
        json.dumps(payload),
        status=status,
        mimetype="application/json",
        headers=_cors_headers(req),
    )


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
    invoker="public",
    secrets=[SMTP_USER, SMTP_PASSWORD, SMTP_NOTIFY_TO],
)
def add_to_waitlist(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return _options_response(req)

    if req.method != "POST":
        return _json_response(req, {"error": "Method not allowed"}, status=405)

    try:
        data = req.get_json(silent=True) or {}
        if not isinstance(data, dict):
            return _json_response(req, {"error": "Invalid JSON body"}, status=400)

        email = (data.get("email") or "").strip().lower()
        if not email:
            return _json_response(req, {"error": "Missing 'email' in JSON body"}, status=400)

        meta = data.get("meta")
        result, status_code = process_waitlist_signup(_get_db(), email, meta)

        return _json_response(req, result, status=status_code)

    except Exception as e:
        print(f"Error: {e}")
        return _json_response(req, {"error": "Internal server error"}, status=500)


@https_fn.on_request(
    memory=256,
    timeout_sec=60,
    invoker="public",
)
def submit_waitlist_survey(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return _options_response(req)

    if req.method != "POST":
        return _json_response(req, {"error": "Method not allowed"}, status=405)

    try:
        data = req.get_json(silent=True) or {}
        if not isinstance(data, dict):
            return _json_response(req, {"error": "Invalid JSON body"}, status=400)

        email = (data.get("email") or "").strip().lower()
        survey = data.get("survey")

        if not email or "@" not in email:
            return _json_response(req, {"error": "Valid 'email' is required"}, status=400)

        if not isinstance(survey, dict):
            return _json_response(req, {"error": "Missing or invalid 'survey' object"}, status=400)

        db = _get_db()
        doc_ref = db.collection("waitlist").document(email)
        doc_ref.set(
            {
                "survey": survey,
                "survey_submitted_at": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )

        return _json_response(req, {"message": "Survey saved"}, status=200)
    except Exception as e:
        print(f"Error: {e}")
        return _json_response(req, {"error": "Internal server error"}, status=500)