from rest_framework import serializers

from jogging.models import Jog
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
        return "{0:.2f} distance per hour".format(obj.average_speed)


class AdminJogSerializer(JogSerializer):
    owner_id = serializers.IntegerField(write_only=True, required=False)

    class Meta(JogSerializer.Meta):
        fields = JogSerializer.Meta.fields + ('owner_id',)

    def create(self, validated_data):
        """
        Override create to only set the owner field if it's not been provided.
        :param validated_data: The validated serializer data.
        :return: Jog object with owner saved.
        """
        if "owner_id" in validated_data:
            return super(JogSerializer, self).create(validated_data)
        return super(AdminJogSerializer, self).create(validated_data)


class JogReportSerializer(serializers.Serializer):
    week = serializers.DateTimeField()
    distance = serializers.IntegerField()
    average_speed = serializers.SerializerMethodField()

    class Meta:
        fields = ('week', 'average_speed', 'distance',)

    def get_average_speed(self, obj):
        """
        Gets the average speed to two decimal places.
        :param obj: Jog report being serialized.
        :return: Average speed to two decimal places.
        """
        return "{0:.2f} distance per hour".format(
            calculate_speed(obj['distance'], timedelta_to_time(obj['time']))
        )
