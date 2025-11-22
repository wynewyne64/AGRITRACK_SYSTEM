from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS

class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS to anyone
        if request.method in SAFE_METHODS:
            return True
        # Require authentication for other actions (POST, PUT, DELETE)
        return request.user and request.user.is_authenticated

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class FullDjangoModelPermissions(permissions.DjangoModelPermissions):
    def __init__(self):
        self.perms_map['GET']= ['%(app_label)s.view_%(model_name)s']