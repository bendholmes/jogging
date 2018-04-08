from django.contrib.auth.models import AbstractUser

from jogging.models.permissions import UserPermissions


class User(UserPermissions, AbstractUser):
    pass
