from django.db import models
from django.db.models import fields

from jogging.models.permissions import BasePermissions
from jogging.utils import calculate_speed


class Jog(BasePermissions, models.Model):
    owner = models.ForeignKey('User', on_delete=models.CASCADE)
    date = fields.DateTimeField(null=False, blank=False)
    distance = fields.IntegerField(null=False, blank=False)
    time = fields.DurationField(null=False, blank=False)

    @property
    def average_speed(self):
        """
        Calculates the average speed of the jog.
        :return: The average speed.
        """
        return calculate_speed(self.distance, self.time)
