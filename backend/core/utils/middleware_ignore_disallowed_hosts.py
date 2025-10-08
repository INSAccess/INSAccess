from django.core.exceptions import DisallowedHost


class IgnoreDisallowedHostMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except DisallowedHost:
            # Return 400 Bad Request instead of sending email
            from django.http import HttpResponseBadRequest

            return HttpResponseBadRequest("Bad Request")
        return response
