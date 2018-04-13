from datetime import datetime, timezone, timedelta

from django.urls import reverse

from rest_framework import status

from jogging.models import Jog, User
from tests.api.utils import AwesomeAPITestCase


class CreateJogTests(AwesomeAPITestCase):
    def test_create_jog(self):
        self._authenticate()
        # ----------------------------------------------------------------------------------------------------
        response = self._create_jog(owner=self.user)
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(Jog.objects.count(), 1)

        # Test the jog was created as expected
        jog = Jog.objects.get()
        self.assertIsNotNone(jog.id)
        self.assertEquals(jog.owner.username, self.user.username)
        self.assertEquals(jog.date, datetime(day=15, month=4, year=3000))
        self.assertEquals(jog.distance, 100)
        self.assertEquals(jog.time, timedelta(0, 5430))

        # Test the response data matches the created jog data
        self.assertEquals(response.data["id"], jog.id)
        self.assertEquals(response.data["owner"], jog.owner.username)
        self.assertEquals(response.data["distance"], jog.distance)
        self.assertEquals(response.data["time"], "0" + str(jog.time))

    def test_create_jog_for_other_user(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._create_jog(owner=User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(Jog.objects.get().owner, self.user)

    def test_create_jog_for_other_user_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._create_jog(owner=User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(Jog.objects.get().owner, self.user)

    def test_create_jog_for_other_user_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._create_jog(owner=User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(Jog.objects.get().owner, User.objects.get(username='other'))


class UpdateJogTests(AwesomeAPITestCase):
    def _update_jog(self, **kwargs):
        url = reverse('jog-detail', kwargs={'pk': kwargs.get('id')})
        return self.client.patch(url, kwargs, format='json')

    def test_update_jog(self):
        self._authenticate()
        jog = self._create_jog(owner=self.user)
        # ----------------------------------------------------------------------------------------------------
        response = self._update_jog(id=jog.data['id'], date=datetime(day=16, month=5, year=4000), distance=200, time="02:35:35")
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(Jog.objects.count(), 1)

        # Test the jog was updated as expected
        jog = Jog.objects.get()
        self.assertIsNotNone(jog.id)
        self.assertEquals(jog.owner.username, self.user.username)
        self.assertEquals(jog.date, datetime(day=16, month=5, year=4000))
        self.assertEquals(jog.distance, 200)
        self.assertEquals(jog.time, timedelta(0, 9335))

        # Test the response data matches the updated jog data
        self.assertEquals(response.data["id"], jog.id)
        self.assertEquals(response.data["owner"], jog.owner.username)
        self.assertEquals(response.data["distance"], jog.distance)
        self.assertEquals(response.data["time"], "0" + str(jog.time))

    def test_update_other_users_jog(self):
        self._authenticate()
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._update_jog(id=other_jog.id, distance=400)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_other_users_jog_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._update_jog(id=other_jog.id, distance=400)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_other_users_jog_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._update_jog(id=other_jog.id, distance=400, owner=self.user.username)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data['distance'], 400)
        self.assertEquals(response.data['owner'], self.user.username)


class GetJogTests(AwesomeAPITestCase):
    def _get_jogs(self):
        url = reverse('jog-list')
        return self.client.get(url, format='json')

    def _get_field(self, maybe_jog, field):
        return getattr(maybe_jog, field) if isinstance(maybe_jog, Jog) else maybe_jog[field]

    def _test_response_equals_jog(self, data, jog):
        self.assertEquals(data['id'], self._get_field(jog, 'id'))
        self.assertEquals(data['owner'], self._get_field(jog, 'owner'))
        self.assertEquals(data['date'], self._get_field(jog, 'date'))
        self.assertEquals(data['distance'], self._get_field(jog, 'distance'))
        self.assertEquals(data['time'], self._get_field(jog, 'time'))

    def test_get_jogs(self):
        self._authenticate()
        jog = self._create_jog(self.user)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._get_jogs()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 1)
        self._test_response_equals_jog(response.data[0], jog.data)

    def test_get_jogs_as_manager(self):
        self._authenticate(is_staff=True)
        jog = self._create_jog(self.user)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._get_jogs()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 1)
        self._test_response_equals_jog(response.data[0], jog.data)

    def test_get_jogs_as_admin(self):
        self._authenticate(is_superuser=True)
        jog = self._create_jog(self.user)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._get_jogs()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 2)


class DeleteJogTests(AwesomeAPITestCase):
    def _delete_jog(self, **kwargs):
        url = reverse('jog-detail', kwargs={'pk': kwargs.get('id')})
        return self.client.delete(url, kwargs, format='json')

    def test_delete_jog(self):
        self._authenticate()
        jog = self._create_jog(self.user)
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_jog(id=jog.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEquals(Jog.objects.count(), 0)

    def test_delete_other_jog(self):
        self._authenticate()
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_jog(id=other_jog.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEquals(Jog.objects.count(), 1)

    def test_delete_other_jog_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_jog(id=other_jog.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEquals(Jog.objects.count(), 1)

    def test_delete_other_user_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        other_jog = self._force_create_jog(User.objects.get(username='other'))
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_jog(id=other_jog.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEquals(Jog.objects.count(), 0)
