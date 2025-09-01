import logging
import hashlib


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
            record.user        = getattr(req.user, 'id', 'anonymous')
            raw_session = req.COOKIES.get("sessionid") or req.headers.get("Authorization", "")
            if raw_session:
                record.sessionid = hashlib.sha256(raw_session.encode()).hexdigest()[:8]
            else:
                record.sessionid = "-"
            record.method      = req.method
            record.path        = req.get_full_path()
            record.status_code = getattr(record, 'status_code', '-')
            record.base_url    = req.build_absolute_uri('/')[:-1]
            record.referer     = req.META.get('HTTP_REFERER', '-')
            record.user_agent  = req.META.get('HTTP_USER_AGENT', '-')
        else:
            for attr in ('userip','user','sessionid','method',
                         'path','status_code','base_url','referer','user_agent'):
                setattr(record, attr, '-')
        return True
