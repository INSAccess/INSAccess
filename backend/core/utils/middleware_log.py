import logging

class RequestLogMiddleware:
    """
    Attaches the request (and later status_code) to every LogRecord
    emitted during this request/response cycle.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger('')  # root logger

    def __call__(self, request):
        # Before view
        response = self.get_response(request)
        # After view: attach status_code on all pending records
        for handler in self.logger.handlers:
            # Monkey‐patch the handler’s emit so that it stamps status_code
            original_emit = handler.emit
            def emit_with_status(record, orig=original_emit):
                record.status_code = response.status_code
                orig(record)
            handler.emit = emit_with_status

        # Also attach request to the logger so RequestFilter can see it
        logging.LoggerAdapter(self.logger, {'request': request})
        return response
