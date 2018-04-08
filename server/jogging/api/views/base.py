from rest_framework.viewsets import ModelViewSet
from dry_rest_permissions.generics import DRYPermissions


class BaseViewSet(ModelViewSet):
    permission_classes = (DRYPermissions,)
