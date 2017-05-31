from django.shortcuts import render,render_to_response

from rest_framework import viewsets

from django.http import HttpResponse, Http404
from django.shortcuts import redirect

from serializers import *

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated

# Create your views here.
from models import * 
from carro.models import Carro,LineaCarro
from pedido.models import Pedido

class PedidoViewSet(viewsets.ModelViewSet):
	serializer_class = PedidoSerializer
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		if self.request.user.is_authenticated:
			queryset = Pedido.objects.filter(user=self.request.user.pk)
		return queryset

class MetodoEnvioViewSet(viewsets.ReadOnlyModelViewSet):
	serializer_class = MetodoEnvioSerializer

	def get_queryset(self):	
		if self.request.user.is_authenticated():
			try:
				total = Carro.objects.get(propietario=self.request.user,estado="Abierto")
			except Carro.DoesNotExist:
				raise Http404
			print int(total.total_carro())
			if int(total.total_carro())>50:
				#si es menor q 50
				queryset = MetodoEnvio.objects.filter(grupo=0)
			else:
				queryset = MetodoEnvio.objects.filter(grupo=1)
		else:
			queryset = MetodoEnvio.objects.filter(grupo=1)
		return queryset.order_by('precio')


@csrf_exempt
def felicidades(request):
	if 'pedido' in request.session:		
		pedido = request.session['pedido'];
		pedido = get_object_or_404(Pedido,numero_pedido=pedido)
		carro = get_object_or_404(Carro,pedido=pedido)
		lineas = LineaCarro.objects.filter(carro=carro)
		for linea in lineas:
			producto = linea.producto
			producto.vendidos = producto.vendidos + linea.cantidad
			producto.save();
		request.session['pedido'] = ''
		return render_to_response('felicidades.html', {"pedido": pedido,'lineas':lineas})
	else:
		return redirect ('/')

import mercadopago
import json

def prueba_mercado_pago(request):
	mp = mercadopago.MP("2197077804609112", "j2yz6DWQl1EBSjxC0uve9WHFlEpLk6Wi")

	preference = {
		"items": [
			{
				"title": "Shingekui no ",
				'picture_url':'https://lovizdc.com/media/cache/38/42/384233ef2917e219c9fa7c7a109eacd6.jpg',
				"quantity": 2,
				"currency_id": "PEN",
				"unit_price": 40.20
			}
		],
		'payer':{
			'name':'Tu viejo Lopez',
			'email':'prienw@kmnvi.com',
		}
	}

	preferenceResult = mp.create_preference(preference)

	return HttpResponse(json.dumps(preferenceResult, indent=4),
					content_type='application/json;charset=utf8')
