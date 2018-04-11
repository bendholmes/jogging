# HACK: django_filters doesn't seem compatible with the nightly build of Django, so monkey patch this missing constant
from django.db.models.sql import constants
constants.QUERY_TERMS = ""

from django_filters import rest_framework as filters
from django_filters import DateFromToRangeFilter

from jogging.models import Jog


class JogFilter(filters.FilterSet):
    """
    Simple date range filter for jog entries.
    """
    date = DateFromToRangeFilter()

    class Meta:
        model = Jog
        fields = ('date',)
