import hmac
import hashlib
import base64
import json
import time
import secrets
from typing import Dict, Any, Optional

from server.config import JWT_SECRET


def b64url_encode(data: bytes) -> str:
    """Encode bytes using base64url without trailing padding '='."""
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def b64url_decode(s: str) -> bytes:
    """Decode base64url string with reinstated '=' padding."""
    padding = "=" * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode(s + padding)


class JWTService:
    def __init__(self, secret: str = JWT_SECRET):
        self.secret = secret

    def create_token(
        self,
        user_id: str,
        email: str,
        full_name: str,
        days_valid: int = 30,
    ) -> str:
        """Create a cryptographically signed HMAC-SHA256 JWT token."""
        header = {"alg": "HS256", "typ": "JWT"}
        now = int(time.time())
        exp = now + (days_valid * 86400)

        payload = {
            "jti": secrets.token_hex(16),
            "sub": user_id,
            "email": email,
            "name": full_name,
            "iat": now,
            "exp": exp,
        }

        h_str = b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
        p_str = b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
        message = f"{h_str}.{p_str}".encode("utf-8")

        signature = hmac.new(self.secret.encode("utf-8"), message, hashlib.sha256).digest()
        s_str = b64url_encode(signature)

        return f"{h_str}.{p_str}.{s_str}"

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT signature, expiry, and return the payload or None."""
        if not token:
            return None

        clean_token = token.replace("Bearer ", "").strip()
        parts = clean_token.split(".")
        if len(parts) != 3:
            return None

        h_str, p_str, s_str = parts

        try:
            message = f"{h_str}.{p_str}".encode("utf-8")
            expected_sig = hmac.new(self.secret.encode("utf-8"), message, hashlib.sha256).digest()
            expected_s_str = b64url_encode(expected_sig)

            if not hmac.compare_digest(expected_s_str, s_str):
                return None

            payload = json.loads(b64url_decode(p_str).decode("utf-8"))
            now = int(time.time())

            if payload.get("exp", 0) < now:
                return None  # Token expired

            return payload
        except Exception:
            return None


jwt_service = JWTService()
