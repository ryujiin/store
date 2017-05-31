/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    'carro_main',
    '../../views/app/header',
    '../../models/user',
    '../../models/pedido',
    '../../views/procesar/paso_metodoenvio',
    '../../views/procesar/paso_identificar',
    '../../collections/direcciones',
    '../../views/procesar/paso_pago',    
    '../../views/procesar/resumen',
    '../../views/app/loader_full',
], function ($, _, Backbone, swig,CarroModel,Header,UserModel,PedidoModel,PasoEnvio,PasoIdentificar,DireccionesCollection,PasoPago,Resumen,LoaderFull) {
    'use strict';

    var PageProcesarCompraView = Backbone.View.extend({
        el:$('#contenido'),
        template: swig.compile($('#procesar_page_tlp').html()),

        tagName: 'div',

        id: '',

        className: '',

        events: {
        },

        initialize: function () {
            this.model.set('ajax',false);
            this.listenTo(CarroModel, "change:pedido", this.objtener_model, this);
            this.listenTo(this.model, "change:ajax", this.aparecerAjax, this);
        },

        render: function () {
            this.$el.html(this.template());
            this.crear_paso_identificar()
            this.crear_paso_envio();
            this.crear_paso_pago();
            this.crear_resumen();
            this.ver_paso_actual();
            this.finalizo();
        },
        verificar_render:function () {
            this.model.set('paso_actual',0);
            var self = this;
            if (CarroModel.toJSON().num_lineas) {
                self.objtener_model();
                self.changeHead();
            }else{
                Backbone.history.navigate("/", {trigger: true});                    
            }
        },
        changeHead:function (argument) {
            var titulo = 'Procesar Compra | LovizDc.com :: Loviz DelCarpio'
            var descripcion = 'Area de procesamiento del pedido en LovizDC.com'
            Header.render(titulo,descripcion);
        },
        aparecerAjax:function () {
            if (this.model.toJSON().ajax) {
                this.vistaAjax = new LoaderFull();
            }else{
                if (this.vistaAjax) {
                    this.vistaAjax.remove();
                };
            }
        },
        objtener_model:function () {
            var locacion = Backbone.history.location.pathname;
            if (locacion === '/procesar-compra/') {
                if (this.model.id===undefined) {
                    var self = this;
                    var pedido_id = CarroModel.toJSON().pedido;
                    if (pedido_id) {
                        this.model.id= pedido_id;
                        this.model.fetch().done(function () {
                            self.model.set('ajax',false);
                            self.render();
                        })
                    }else{
                        this.render();
                    }
                }else{
                    this.render();
                }         
            };            
        },
        crear_paso_identificar:function () {
            this.paso_identificar = new PasoIdentificar({
                el:this.$('.paso_identificar'),
                model:this.model,
            })
        },
        crear_paso_envio:function () {
            var direcciones = new DireccionesCollection();
            this.paso_envio = new PasoEnvio({
                el:this.$('.paso_envio'),
                collection: direcciones,
                model:this.model,
            });
        },
        crear_paso_pago:function () {
            this.paso_pago = new PasoPago({
                el:this.$('.paso_pago'),
                model:this.model,
            });
        },
        crear_resumen:function () {
            var carro = CarroModel;
            this.resumen = new Resumen({
                el:this.$('.orden_sumary'),
                model:CarroModel,
            });
        },
        ver_paso_actual:function () {
            var dimensionValue = 'carro_page';                   
            if (this.model.id===undefined) {
                var dimensionValue = 'proceso_sin_autenticar';                   
                this.model.set('paso_actual',1)
            }else if (this.model.toJSON().estado_pedido==='autenticado'){
                var dimensionValue = 'proceso_sin_metodo_envio';                                   
                this.model.set('paso_actual',2)
            }else if (this.model.toJSON().estado_pedido==='metodo_envio') {
                var dimensionValue = 'proceso_sin_metodo_pago';                   
                this.model.set('paso_actual',3)
            };
        },
        finalizo:function () {
        }
    });
    var page = new PageProcesarCompraView({
        model: new PedidoModel()
    });

    return page
});