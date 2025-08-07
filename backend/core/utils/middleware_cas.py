import logging

logger = logging.getLogger(__name__)

class CASDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'ticket' in request.GET:
            logger.info(f"CAS Ticket reçu : {request.GET.get('ticket')}")
            logger.info(f"Service URL : {request.GET.get('service', 'N/A')}")
            logger.info(f"Full URL : {request.build_absolute_uri()}")

        if 'error' in request.GET:
            logger.error(f"Erreur CAS : {request.GET.get('error')}")
        
        response = self.get_response(request)
        return response