from datetime import timedelta
from unittest import TestCase

from jogging.utils import timedelta_to_hours, calculate_speed


class UtilTests(TestCase):
    def test_timedelta_to_hours(self):
        td = timedelta(days=5, hours=7, minutes=32, seconds=14)
        # ----------------------------------------------------------------------------------------------------
        result = timedelta_to_hours(td)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(result, 127.53722222222223)

    def test_timedelta_to_hours_obvious(self):
        td = timedelta(days=1, hours=1, minutes=30, seconds=0)
        # ----------------------------------------------------------------------------------------------------
        result = timedelta_to_hours(td)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(result, 25.5)

    def test_calculate_speed(self):
        td = timedelta(days=0, hours=2, minutes=30, seconds=14)
        # ----------------------------------------------------------------------------------------------------
        result = calculate_speed(225, td)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(result, 89.86021743953849)

    def test_calculate_speed_obvious(self):
        td = timedelta(days=0, hours=1, minutes=0, seconds=0)
        # ----------------------------------------------------------------------------------------------------
        result = calculate_speed(10, td)
        # ----------------------------------------------------------------------------------------------------
        self.assertEquals(result, 10)
