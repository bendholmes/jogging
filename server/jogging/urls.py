from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path

from rest_framework import routers

from jogging.api.views import LoginView, LogoutView, JogViewSet, UserViewSet


# Base Django URLs
urlpatterns = [
    path('admin/', admin.site.urls)
]

# DRF URLs
urlpatterns += [url(r'^api-auth/', include('rest_framework.urls'))]

# App URLs
router = routers.SimpleRouter()
router.register(r'api/jog', JogViewSet)
router.register(r'api/user', UserViewSet)
urlpatterns += router.urls

urlpatterns += [url(r'^api/login/$', LoginView.as_view())]
urlpatterns += [url(r'^api/logout/$', LogoutView.as_view())]
