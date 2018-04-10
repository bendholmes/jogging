from rest_framework import serializers

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
    is_superuser = serializers.BooleanField(write_only=True, required=False)
    is_staff = serializers.BooleanField(write_only=True, required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ('role', 'is_superuser', 'is_staff',)

    def create(self, validated_data):
        """
        Override create to properly encrypt the password given.
        :param validated_data: The validated serializer data.
        :return: User object with password set.
        """
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def get_role(self, user):
        # TODO: Use Django roles instead
        if user.is_superuser:
            return 'admin'
        elif user.is_staff:
            return 'manager'
        return 'user'
