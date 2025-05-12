import logging

class RequestFilter(logging.Filter):
    """
    Injects request information into the LogRecord.
    Assumes that `record.request` was set by middleware.
    """
    def filter(self, record):
        req = getattr(record, 'request', None)
        if req is not None:
            record.userip      = req.META.get('REMOTE_ADDR', '-')
            record.user        = getattr(req.user, 'id', 'anonymous')
            record.sessionid   = req.COOKIES.get('sessionid', '') or req.headers.get('Authorization', '')
            record.method      = req.method
            record.path        = req.get_full_path()
            # status_code isn’t on the request, so we set it via middleware too:
            record.status_code = getattr(record, 'status_code', '-')
            record.base_url    = req.build_absolute_uri('/')[:-1]
            record.referer     = req.META.get('HTTP_REFERER', '-')
            record.user_agent  = req.META.get('HTTP_USER_AGENT', '-')
        else:
            # fill with placeholders if no request
            for attr in ('userip','user','sessionid','method',
                         'path','status_code','base_url','referer','user_agent'):
                setattr(record, attr, '-')
        return True
