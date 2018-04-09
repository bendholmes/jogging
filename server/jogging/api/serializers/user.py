from rest_framework import serializers

from jogging.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=255, write_only=True)  # Write only so we don't include passwords in the API!
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'role', 'password',)

    def create(self, validated_data):
        """
        Override create to properly encrypt the password given.
        :param validated_data: The validated serializer data.
        :return: User object with password saved.
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
