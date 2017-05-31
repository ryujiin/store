from django.db import models
from django.template.defaultfilters import slugify

from sorl.thumbnail import get_thumbnail
from django.contrib.auth.models import User as User

from datetime import datetime, timedelta, time
from django.utils import timezone

# Create your models here.
class Producto(models.Model):
	nombre = models.CharField(max_length=120,blank=True,null=True)
	full_name = models.CharField(max_length=120, unique=True,blank=True,null=True,editable=False)
	relaciones = models.ManyToManyField('self',blank=True,related_name='productos_relacionados')
	nombre_relacion = models.CharField(max_length=30,blank=True)
	slug = models.CharField(max_length=120,editable=False,unique=True)
	categorias = models.ManyToManyField('Categoria',blank=True,related_name='categorias_producto')
	activo = models.BooleanField(default=True)
	descripcion = models.TextField(blank=True,null=True)
	creado = models.DateTimeField(auto_now_add=True)
	actualizado = models.DateTimeField(auto_now=True)
	video = models.CharField(max_length=120, blank=True,null=True)

	def __unicode__(self):
		return self.full_name

	def save(self, *args, **kwargs):
		if self.nombre_relacion:
			self.full_name = "%s (%s)" %(self.nombre,self.nombre_relacion)
		else:
			self.full_name = self.nombre
		if not self.slug:
			self.slug = slugify(self.full_name)
		super(Producto, self).save(*args, **kwargs)

	def get_thum(self):
		img = ProductoImagen.objects.filter(producto=self).order_by('pk')[0]
		img = get_thumbnail(img.foto, '450x350', quality=80)
		return img

	def guardar_oferta(self):
		oferta = self.get_en_oferta()
		if oferta>0:
			self.en_oferta = True
		else:
			self.en_oferta = False


	def guardar_novedad(self):
		dia_no_nuevo = timezone.now()-timedelta(days=20)
		if dia_no_nuevo > self.creado:
			return False
		else:
			return True

	def get_en_oferta(self):
		variaciones = self.get_variaciones()
		if variaciones:
			return variaciones[0].oferta
		else:
			return 0

	def get_variaciones(self):
		variaciones = ProductoVariacion.objects.filter(producto=self).order_by('-oferta')
		return variaciones

	def get_precio_lista(self):
		en_oferta = self.get_en_oferta()
		if en_oferta:
			variaciones=self.get_variaciones()
		else:
			variaciones = ProductoVariacion.objects.filter(producto=self).order_by('-precio_minorista')
		if variaciones:
			precio = variaciones[0].precio_minorista
		else:
			precio = 0
		if not precio:
			precio =0
		return precio

	def get_tallas_disponibles(self):
		tallas = ProductoVariacion.objects.filter(producto=self,stock__gt=0)
		return tallas

	def get_precio_oferta_lista(self):
		en_oferta = self.get_en_oferta()
		if en_oferta:
			variaciones=self.get_variaciones()
			precio_oferta = variaciones[0].precio_oferta
			return precio_oferta
		else:
			precio = self.get_precio_lista()
			return precio

	def get_parientes(self):
		parientes = self.parientes.all()
		return parientes

	def get_num_estrellas(self):
		num_entrellas = Comentario.objects.filter(producto=self)
		return num_entrellas

	def get_absolute_url(self):
		return "/producto/%s/" % self.slug

class Categoria(models.Model):
	SECCIONES = (
		('genero','Genero'),
		('categoria','Categoria'),
		('estilo','Estilo'),
		('coleccion','Coleccion'),
	)
	nombre = models.CharField(max_length=120)
	full_name = models.CharField(max_length=255,db_index=True, editable=False)
	padre = models.ForeignKey('self',blank=True,null=True)
	seccion = models.CharField(max_length=100,choices=SECCIONES,blank=True,null=True)
	slug = models.SlugField(max_length=120,unique=True,editable=False)
	titulo_seo = models.CharField(max_length=100,blank=True,null=True)	
	descripcion = models.TextField(blank=True,null=True)
	activo = models.BooleanField(default=True)
	imagen = models.ImageField(upload_to='categorias',blank=True,null=True,max_length=250)

	def __unicode__(self):
		return self.slug

	def get_absolute_url(self):
		return "/catalogo/%s/" % self.slug

	def save(self, *args, **kwargs):
		if self.padre:
			self.full_name = "%s - %s" %(self.nombre, self.padre.full_name)
		else:
			self.full_name = self.nombre
		if not self.slug:
			self.slug = slugify(self.full_name)
		super(Categoria, self).save(*args, **kwargs)

class ProductoVariacion(models.Model):
	variacion = models.ForeignKey('Variacion',blank=True)
	producto = models.ForeignKey(Producto,related_name='variaciones')
	precio = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
	stock = models.PositiveIntegerField(default=0)

	def __unicode__(self):
		return "%s - %s" %(self.producto,self.precio)

	def save(self, *args, **kwargs):
		super(ProductoVariacion, self).save(*args, **kwargs)

class Variacion(models.Model):
	nombre = models.CharField(max_length=100,blank=True)
	grupo = models.ForeignKey('self',blank=True,null=True)

	def __unicode__(self):
		if self.grupo:
			return '%s : %s' %(self.grupo,self.nombre)
		else:
			return '(Grupo - %s)' %(self.nombre)			

def url_imagen_pr(self,filename):
	url = "productos/imagen/%s/%s" % (self.producto.pk, filename)
	return url

class ProductoImagen(models.Model):
	producto = models.ForeignKey(Producto,related_name="imagenes_producto")
	foto = models.ImageField(upload_to=url_imagen_pr)
	orden = models.PositiveIntegerField(default=0)
	creado = models.DateTimeField(auto_now_add=True)
	actualizado = models.DateTimeField(auto_now=True)
	class Meta:
		ordering = ["orden"]

	def save(self, *args, **kwargs):
		orden_anterior = ProductoImagen.objects.filter(producto=self.producto).order_by('-orden')
		if orden_anterior:
			self.orden=orden_anterior[0].orden+1
		else:
			self.orden=0
		super(ProductoImagen, self).save(*args, **kwargs)

	def get_thum_medium(self):
		img = get_thumbnail(self.foto, '740x600', quality=80)
		return img

	def get_thum(self):
		img = get_thumbnail(self.foto, '150x100', quality=80)
		return img