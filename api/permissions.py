from rest_framework import permissions


class IsTeamAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.admins.filter(pk=request.user.pk).exists()

class IsPageAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.team.admins.filter(pk=request.user.pk).exists()

class IsGraphAdmin(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return obj.page.team.admins.filter(pk=request.user.pk).exists()

class IsDataArrayAdmin(permissions.BasePermission):
        
        def has_object_permission(self, request, view, obj):
            return obj.graph.page.team.admins.filter(pk=request.user.pk).exists()
        
class IsDataPointAdmin(permissions.BasePermission):
        
        def has_object_permission(self, request, view, obj):
            return obj.data_array.graph.page.team.admins.filter(pk=request.user.pk).exists()