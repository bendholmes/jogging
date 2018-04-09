from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from jogging.api.serializers.user import UserSerializer


class LoginView(APIView):
    def post(self, request, format=None):
        """
        Login the user.
        """
        user = authenticate(request, username=request.data['username'], password=request.data['password'])
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, format=None):
        """
        Logout the user.
        """
        logout(request)
        return Response(status=status.HTTP_200_OK)
