from rest_framework import serializers
from models import *

class ImagenCarruselSerializer(serializers.ModelSerializer):
	imagen = serializers.SerializerMethodField()
	class Meta:
		model = ImageCarrusel
		fields = ('id','titulo','estilo','orden','imagen','link')

	def get_imagen(self,obj):
		url = obj.imagen.url
		return url

class BloqueSerializer(serializers.ModelSerializer):
	class Meta:
		model = Bloque
		fields = ('id','titulo','seccion','estilo','template')

class CarruselSerializer(serializers.ModelSerializer):
	imagenes_carrusel = ImagenCarruselSerializer(many=True)

	class Meta:
		model = Carrusel
		fields = ('id','titulo','seccion','estilo','template','imagenes_carrusel','num_mostrar','navegacion')


class PaginaSerializer(serializers.ModelSerializer):	
	#bloques = BloqueSerializer(many=True)
	carruseles = CarruselSerializer(many=True)
	class Meta:
		model = Pagina
		fields = ('id','titulo','slug','descripcion','activo','estilo','contenido','carruseles')

#class CarruselSerializer(serializers.ModelSerializer):
	#seccion = serializers.CharField(read_only=True)
	#foto = serializers.SerializerMethodField()
	#class Meta:
		#model = Carrusel
		#fields = ('id','titulo','foto','seccion','creado','activo')
#
	#def get_foto(self,obj):
		#return obj.foto.url
#
#class ImagenCarruselSerializer(serializers.ModelSerializer):
	#imagen = serializers.SerializerMethodField()
	#class Meta:
		#model = ImageCarrusel
		#fields = ('id','titulo','estilo','bloque','orden','imagen','link')
#
	#def get_imagen(self,obj):
		#url = obj.imagen.url
		#return url
#
#class BloqueSerializer(serializers.ModelSerializer):
	#template = serializers.CharField(read_only=True)
	#imagenes_carrusel = ImagenCarruselSerializer(many=True)
	#class Meta:
		#model = Bloque
#
#class LinksMenuSerializer(serializers.ModelSerializer):
	#class Meta:
		#model = LinkMenu
#
#class MenuSerializer(serializers.ModelSerializer):
	#links = LinksMenuSerializer(many=True)
	#class Meta:
		#model = Menu
#
#class PageSerializer(serializers.ModelSerializer):
	#bloques = BloqueSerializer(many=True)
	#menus = MenuSerializer(many=True)
	#cuerpo = serializers.SerializerMethodField()
	#class Meta:
		#model = Page
		#fields = ('id','titulo','descripcion','titulo_activo','front','slug','activo','cuerpo','bloques','menus')
#
	#def get_cuerpo(self,obj):
		#cuerpo = obj.cuerpo
		#return cuerpo