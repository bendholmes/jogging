from django.db.models import Sum
from django.db.models.functions import TruncWeek

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from jogging.api.views.base import BaseViewSet
from jogging.models import Jog
from jogging.api.serializers import JogSerializer, AdminJogSerializer, JogReportSerializer


class JogViewSet(BaseViewSet):
    serializer_class = JogSerializer
    queryset = Jog.objects.all()

    def get_queryset(self):
        """
        Filter the queryset to only include jogs for the authenticated user unless they are a superuser.
        :return: Filtered queryset.
        """
        qs = super(JogViewSet, self).get_queryset()
        if not self.request.user.is_superuser:
            qs = qs.filter(owner=self.request.user)
        return qs

    def get_serializer_class(self):
        return AdminJogSerializer if self.request.user.is_superuser else JogSerializer


class JogReport(APIView):
    """
    Groups all jogs for the requesting user by week and provides an average distance
    and time for each.
    """
    def get(self, request, format=None):
        qs = Jog.objects.filter(owner=request.user).annotate(
            week=TruncWeek('date')
        ).values('week').annotate(
            distance=Sum('distance'),
            time=Sum('time')
        )

        return Response(
            JogReportSerializer(qs, many=True).data,
            status=status.HTTP_200_OK
        )
