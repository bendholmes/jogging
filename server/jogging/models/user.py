from django.contrib.auth.models import AbstractUser

from jogging.models.permissions import UserPermissions


class User(UserPermissions, AbstractUser):
    @property
    def role(self):
        # TODO: Use Django roles instead (i.e. ABAC)
        if self.is_superuser:
            return 'admin'
        elif self.is_staff:
            return 'manager'
        return 'user'
