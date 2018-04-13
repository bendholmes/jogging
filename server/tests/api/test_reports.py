from datetime import datetime, timezone, timedelta

from django.urls import reverse

from rest_framework import status

from jogging.models import Jog, User
from tests.api.utils import AwesomeAPITestCase


class JogReportTests(AwesomeAPITestCase):
    def test_jog_report(self):
        self._authenticate()
        week1_jog = self._create_jog(
            owner=self.user,
            date=datetime(day=1, month=1, year=1000)
        )
        week1_jog2 = self._create_jog(
            owner=self.user,
            date=datetime(day=2, month=1, year=1000),
            distance=200,
            time=timedelta(hours=1, minutes=20)
        )
        week2_jog = self._create_jog(
            owner=self.user,
            date=datetime(day=1, month=1, year=2000)
        )
        week3_jog = self._create_jog(
            owner=self.user,
            date=datetime(day=1, month=1, year=3000),
            distance=500,
            time=timedelta(hours=3, minutes=20)
        )

        other = self._create_user(username='other')
        other_jog = self._force_create_jog(
            owner=User.objects.get(username='other'),
            date=datetime(day=1, month=1, year=5000)
        )
        # ----------------------------------------------------------------------------------------------------
        response = self.client.get('/api/report/', format='json')
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 3)

        first_week = response.data[2]
        self.assertEquals(first_week["total_jogs"], 2)
        self.assertEquals(first_week["average_distance"], 150)
        self.assertEquals(first_week["average_speed"], 105.57)

        second_week = response.data[1]
        self.assertEquals(second_week["total_jogs"], 1)
        self.assertEquals(second_week["average_distance"], 100)
        self.assertEquals(second_week["average_speed"], 66.3)

        third_week = response.data[0]
        self.assertEquals(third_week["total_jogs"], 1)
        self.assertEquals(third_week["average_distance"], 500)
        self.assertEquals(third_week["average_speed"], 150)
