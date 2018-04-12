import time

from django.contrib.auth.hashers import make_password

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from jogging.api.serializers.fields import SafeCharField
from jogging.models import User


class BaseUserSerializer(serializers.ModelSerializer):
    username = SafeCharField(max_length=255)
    password = SafeCharField(max_length=255, write_only=True)  # Write only so we don't include passwords in the API!

    class Meta:
        model = User
        fields = ('username', 'password',)


class UserSerializer(BaseUserSerializer):
    role = serializers.SerializerMethodField()
    is_superuser = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)
    date_joined = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ('role', 'is_superuser', 'is_staff', 'date_joined',)

    def save(self):
        """
        Override save to check if we're modifying the username. If we are, we need to check that there isn't
        another user with the same username. Raises a ValidationError if that is the case.
        :return: Saved instance.
        """
        username = self.validated_data.get("username")
        if username:
            # If we are updating then ignore if the username is the same (i.e. it's not changing)
            if not self.instance or self.instance.username != username:
                if User.objects.filter(username=username).exists():
                    raise ValidationError("A user already exists with the username {username}".format(username=username))
        return super(UserSerializer, self).save()

    def validate_password(self, value):
        return make_password(value)

    def get_role(self, user):
        # TODO: Use Django roles instead
        if user.is_superuser:
            return 'admin'
        elif user.is_staff:
            return 'manager'
        return 'user'

    def get_date_joined(self, user):
        """
        Gets the date the user joined as a timestamp. Used by the web app to maintain a sorted list
        of users after creating new ones.
        :param user: The user object.
        :return: Timestamp of when the user was created.
        """
        return time.mktime(user.date_joined.timetuple())
