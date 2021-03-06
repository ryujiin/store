from django.db import models

# Create your models here.
from django.db import models
from cliente.models import *
from ubigeo.models import *
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext_lazy as _


class Pedido(models.Model):
	AUTENTICADO, METODO_ENVIO, METODO_PAGO,ESPERANDO_PAGO, PAGADO, ERROR_PAGO, ESPERANDO_ENVIO, ENVIADO, DEVUELTO,FUSIONADO = (
        "autenticado", "metodo_envio", "metodo_pago",'esperando_pago', "pagado", "error_pago", "esperando_envio", "enviado", "devuelto","fucionado")
	ESTADO_ELECCION = (
        (AUTENTICADO, _("Autenticado - El usuario se encuentra autenticado y el pedido le pertenece")),
        (METODO_ENVIO, _("Metodo de Envio - Ya coloco el metodo de envio, esperando metodo de pago")),
        (METODO_PAGO, _("Metodo de Pago - Ya selecciono el metodo de pago")),
        (ESPERANDO_PAGO, _("Esperando Pago - Ya selecciono el metodo de pago, pero aun esta esperandose el pago")),
        (PAGADO, _("Pagado - El pago se realizo correctamente, espere el envio del producto")),
        (ERROR_PAGO, _("Error en Pago - Ocurrio un error al pagar")),
        (ENVIADO, _("Enviado - El producto fue enviado")),
        (DEVUELTO, _("Devuelto - El producto fue devuelto")),
        (FUSIONADO, _("Fusionado - Este Pedido se Fusiono con otro pedido")),
    )
	numero_pedido = models.CharField(max_length=120,blank=True,null=True)
	user = models.ForeignKey(User,related_name='Pedido', null=True,blank=True)
	gasto_envio = models.DecimalField(decimal_places=2,max_digits=12,blank=True,null=True)
	direccion_envio = models.ForeignKey(Direccion,blank=True,null=True)
	metodoenvio = models.ForeignKey('MetodoEnvio',blank=True,null=True)
	fecha_compra = models.DateTimeField(auto_now_add=True, db_index=True)
	fecha_final = models.DateTimeField(blank=True,null=True)
	metodo_pago = models.ForeignKey('MetodoPago',blank=True,null=True)
	pago_pedido = models.OneToOneField('Pago',blank=True,null=True)
	estado_pedido = models.CharField(max_length=120,default=AUTENTICADO,choices=ESTADO_ELECCION)
	pagado = models.BooleanField(default=False)
	enviado = models.BooleanField(default=False)
	telefono_pedido = models.CharField(max_length=100,blank=True)


	def __unicode__(self):
		return "%s - %s" %(self.estado_pedido,self.numero_pedido)

	def save(self, *args, **kwargs):
		if not self.numero_pedido:
			self.numero_pedido = get_random_string(length=10)
		if self.direccion_envio:
			if self.metodoenvio:
				if not self.metodo_pago:
					self.estado_pedido = self.METODO_ENVIO
		if self.pago_pedido:
			self.estado_pedido = self.PAGADO
			self.pagado = True
		super(Pedido, self).save(*args, **kwargs)
		self.add_modificacion()

	def add_modificacion(self):
		m = ModificacionPedido()
		m.pedido = self
		m.estado_actual = self.estado_pedido
		m.save()
		
class ModificacionPedido(models.Model):
	pedido = models.ForeignKey(Pedido)
	fecha_modificacion = models.DateTimeField(auto_now=True, db_index=True)
	estado_actual = models.CharField(max_length=100)
		
class EstadoPedido(models.Model):
	nombre = models.CharField(max_length=100)
	descripcion = models.TextField()
	slug_estado = models.CharField(max_length=120,blank=True,null=True)

	def __unicode__(self):
		return self.nombre

	def save(self,*args,**kwargs):
		if not self.slug_estado:
			self.slug_estado = slugify(self.nombre)
		super(EstadoPedido,self).save(*args,**kwargs)

class MetodoEnvio(models.Model):
	nombre = models.CharField(max_length=100)
	descripcion = models.TextField(blank=True,null=True)
	precio = models.DecimalField(decimal_places=2,max_digits=12)
	restricciones = models.ManyToManyField(Ubigeo,blank=True,help_text='Solo en este lugar esta habilitado',related_name='restricciones_solo')
	exepciones = models.ManyToManyField(Ubigeo,blank=True,help_text='Menos en este esta habilitado',related_name='restricciones_menos')	
	restriccion_precio = models.DecimalField(decimal_places=2,max_digits=12,default=0,help_text='Todo precio mayor que ese numero lo habilita')
	grupo = models.PositiveIntegerField(default=0)


	def __unicode__(self):
		return "%s - S/.%s" %(self.nombre, self.precio)

class MetodoPago(models.Model):
	nombre = models.CharField(max_length=100,blank=True,null=True)
	descripcion =models.TextField(blank=True,null=True)

	def __unicode__(self):
		return self.nombre

class Pago(models.Model):
	cantidad = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
	id_pago = models.CharField(max_length=100,blank=True,null=True)
	fecha = models.DateTimeField(auto_now_add=True, db_index=True)
	metodo_pago = models.ForeignKey(MetodoPago,blank=True,null=True)
	descripcion = models.CharField(max_length=100,blank=True,null=True)
	transaccion = models.CharField(max_length=100,blank=True,null=True)

	def __unicode__(self):
		return self.id_pago



from paypal.standard.models import ST_PP_COMPLETED
from paypal.standard.ipn.signals import valid_ipn_received,payment_was_successful

def show_me_the_money(sender, **kwargs):
	ipn_obj = sender
	if ipn_obj.payment_status == ST_PP_COMPLETED:
		if ipn_obj.custom == "Comprando los mejores productos!":
			pago = Pago(cantidad = ipn_obj.mc_gross,descripcion=ipn_obj.payment_status,transaccion = ipn_obj.txn_id)
			pago.save()
	else:
		print 'Salio Mal'

valid_ipn_received.connect(show_me_the_money)
payment_was_successful.connect(show_me_the_money)