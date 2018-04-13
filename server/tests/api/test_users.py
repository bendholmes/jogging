import time

from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from jogging.models import User


class UserTests(APITestCase):
    def test_create_user(self):
        url = reverse('user-list')
        data = {
            'username': 'username',
            'password': 'password',
            'is_superuser': True,
            'is_staff': False
        }
        # ----------------------------------------------------------------------------------------------------
        response = self.client.post(url, data, format='json')
        # ----------------------------------------------------------------------------------------------------
        # Test the response is as expected
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(User.objects.count(), 1)

        # Test the user was created as expected
        user = User.objects.get()
        self.assertIsNotNone(user.id)
        self.assertEquals(user.username, 'username')
        self.assertEquals(user.is_superuser, True)
        self.assertEquals(user.is_staff, False)

        # Test the response data matches the crated user data
        self.assertEquals(response.data["id"], user.id)
        self.assertEquals(response.data["username"], user.username)
        self.assertEquals(response.data["is_superuser"], user.is_superuser)
        self.assertEquals(response.data["is_staff"], user.is_staff)
        self.assertEquals(response.data["date_joined"], time.mktime(user.date_joined.timetuple()))
        self.assertEquals(response.data["role"], "admin")

    def test_create_user_username_already_exists(self):
        self.fail()

    def test_create_user_no_username(self):
        self.fail()

    def test_create_user_no_password(self):
        self.fail()

    def test_create_user_malicious_input(self):
        self.fail()

    def test_create_user_with_unicode(self):
        self.fail()
