from rest_framework.response import Response
from rest_framework.decorators import action

from jogging.api.views.base import BaseViewSet
from jogging.models.user import User
from jogging.api.serializers import UserSerializer


class UserViewSet(BaseViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @action(detail=False)
    def me(self, request, *args, **kwargs):
        """
        Simple endpoint for retrieving the currently logged in user.
        :return: Logged in user.
        """
        return Response(self.get_serializer(request.user).data)
