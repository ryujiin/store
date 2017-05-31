from django.shortcuts import render
from models import *
from serializers import *
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser,IsAuthenticatedOrReadOnly
from rest_framework import authentication, permissions, parsers, renderers, status
from rest_framework import viewsets, generics
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.parsers import MultiPartParser

#from social.apps.django_app.utils import psa

from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie

from django.contrib.auth.forms import UserCreationForm


# Create your views here.

class PerfilUserViewSet(APIView):
	permission_classes = (IsAuthenticated,)

	def get(self,request,format=None):
		try:
			perfil = User.objects.get(pk=request.user.pk)
		except User.DoesNotExist:
			raise Http404

		serializer = UsuarioSerializer(perfil)
		return Response(serializer.data)


class ClienteViewSet(viewsets.ModelViewSet):
	permission_classes = (IsAuthenticated,)	
	serializer_class = ClienteSerializer

	def get_queryset(self):
		queryset = Cliente.objects.filter(usuario = self.request.user)
		return queryset

	def create(self, request):
		if request.user.is_authenticated:
			request.data['usuario'] = request.user.pk
			serializer = ClienteSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.permissions import AllowAny
from .permissions import IsStaffOrTargetUser

class UsuarioViewSet(viewsets.ModelViewSet):
	serializer_class = UsuarioSerializer
	queryset = User.objects.all()

	def get_permissions(self):
		return (AllowAny() if self.request.method == 'POST'
			else IsStaffOrTargetUser()),

class ComentarioImagenViewSet(viewsets.ModelViewSet):
	serializer_class = ComentarioImagenSerializer
	queryset = ComentarioImagen.objects.all()


class ComentarioViewSet(viewsets.ModelViewSet):
	serializer_class = ComentairoSerializer

	def get_queryset(self):
		queryset = Comentario.objects.all().order_by('-pk')
		producto = self.request.query_params.get('producto', None)
		if producto is not None:
			queryset = Comentario.objects.filter(producto=producto).order_by('-pk')
		return queryset

	def create(self, request):
		if request.user.is_authenticated:
			request.data['usuario'] = request.user.pk
		serializer = ComentairoSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DireccionViewsets(viewsets.ModelViewSet):
	serializer_class = DireccionSerilizer
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		if self.request.user.is_authenticated():
			queryset = Direccion.objects.filter(usuario=self.request.user)
			return queryset
		
class SuscritoViewset(viewsets.ModelViewSet):
	serializer_class = SuscritoSerializer

	def get_queryset(self):
		queryset = Suscrito.objects.filter(email='enrique@gmail.com')
		return queryset

class MayoristaViewset(viewsets.ModelViewSet):
	permission_classes = (IsAdminUser,)
	serializer_class = MayoristaSerializer
	queryset = Mayorista.objects.all()


from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
import json

def ingresar(request):
	if request.method=='POST':
		formulario = AuthenticationForm(request.POST)
		if formulario.is_valid:			
			username = request.POST['username']
			clave = request.POST['password']
			acceso = authenticate(username=username,password=clave)
			if acceso is not None:
				if acceso.is_active:
					login(request,acceso)
					return HttpResponse(json.dumps({'id':request.user.id,'nombre':request.user.username,'email':request.user.email}),
							content_type='application/json;charset=utf8')
				else:
					return  HttpResponse(json.dumps({'id':0,'nombre':request.user.username,'email':request.user.email,'error_message':'El usurio esta inactivo'}),
							content_type='application/json;charset=utf8')
			else:
				return HttpResponse(json.dumps({'id':0,'nombre':'anonimo','email':'','error_message':'Lo sentimos, no coincide con nuestros registros. Revise su datos y vuelva a intentarlo.'}),
				content_type='application/json;charset=utf8')
		else:
			raise Http404

def cambiar_foto(request):
	if request.method=='POST' and request.FILES['foto_perfil']:
		print 'fwef'
	else:
		return HttpResponse(json.dumps({'error_text':'No es formulario'}),
			content_type='application/json;charset=utf8')


@login_required(login_url='/cliente/cuenta/')
def salir(request):
	logout(request)
	return HttpResponseRedirect('/')

@csrf_exempt
def nuevo_usuario(request):
	if request.method=='POST':
		user = User.objects.create_user(username=request.POST['username'],
										email=request.POST['username'],
										password=request.POST['password'],
										first_name=request.POST['nombre'],
										last_name=request.POST['apellido'])
		if user:
			cliente = Cliente(usuario=user)
			cliente.save()
			email = request.POST['username']
			nombre ="%s %s" %(request.POST['nombre'],request.POST['apellido'])
			enviar_mail(email,nombre)
			return HttpResponse(json.dumps({'creado':True}),
					content_type='application/json;charset=utf8')			
		else:
			return HttpResponse(json.dumps({'creado':False}),
					content_type='application/json;charset=utf8')
	else:
		raise Http404

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

def enviar_mail(email,nombre):
	sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
	data = {
		"personalizations": [{
			"to": [{
				"email": email
			}],
			"subject": "Las Cosas buenas siempre iran contigo, Loviz DC.",
			"substitutions":{
				'usuario':nombre
			}
		}],
		"from": {
			"email": "admin@lovizdc.com"
			},
			"content": [{
				"type": "text/html",
				"value": "Hello, Email!"
		}],
		"template_id": "f8e2270c-2b38-40da-91f0-821e5293a1ab",

	}
	response = sg.client.mail.send.post(request_body=data)