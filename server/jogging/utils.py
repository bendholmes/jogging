import datetime

from jogging import constants


def time_to_hours(time):
    """
    Converts a given time into a float of the number of hours it represents, e.g. "02:34:12" => 2.57
    :param time: Time object.
    :return: Float hour value.
    """
    return time.hour + (time.minute / constants.MINUTES_IN_HOUR) + (time.second / constants.SECONDS_IN_HOUR)


def timedelta_to_hours(timedelta):
    """
    Converts a timedelta to a time object.
    :param timedelta: The timedelta to convert.
    :return: Time object.
    """
    hours, remainder = divmod(timedelta.seconds, constants.SECONDS_IN_HOUR)
    hours += timedelta.days * constants.HOURS_IN_DAY
    minutes, seconds = divmod(remainder, 60)
    return hours + (minutes / constants.MINUTES_IN_HOUR) + (seconds / constants.SECONDS_IN_HOUR)


def calculate_speed(distance, hours):
    """
    Calculates the speed as distance per hour, since it wasn't specified in the requirements what either of
    these units should be. This could easily be extended to support other units by using GIS distance fields
    on the jog model (https://docs.djangoproject.com/en/2.0/ref/contrib/gis/measure/#distance), but for now,
    YAGNI.
    :param distance: The unitless distance travelled.
    :param hours: The hours taken to travel said distance.
    :return: The distance per hour speed.
    """
    return distance / hours
