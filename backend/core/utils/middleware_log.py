import logging
import threading
from typing import Optional

_request_local = threading.local()
_MAX_UA_LEN = 30  # keep logs compact


def _safe_truncate(s: Optional[str], max_len: int = _MAX_UA_LEN) -> Optional[str]:
    if not s:
        return None
    s = s.replace("\n", " ").replace("\r", " ")
    return s[:max_len]


class RequestLogFilter(logging.Filter):
    """
    Adds request context to LogRecord. Always provides safe defaults so
    formatting never fails outside a request.
    """

    def filter(self, record):
        # status_code removed on purpose
        record.path = getattr(_request_local, "path", None)
        record.method = getattr(_request_local, "method", None)

        user = getattr(_request_local, "user", None)
        if user is None:
            record.user_username = "anonymous"
            record.user_id = None
        else:
            record.user_username = getattr(user, "username", str(user)) or "anonymous"
            record.user_id = getattr(user, "id", None)

        ua = getattr(_request_local, "user_agent", None)
        record.user_agent = ua if ua is not None else None
        record.user_ip = getattr(_request_local, "user_ip", None)

        return True


class RequestLogMiddleware:
    """
    Store request context on thread-local for the RequestLogFilter.
    """

    def __init__(self, get_response):
        self.get_response = get_response

        root_logger = logging.getLogger()
        if not getattr(root_logger, "_request_log_filter_installed", False):
            root_logger.addFilter(RequestLogFilter())
            root_logger._request_log_filter_installed = True

    def __call__(self, request):
        _request_local.path = getattr(request, "path", None)
        _request_local.method = getattr(request, "method", None)
        _request_local.user = getattr(request, "user", None)

        ua = request.META.get("HTTP_USER_AGENT")
        _request_local.user_agent = _safe_truncate(ua)

        _request_local.user_ip = request.META.get("REMOTE_ADDR")

        try:
            response = self.get_response(request)
            return response
        finally:
            for attr in (
                "path",
                "method",
                "user",
                "user_agent",
                "user_ip",
            ):
                if hasattr(_request_local, attr):
                    delattr(_request_local, attr)
