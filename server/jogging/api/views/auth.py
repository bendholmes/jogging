from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from jogging.api.serializers.user import BaseUserSerializer, UserSerializer


class LoginView(APIView):
    def post(self, request, format=None):
        """
        Login the user.
        """
        # Validate the login data
        serializer = BaseUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Try and authenticate them
        user = authenticate(
            request,
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if user is not None:
            # Set the cookies
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
