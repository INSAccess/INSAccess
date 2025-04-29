from rest_framework import permissions
from .models import AssociationPublisher

class IsAssociationPublisher(permissions.BasePermission):
    message = 'Adding insa_event is not allowed if the user is not a assos publisher.'

    def has_permission(self, request, view):
         return AssociationPublisher.objects.filter(user = request.user).exists()