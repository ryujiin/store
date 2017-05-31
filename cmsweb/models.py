from django.db import models
from django.template.defaultfilters import slugify

class WebDatos(models.Model):
	nombre = models.CharField(max_length=20,help_text='En nombre de La web')
	logo = models.ImageField(upload_to='tienda')
	descripcion = models.CharField(max_length=150,help_text='La descripcion Seo')


class Pagina(models.Model):
	titulo = models.CharField(max_length=100,help_text='El titulo de la pagina web')
	titulo_seo = models.CharField(max_length=100,blank=True)
	descripcion_seo = models.CharField(max_length=100,blank=True)
	slug = models.SlugField(unique=True,max_length=120)
	categoria = models.ForeignKey('Categoria',blank=True,null=True)
	descripcion = models.CharField(max_length=150,help_text='La descripcion que se vera en la pagina para el buscador')
	activo = models.BooleanField(default=True)	
	estilos = models.CharField(max_length=100,blank=True)
	contenido = models.TextField(blank=True)

	def __unicode__(self):
		return self.slug

class Categoria(models.Model):
	titulo = models.CharField(max_length=100,help_text='Titulo de Categoria')
	slug = models.SlugField(unique=True,max_length=120)	

class Bloque(models.Model):
	titulo = models.CharField(max_length=100,blank=True,help_text='El titulo del bloque')
	page = models.ForeignKey(Pagina,blank=True,null=True,related_name='bloques')
	seccion = models.CharField(max_length=100,blank=True,help_text='El id donde se colocara')	
	estilos = models.CharField(max_length=100,blank=True)
	contenido = models.TextField(blank=True)
	template = models.CharField(max_length=100,blank=True,null=True)
	activo = models.BooleanField(default=True)


	def __unicode__(self):
		return "%s de %s " %(self.titulo,self.page)

class Carrusel(models.Model):
	TIPO = (
		('imagenes','Imagenes'),
		('productos','Productos'),
	)
	titulo = models.CharField(max_length=100,blank=True)
	page = models.ForeignKey(Pagina,blank=True,null=True,related_name='carruseles')	
	seccion = models.CharField(max_length=100,blank=True,help_text='El id donde se colocara')
	estilo = models.CharField(max_length=100,blank=True)	
	activo = models.BooleanField(default=True)
	template = models.CharField(max_length=100,blank=True,null=True)
	tipo = models.CharField(max_length=100,choices=TIPO)
	num_mostrar = models.PositiveIntegerField(default=1)
	navegacion = models.BooleanField(default=True)
	items = models.PositiveIntegerField(default=1)

class ImageCarrusel(models.Model):
	titulo = models.CharField(max_length=100,blank=True,help_text='Titulo que tendra la imagen en el Alt')
	estilo = models.CharField(max_length=100,blank=True)
	link = models.CharField(max_length=100,blank=True)
	carrusel = models.ForeignKey(Carrusel,blank=True,related_name='imagenes_carrusel')
	orden = models.PositiveIntegerField(default=0)
	imagen = models.ImageField(upload_to='bloque/carrusel')

class Menu(models.Model):
	titulo = models.CharField(max_length=100,blank=True)
	estilo = models.CharField(max_length=100,blank=True)
	template = models.CharField(max_length=100,blank=True)
	seccion = models.CharField(max_length=100,blank=True,help_text='El id donde se colocara')
	paginas = models.ManyToManyField(Pagina,blank=True,related_name='menus')
	activo = models.BooleanField(default=True)
	def __unicode__(self):
		return self.titulo

class LinkMenu(models.Model):
	nombre = models.CharField(max_length=100,blank=True)
	menu = models.ForeignKey(Menu, related_name='links')
	icono = models.CharField(max_length=100,blank=True)
	link = models.CharField(max_length=100,blank=True)
	estilo = models.CharField(max_length=100,blank=True)
	orden = models.PositiveIntegerField(default=0)


# Create your models here.

#
#def url_imagen_pr(self,filename):
	#url = "carrusel/imagen/%s" % (filename)
	#return url
#
#class Carrusel(models.Model):
	#titulo = models.CharField(max_length=100,blank=True)
	#foto = models.ImageField(upload_to=url_imagen_pr)
	#seccion = models.ForeignKey('SeccionesCMS',blank=True)
	#creado = models.DateTimeField(auto_now_add=True)
	#activo = models.BooleanField(default=True)
#
#class SeccionesCMS(models.Model):
	#titulo = models.CharField(max_length=100,blank=True)
	#activo = models.BooleanField(default=True)
#
	#def __unicode__(self):
		#return self.titulo
#
#class Page(models.Model):
	#titulo = models.CharField(max_length=100,help_text='El titulo de la pagina web')
	#slug = models.SlugField(unique=True,max_length=120)
	#descripcion = models.CharField(max_length=150,help_text='La descripcion que se vera en la pagina para el buscador')
	#titulo_activo = models.BooleanField(default=True)
	#front = models.BooleanField(default=False)
	#slug = models.SlugField(max_length=120,unique=True,blank=True)
	#activo = models.BooleanField(default=True)	
	#cuerpo = models.TextField(blank=True)
#
	#def __unicode__(self):
		#return self.slug
#
	#def save(self, *args, **kwargs):		
		#super(Page, self).save(*args, **kwargs)
#
#class TemplateBloque(models.Model):
	#nombre=models.CharField(max_length=100,blank=True)
#
	#def __unicode__(self):
		#return self.nombre
#    
#
#class Bloque(models.Model):
	#titulo = models.CharField(max_length=100,blank=True,help_text='El titulo de la pagina web')
	#page = models.ForeignKey(Page,blank=True,null=True,related_name='bloques')
	#estilo = models.CharField(max_length=100,blank=True)
	#cuerpo = models.TextField(blank=True)
	#seccion = models.CharField(max_length=100,blank=True,help_text='El id donde se colocara')
	#template = models.ForeignKey(TemplateBloque,blank=True,null=True)
	#carrusel = models.BooleanField(default=False)
#
	#def __unicode__(self):
		#return "%s de %s " %(self.titulo,self.page)
#
#    
#class ImageCarrusel(models.Model):
	#titulo = models.CharField(max_length=100,blank=True,help_text='Titulo que tendra la imagen en el Alt')
	#estilo = models.CharField(max_length=100,blank=True)
	#link = models.CharField(max_length=100,blank=True)
	#bloque = models.ForeignKey(Bloque,blank=True,related_name='imagenes_carrusel')
	#orden = models.PositiveIntegerField(default=0)
	#imagen = models.ImageField(upload_to='bloque/carrusel')
#
	#class Meta:
		#ordering = ['orden']
#


