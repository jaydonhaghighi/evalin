# main.py
import json
import os
from dotenv import load_dotenv
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from handle_waitlist_email import process_waitlist_signup

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

_db: firestore.Client | None = None

_CORS = options.CorsOptions(
    cors_origins=[
        r"http://localhost:5173",
        r"http://localhost:8080",
        r"https://evalin.io",
        r"https://www.evalin.io",
    ],
    cors_methods=["POST", "OPTIONS"],
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

    # CORS configuration
    cors=_CORS
)
def add_to_waitlist(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return https_fn.Response("", status=204)

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
        meta = data.get("meta") if isinstance(data, dict) else None
        result, status_code = process_waitlist_signup(_get_db(), email, meta)

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
    invoker="public",
    cors=_CORS,
)
def submit_waitlist_survey(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return https_fn.Response("", status=204)

    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405,
            mimetype="application/json",
        )

    try:
        data = req.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        survey = data.get("survey")

        if not email or "@" not in email:
            return https_fn.Response(
                json.dumps({"error": "Valid 'email' is required"}),
                status=400,
                mimetype="application/json",
            )

        if not isinstance(survey, dict):
            return https_fn.Response(
                json.dumps({"error": "Missing or invalid 'survey' object"}),
                status=400,
                mimetype="application/json",
            )

        db = _get_db()
        doc_ref = db.collection("waitlist").document(email)
        doc_ref.set(
            {
                "survey": survey,
                "survey_submitted_at": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )

        return https_fn.Response(
            json.dumps({"message": "Survey saved"}),
            status=200,
            mimetype="application/json",
        )
    except Exception as e:
        print(f"Error: {e}")
        return https_fn.Response(
            json.dumps({"error": "Internal server error"}),
            status=500,
            mimetype="application/json",
        )