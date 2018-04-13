from rest_framework import serializers

from jogging.models import Jog, User
from jogging.utils import timedelta_to_time, calculate_speed


class JogSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(read_only=True, slug_field='username')
    average_speed = serializers.SerializerMethodField()

    class Meta:
        model = Jog
        fields = ('id', 'owner', 'date', 'distance', 'time', 'average_speed',)

    def create(self, validated_data):
        """
        Override create to set the owner field.
        :param validated_data: The validated serializer data.
        :return: Jog object with owner saved.
        """
        validated_data["owner"] = self.context["request"].user
        jog = super(JogSerializer, self).create(validated_data)
        return jog

    def get_average_speed(self, obj):
        """
        Gets the average speed to two decimal places.
        :param obj: Jog being serialized.
        :return: Average speed to two decimal places.
        """
        return float("{0:.2f}".format(obj.average_speed))


class AdminJogSerializer(JogSerializer):
    owner = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all(), required=False)

    def create(self, validated_data):
        """
        Override create to only set the owner field if it's not been provided.
        :param validated_data: The validated serializer data.
        :return: Jog object with owner saved.
        """
        if "owner" in validated_data:
            return super(JogSerializer, self).create(validated_data)
        return super(AdminJogSerializer, self).create(validated_data)


class JogReportSerializer(serializers.Serializer):
    week = serializers.DateTimeField()
    average_distance = serializers.SerializerMethodField()
    average_speed = serializers.SerializerMethodField()

    class Meta:
        fields = ('week', 'average_speed', 'average_distance',)

    def get_average_speed(self, obj):
        """
        Gets the average speed to two decimal places.
        :param obj: Jog report being serialized.
        :return: Average speed to two decimal places.
        """
        return float("{0:.2f}".format(
            calculate_speed(obj['total_distance'], timedelta_to_time(obj['total_time']))
        ))

    def get_average_distance(self, obj):
        """
        Gets the average distance to two decimal places.
        :param obj: Jog report being serialized.
        :return: Average distance to two decimal places.
        """
        return float("{0:.2f}".format(obj['total_distance'] / obj['total_jogs']))
