import logging
import hashlib


import hashlib
import logging

class RequestFilter(logging.Filter):
    """
    Injects request information into the LogRecord.
    Assumes that `record.request` was set by middleware.
    """
    def filter(self, record):
        req = getattr(record, 'request', None)
        if req is not None:
            xff = req.META.get("HTTP_X_FORWARDED_FOR")
            if xff:
                record.userip = xff.split(",")[0].strip()
            else:
                record.userip = req.META.get("REMOTE_ADDR", "-")

            if hasattr(req, "user"):
                record.user = getattr(req.user, "id", "anonymous")
            else:
                record.user = "unknown"

            raw_session = req.COOKIES.get("sessionid") or req.headers.get("Authorization", "")
            if raw_session:
                record.sessionid = hashlib.sha256(raw_session.encode()).hexdigest()[:8]
            else:
                record.sessionid = "-"

            record.method      = getattr(req, "method", "-")
            record.path        = req.get_full_path() if hasattr(req, "get_full_path") else "-"
            record.status_code = getattr(record, "status_code", "-")
            try:
                record.base_url = req.build_absolute_uri("/")[:-1]
            except Exception:
                record.base_url = "-"
            record.referer     = req.META.get("HTTP_REFERER", "-")
            record.user_agent  = req.META.get("HTTP_USER_AGENT", "-")
        else:
            for attr in (
                "userip", "user", "sessionid", "method",
                "path", "status_code", "base_url", "referer", "user_agent"
            ):
                setattr(record, attr, "-")

        return True
