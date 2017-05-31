from django.conf.urls import include, url
from views import *

urlpatterns = [
    url(r'^foto/$',cambiar_foto,name='prefil_user'),    
    url(r'^perfil/$',PerfilUserViewSet.as_view(),name='prefil_user'),
]