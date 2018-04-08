from jogging.api.views.base import BaseViewSet
from jogging.models.user import User
from jogging.api.serializers import UserSerializer


class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
