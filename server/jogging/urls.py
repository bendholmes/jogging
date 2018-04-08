from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path

from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from jogging.api.views import LoginView, LogoutView, JogViewSet, UserViewSet


# Base Django URLs
urlpatterns = [
    path('admin/', admin.site.urls)
]

# DRF URLs
urlpatterns += [url(r'^api-auth/', include('rest_framework.urls'))]
urlpatterns += [url(r'^obtain-auth-token/$', obtain_auth_token)]

# DRF URLs
router = routers.SimpleRouter()
#router.register(r'api/login', LoginView, base_name='login')
# router.register(r'api/logout', LogoutView, base_name='logout')
router.register(r'api/jog', JogViewSet)
router.register(r'api/user', UserViewSet)
urlpatterns += router.urls


from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view()
def hello_view(request):
    return Response([
        {"time": "12:00", "distance": 100, "average_speed": 12},
        {"time": "13:00", "distance": 200, "average_speed": 22}
    ])

urlpatterns += [url(r'^api/hello/$', hello_view)]
