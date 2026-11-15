import sqlite3
import os
import json
import uuid
import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List

from server.config import BASE_DIR
from server.services.jwt_service import jwt_service

DB_DIR = BASE_DIR / "server" / "data"
DB_PATH = DB_DIR / "alpha.db"


def hash_password(password: str, salt: str) -> str:
    """Hash a password using PBKDF2 HMAC SHA-256 with 100,000 iterations."""
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    ).hex()


class DatabaseService:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS sessions (
                    token TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    mode TEXT NOT NULL,
                    messages_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_conv_user_id ON conversations(user_id);
            """)

    # ---------------- USER AUTHENTICATION ---------------- #

    def create_user(self, email: str, password: str, full_name: str) -> Dict[str, Any]:
        clean_email = email.strip().lower()
        clean_name = full_name.strip()

        if not clean_email or "@" not in clean_email:
            raise ValueError("A valid email address is required.")
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        if not clean_name:
            raise ValueError("Full name is required.")

        user_id = "usr_" + uuid.uuid4().hex[:16]
        salt = secrets.token_hex(16)
        pwd_hash = hash_password(password, salt)
        created_at = datetime.now(timezone.utc).isoformat()

        with self._get_connection() as conn:
            # Check existing email
            cur = conn.execute("SELECT id FROM users WHERE email = ?", (clean_email,))
            if cur.fetchone():
                raise ValueError("An account with this email address already exists.")

            conn.execute(
                """
                INSERT INTO users (id, email, password_hash, salt, full_name, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (user_id, clean_email, pwd_hash, salt, clean_name, created_at),
            )

        return {
            "id": user_id,
            "email": clean_email,
            "full_name": clean_name,
            "created_at": created_at,
        }

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()

        with self._get_connection() as conn:
            cur = conn.execute(
                "SELECT id, email, password_hash, salt, full_name, created_at FROM users WHERE email = ?",
                (clean_email,),
            )
            row = cur.fetchone()
            if not row:
                return None

            expected_hash = hash_password(password, row["salt"])
            if not secrets.compare_digest(expected_hash, row["password_hash"]):
                return None

            return {
                "id": row["id"],
                "email": row["email"],
                "full_name": row["full_name"],
                "created_at": row["created_at"],
            }

    def create_session(
        self,
        user_id: str,
        email: str = "",
        full_name: str = "",
        days_valid: int = 30,
    ) -> str:
        token = jwt_service.create_token(
            user_id=user_id,
            email=email,
            full_name=full_name,
            days_valid=days_valid,
        )
        now = datetime.now(timezone.utc)
        expires_at = (now + timedelta(days=days_valid)).isoformat()
        created_at = now.isoformat()

        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO sessions (token, user_id, created_at, expires_at)
                VALUES (?, ?, ?, ?)
                """,
                (token, user_id, created_at, expires_at),
            )
        return token

    def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        if not token:
            return None

        clean_token = token.replace("Bearer ", "").strip()
        jwt_payload = jwt_service.verify_token(clean_token)
        user_id = jwt_payload.get("sub") if jwt_payload else None

        with self._get_connection() as conn:
            if user_id:
                # Ensure session wasn't logged out
                cur = conn.execute("SELECT user_id FROM sessions WHERE token = ?", (clean_token,))
                if not cur.fetchone():
                    return None

                cur_user = conn.execute(
                    "SELECT id, email, full_name, created_at FROM users WHERE id = ?",
                    (user_id,),
                )
                row = cur_user.fetchone()
                if row:
                    return {
                        "id": row["id"],
                        "email": row["email"],
                        "full_name": row["full_name"],
                        "created_at": row["created_at"],
                    }

            # Fallback direct session lookup
            now_iso = datetime.now(timezone.utc).isoformat()
            cur = conn.execute(
                """
                SELECT u.id, u.email, u.full_name, u.created_at, s.expires_at
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.token = ? AND s.expires_at > ?
                """,
                (clean_token, now_iso),
            )
            row = cur.fetchone()
            if not row:
                return None

            return {
                "id": row["id"],
                "email": row["email"],
                "full_name": row["full_name"],
                "created_at": row["created_at"],
            }

    def delete_session(self, token: str) -> bool:
        clean_token = token.replace("Bearer ", "").strip()
        with self._get_connection() as conn:
            cur = conn.execute("DELETE FROM sessions WHERE token = ?", (clean_token,))
            return cur.rowcount > 0

    # ---------------- USER CONVERSATIONS ---------------- #

    def get_user_conversations(self, user_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cur = conn.execute(
                """
                SELECT id, title, mode, messages_json, created_at, updated_at
                FROM conversations
                WHERE user_id = ?
                ORDER BY updated_at DESC
                """,
                (user_id,),
            )
            rows = cur.fetchall()

            result = []
            for row in rows:
                try:
                    msgs = json.loads(row["messages_json"])
                except Exception:
                    msgs = []
                result.append({
                    "id": row["id"],
                    "title": row["title"],
                    "mode": row["mode"],
                    "messages": msgs,
                    "createdAt": row["created_at"],
                    "updatedAt": row["updated_at"],
                })
            return result

    def save_user_conversation(self, user_id: str, conv: Dict[str, Any]) -> Dict[str, Any]:
        conv_id = conv.get("id") or ("conv_" + uuid.uuid4().hex[:12])
        title = conv.get("title") or "New Chat"
        mode = conv.get("mode") or "chat"
        messages = conv.get("messages") or []
        created_at = conv.get("createdAt") or datetime.now(timezone.utc).isoformat()
        updated_at = conv.get("updatedAt") or datetime.now(timezone.utc).isoformat()
        msgs_json = json.dumps(messages)

        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT INTO conversations (id, user_id, title, mode, messages_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title = excluded.title,
                    mode = excluded.mode,
                    messages_json = excluded.messages_json,
                    updated_at = excluded.updated_at
                WHERE user_id = excluded.user_id
                """,
                (conv_id, user_id, title, mode, msgs_json, created_at, updated_at),
            )

        return {
            "id": conv_id,
            "title": title,
            "mode": mode,
            "messages": messages,
            "createdAt": created_at,
            "updatedAt": updated_at,
        }

    def import_conversations(self, user_id: str, conversations: List[Dict[str, Any]]) -> int:
        """Import guest conversations into a user's account safely without duplicates."""
        if not conversations:
            return 0

        imported = 0
        with self._get_connection() as conn:
            for conv in conversations:
                conv_id = conv.get("id")
                if not conv_id:
                    continue

                # Check if conversation already exists for this user
                cur = conn.execute(
                    "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
                    (conv_id, user_id),
                )
                if cur.fetchone():
                    continue  # Already present, do not overwrite or duplicate

                title = conv.get("title") or "Transferred Chat"
                mode = conv.get("mode") or "chat"
                messages = conv.get("messages") or []
                created_at = conv.get("createdAt") or datetime.now(timezone.utc).isoformat()
                updated_at = conv.get("updatedAt") or datetime.now(timezone.utc).isoformat()
                msgs_json = json.dumps(messages)

                conn.execute(
                    """
                    INSERT INTO conversations (id, user_id, title, mode, messages_json, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO NOTHING
                    """,
                    (conv_id, user_id, title, mode, msgs_json, created_at, updated_at),
                )
                imported += 1

        return imported

    def delete_user_conversation(self, user_id: str, conv_id: str) -> bool:
        with self._get_connection() as conn:
            cur = conn.execute(
                "DELETE FROM conversations WHERE id = ? AND user_id = ?",
                (conv_id, user_id),
            )
            return cur.rowcount > 0

    def clear_user_conversations(self, user_id: str) -> int:
        with self._get_connection() as conn:
            cur = conn.execute(
                "DELETE FROM conversations WHERE user_id = ?",
                (user_id,),
            )
            return cur.rowcount


db_service = DatabaseService()
