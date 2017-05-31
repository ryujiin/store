from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated,IsAdminUser

from models import *
from serializers import *

from datetime import datetime, timedelta, time

how_many_days = 20

class CatalogoViewsets(viewsets.ReadOnlyModelViewSet):
	serializer_class = ProductoSingleSereializer
	ordering_fields = ('precio_sort', 'num_comentarios')
	
	def get_queryset(self):
		queryset = Producto.objects.filter(activo=True).order_by('-actualizado')
		categoria = self.request.query_params.get('categoria', None)
		slug = self.request.query_params.get('slug',None)
		limite = self.request.query_params.get('limite',None)
		
		if categoria:
			if categoria == 'ofertas':
				queryset = queryset.filter(en_oferta=True)
			elif categoria == 'novedades':
				queryset = queryset.filter(actualizado__gte=datetime.now()-timedelta(days=how_many_days))
			else:
				queryset = queryset.filter(categorias__slug=categoria)
		if slug:
			queryset = queryset.filter(slug=slug)
		if limite:
			queryset = queryset[:limite]
		return queryset

class ListaProductosViewsets(viewsets.ReadOnlyModelViewSet):
	serializer_class = ProductoListaSerializers

	def get_queryset(self):
		queryset = Producto.objects.filter(activo=True).order_by('-actualizado')
		categoria = self.request.query_params.get('categoria', None)
		slug = self.request.query_params.get('slug',None)
		limite = self.request.query_params.get('limite',None)
		
		if categoria:
			if categoria == 'ofertas':
				queryset = queryset.filter(en_oferta=True)
			elif categoria == 'novedades':
				queryset = queryset.filter(actualizado__gte=datetime.now()-timedelta(days=how_many_days))
			else:
				queryset = queryset.filter(categorias__slug=categoria)
		if slug:
			queryset = queryset.filter(slug=slug)
		if limite:
			queryset = queryset[:limite]
		return queryset

#from drf_haystack.viewsets import HaystackViewSet
##aun no se usa la busqueda mas adelante derrepente
#class ProductoBusquedaView(HaystackViewSet):
	#index_models = [Producto]
	#serializer_class = ProductoBusquedaSerializer


class CategoriaViewsets(viewsets.ReadOnlyModelViewSet):
	serializer_class = CategoriaSerializer
	queryset = Categoria.objects.all()


#Vistas para la oficina
class ProductosOficinaViewsets(viewsets.ReadOnlyModelViewSet):
	serializer_class = ProductoListaSerializer
	permission_classes = (IsAdminUser,)

	def get_queryset(self):
		queryset = Producto.objects.filter(activo=True).order_by('-pk')
		return queryset

class ProductoSingleEditableViewsets(viewsets.ModelViewSet):
	serializer_class = ProductoSingleEditable
	permission_classes = (IsAdminUser,)

	def get_queryset(self):
		queryset = Producto.objects.all().order_by('-pk')
		return queryset
