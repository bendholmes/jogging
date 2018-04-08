from dry_rest_permissions.generics import authenticated_users, allow_staff_or_superuser


def is_owner(user, obj):
    """
    Determines if the given user is the owner of the given object.

    :param user: The user to check for being the owner.
    :param obj: The object to check for ownership.
    :return: Boolean.
    """
    try:
        return obj.owner == user
    except AttributeError:
        # No owner field means this must be a user model
        return obj == user


class BasePermissions(object):
    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return True

    @authenticated_users
    def has_object_read_permission(self, request):
        return request.user.is_superuser or is_owner(request.user, self)

    @staticmethod
    @authenticated_users
    def has_write_permission(request):
        return True

    @authenticated_users
    def has_object_write_permission(self, request):
        return request.user.is_superuser or is_owner(request.user, self)

    @staticmethod
    @authenticated_users
    def has_create_permission(request):
        return True

    @staticmethod
    @authenticated_users
    def has_delete_permission(request):
        return True

    @authenticated_users
    def has_object_delete_permission(self, request):
        return request.user.is_superuser or is_owner(request.user, self)


class UserPermissions(object):
    @staticmethod
    @authenticated_users
    @allow_staff_or_superuser
    def has_read_permission(request):
        return False

    @allow_staff_or_superuser
    @authenticated_users
    def has_object_read_permission(self, request):
        return is_owner(request.user, self)

    @staticmethod
    @authenticated_users
    def has_write_permission(request):
        return True

    @allow_staff_or_superuser
    @authenticated_users
    def has_object_write_permission(self, request):
        return is_owner(request.user, self)

    @staticmethod
    def has_create_permission(request):
        return True

    @staticmethod
    @authenticated_users
    def has_delete_permission(request):
        return True

    @allow_staff_or_superuser
    @authenticated_users
    def has_object_delete_permission(self, request):
        return is_owner(request.user, self)
