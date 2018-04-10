from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from jogging.api.views.base import BaseViewSet
from jogging.models.user import User
from jogging.api.serializers import UserSerializer


class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        """
        Hook into the creation method to check if this user already exists and raise an appropriate
        response if so.
        :param serializer: User serializer.
        """
        username = serializer.validated_data["username"]
        if User.objects.filter(username=username).exists():
            raise ValidationError("A user already exists with the username {username}".format(username=username))
        serializer.save()

    @action(detail=False)
    def me(self, request, *args, **kwargs):
        """
        Simple endpoint for retrieving the currently logged in user.
        :return: Logged in user.
        """
        return Response(self.get_serializer(request.user).data)
