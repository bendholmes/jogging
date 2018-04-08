from jogging import constants


def time_to_hours(time):
    """
    Converts a given time into a float of the number of hours it represents, e.g. "02:34:12" => 2.57
    :param time: Time object.
    :return: Float hour value.
    """
    return time.hour + (time.minute / constants.MINUTES_IN_HOUR) + (time.second / constants.SECONDS_IN_HOUR)


def calculate_speed(distance, time):
    """
    Calculates the speed as distance per hour, since it wasn't specified in the requirements what either of
    these units should be. This could easily be extended to support other units by using GIS distance fields
    on the jog model (https://docs.djangoproject.com/en/2.0/ref/contrib/gis/measure/#distance), but for now,
    YAGNI.
    :param distance: The unitless distance travelled.
    :param time: The time taken to travel said distance.
    :return: The distance per hour speed.
    """
    return distance / time_to_hours(time)
