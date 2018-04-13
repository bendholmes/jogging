import time

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from jogging.models import User


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


class CreateUserTests(AwesomeAPITestCase):
    def test_create_user(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user()
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(User.objects.count(), 1)

        # Test the user was created as expected
        user = User.objects.get()
        self.assertIsNotNone(user.id)
        self.assertEquals(user.username, 'username')
        self.assertEquals(user.is_superuser, False)
        self.assertEquals(user.is_staff, False)

        # Test the response data matches the crated user data
        self.assertEquals(response.data["id"], user.id)
        self.assertEquals(response.data["username"], user.username)
        self.assertEquals(response.data["is_superuser"], user.is_superuser)
        self.assertEquals(response.data["is_staff"], user.is_staff)
        self.assertEquals(response.data["date_joined"], time.mktime(user.date_joined.timetuple()))
        self.assertEquals(response.data["role"], "user")

    def test_create_manager(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(is_staff=True)
        # ----------------------------------------------------------------------------------------------------
        user = User.objects.get()
        self.assertEquals(user.is_superuser, False)
        self.assertEquals(user.is_staff, True)
        self.assertEquals(response.data["role"], "manager")

    def test_create_admin(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(is_superuser=True)
        # ----------------------------------------------------------------------------------------------------
        user = User.objects.get()
        self.assertEquals(user.is_superuser, True)
        self.assertEquals(user.is_staff, False)
        self.assertEquals(response.data["role"], "admin")

    def test_create_user_username_already_exists(self):
        self._create_user()
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(User.objects.count(), 1)

    def test_create_user_no_username(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(username='')
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(User.objects.count(), 0)

    def test_create_user_no_password(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(password='')
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(User.objects.count(), 0)

    def test_create_user_malicious_input(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(username="<b>XSSed!</b>")
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get()
        self.assertEquals(user.username, "&lt;b&gt;XSSed!&lt;/b&gt;")
        self.assertEquals(response.data["username"], "&lt;b&gt;XSSed!&lt;/b&gt;")

    def test_create_user_with_unicode(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(username="😀 🦄🦄🦄 💖")
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get()
        self.assertEquals(user.username, "😀 🦄🦄🦄 💖")
        self.assertEquals(response.data["username"], "😀 🦄🦄🦄 💖")

    def test_create_user_invalid_permission_value(self):
        # ----------------------------------------------------------------------------------------------------
        response = self._create_user(is_superuser="yes please!")
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(User.objects.count(), 0)


class UpdateUserTests(AwesomeAPITestCase):
    def _update_user(self, **kwargs):
        url = reverse('user-detail', kwargs={'pk': kwargs.get('id')})
        return self.client.patch(url, kwargs, format='json')

    def test_update_user(self):
        self._authenticate()
        old_password = User.objects.get().password
        # ----------------------------------------------------------------------------------------------------
        response = self._update_user(username='new', password='new', is_superuser=True, is_staff=True, id=self.user.id)
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(User.objects.count(), 1)

        # Test the user was updated as expected
        user = User.objects.get()
        self.assertIsNotNone(user.id)
        self.assertEquals(user.username, 'new')
        self.assertNotEquals(old_password, user.password)
        self.assertEquals(user.is_superuser, True)
        self.assertEquals(user.is_staff, True)

        # Test the response data matches the crated user data
        self.assertEquals(response.data["id"], user.id)
        self.assertEquals(response.data["username"], user.username)
        self.assertEquals(response.data["is_superuser"], user.is_superuser)
        self.assertEquals(response.data["is_staff"], user.is_staff)
        self.assertEquals(response.data["date_joined"], time.mktime(user.date_joined.timetuple()))
        self.assertEquals(response.data["role"], "admin")

    def test_update_user_username_already_exists(self):
        self._authenticate()
        self._create_user(username='new')
        # ----------------------------------------------------------------------------------------------------
        response = self._update_user(username='new', id=self.user.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotEquals(User.objects.get(id=self.user.id).username, 'new')

    def test_update_other_user(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._update_user(username='other-new', id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEquals(User.objects.filter(username='other').count(), 1)

    def test_update_other_user_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._update_user(username='other-new', is_superuser=True, id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(User.objects.filter(username='other-new').count(), 1)
        self.assertEquals(User.objects.get(username='other-new').is_superuser, True)

    def test_update_other_user_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._update_user(username='other-new', is_staff=True, id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(User.objects.filter(username='other-new').count(), 1)
        self.assertEquals(User.objects.get(username='other-new').is_staff, True)


class GetUserTests(AwesomeAPITestCase):
    def _get_user(self, **kwargs):
        url = reverse('user-detail', kwargs={'pk': kwargs.get('id')})
        return self.client.get(url, kwargs, format='json')

    def _get_users(self):
        url = reverse('user-list')
        return self.client.get(url, format='json')

    def _get_field(self, maybe_user, field):
        return getattr(maybe_user, field) if isinstance(maybe_user, User) else maybe_user[field]

    def _test_response_equals_user(self, data, user):
        self.assertEquals(data['id'], self._get_field(user, 'id'))
        self.assertEquals(data['username'], self._get_field(user, 'username'))
        self.assertEquals(data['role'], self._get_field(user, 'role'))
        self.assertEquals(data['is_superuser'], self._get_field(user, 'is_superuser'))
        self.assertEquals(data['is_staff'], self._get_field(user, 'is_staff'))
        self.assertEquals(
            data['date_joined'],
            time.mktime(user.date_joined.timetuple()) if isinstance(user, User) else data['date_joined']
        )

    def test_get_user(self):
        self._authenticate()
        # ----------------------------------------------------------------------------------------------------
        response = self._get_user(id=self.user.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self._test_response_equals_user(response.data, self.user)

    def test_get_all_users(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_users()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 1)
        self._test_response_equals_user(response.data[0], self.user)

    def test_get_me(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self.client.get(reverse('user-me'), format='json')
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self._test_response_equals_user(response.data, self.user)

    def test_get_other_user(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_other_user_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self._test_response_equals_user(response.data, other.data)

    def test_get_all_users_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_users()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 2)
        self._test_response_equals_user(response.data[0], other.data)
        self._test_response_equals_user(response.data[1], self.user)

    def test_get_other_user_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self._test_response_equals_user(response.data, other.data)

    def test_get_all_users_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._get_users()
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(response.data), 2)
        self._test_response_equals_user(response.data[0], other.data)
        self._test_response_equals_user(response.data[1], self.user)


class DeleteUserTests(AwesomeAPITestCase):
    def _delete_user(self, **kwargs):
        url = reverse('user-detail', kwargs={'pk': kwargs.get('id')})
        return self.client.delete(url, kwargs, format='json')

    def test_delete_user(self):
        self._authenticate()
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_user(id=self.user.id)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEquals(User.objects.filter(username='other').count(), 0)

    def test_delete_other_user(self):
        self._authenticate()
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEquals(User.objects.filter(username='other').count(), 1)

    def test_delete_other_user_as_manager(self):
        self._authenticate(is_staff=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEquals(User.objects.filter(username='other').count(), 0)

    def test_delete_other_user_as_admin(self):
        self._authenticate(is_superuser=True)
        other = self._create_user(username='other')
        # ----------------------------------------------------------------------------------------------------
        response = self._delete_user(id=other.data['id'])
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEquals(User.objects.filter(username='other').count(), 0)
