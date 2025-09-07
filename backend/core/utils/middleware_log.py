import logging


class RequestLogMiddleware:
    """
    Attaches the request (and later status_code) to every LogRecord
    emitted during this request/response cycle.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger("")

    def __call__(self, request):
        response = self.get_response(request)
        for handler in self.logger.handlers:
            original_emit = handler.emit

            def emit_with_status(record, orig=original_emit):
                record.status_code = response.status_code
                orig(record)

            handler.emit = emit_with_status

        logging.LoggerAdapter(self.logger, {"request": request})
        return response
