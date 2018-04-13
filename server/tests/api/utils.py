from datetime import datetime, timedelta

from django.urls import reverse

from rest_framework.test import APITestCase

from jogging.models import Jog, User


class AwesomeAPITestCase(APITestCase):
    def _create_user(self, username='username', password='password', is_superuser=False, is_staff=False):
        url = reverse('user-list')
        data = {
            'username': username,
            'password': password,
            'is_superuser': is_superuser,
            'is_staff': is_staff
        }
        return self.client.post(url, data, format='json')

    def _authenticate(self, **kwargs):
        new_user_data = self._create_user(**kwargs).data
        self.user = User.objects.get(id=new_user_data['id'])
        self.client.login(username=self.user.username, password=kwargs.get('password', 'password'))

    def _create_jog(self, owner, date=datetime(day=15, month=4, year=3000), distance=100,
                    time=timedelta(hours=1, minutes=30, seconds=30)):
        owner = owner if owner else self.user
        url = reverse('jog-list')
        data = {
            'owner': owner.username,
            'date': date,
            'distance': distance,
            'time': time
        }
        return self.client.post(url, data, format='json')

    def _force_create_jog(self, owner, date=datetime(day=15, month=4, year=3000), distance=100,
                          time=timedelta(hours=1, minutes=30, seconds=30)):
        return Jog.objects.create(
            owner=owner,
            date=date,
            distance=distance,
            time=time
        )
