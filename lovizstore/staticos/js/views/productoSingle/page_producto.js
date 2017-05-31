define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../collections/productos',
    '../../collections/comentarios',
    'headModel',
    '../../views/cms/breadcrumb',
    '../../views/productoSingle/galeria_full',
    '../../views/productoSingle/galeria_movil',
    '../../views/productoSingle/estrellas',
    '../../views/productoSingle/add_to_cart',
    '../../views/productoSingle/nuevo_comentario',
    '../../views/productoSingle/comentarios_seccion',
    '../../views/productoSingle/recomendados',
    '../../views/app/loader_full',
], function ($, _, Backbone,swig,ProductoCollection,ComentariosCollection,HeadModel,Breadcrumb,Galeria_full,Galeria_mobil,Estrellas,AddToCart,NuevoComentario,Comentarios,Recomendados,LoaderFull) {
    'use strict';

    var ProductoView = Backbone.View.extend({
        el:$('#contenido'),

        template: swig.compile($('#productoSingles_tlp').html()),                

        className: '',

        collection: new ProductoCollection(),

        events: {
            'click .tallas_elegibles .en_stock':'cambiar_talla',            
            'click #agregar_alCarro':'compra_producto',            
        },

        initialize: function () {            
        },
        render:function (slug) {
            this.$el.html(this.template(this.model.toJSON()));
            this.changeHead();
            this.addbread();
            this.add_galleria();
            this.add_estrellas();        
            this.add_to_cart();
            this.add_comentario();
            this.add_Recomendados();
            this.sendTrack();
        },
        get_modelo:function (slug) {
            var ajax_bloq = new LoaderFull();
            var self = this;            
            this.collection.fetch({
                data:$.param({slug:slug})
            }).done(function (e) {
                var coincidencia = self.collection.findWhere({slug:slug});
                if (coincidencia) {
                    self.model = coincidencia;
                    self.render();
                }else{
                    Backbone.history.navigate('error404',{trigger:true})
                }
            }).fail(function () {
                Backbone.history.navigate('error404',{trigger:true});
            }).always(function () {
                ajax_bloq.remove();
            })
        },
        changeHead:function () {
            HeadModel.set({
                titulo:this.model.toJSON().full_name,
                descripcion : this.model.toJSON().descripcion,
            })
        },
        addbread:function () {
            var bread = new Breadcrumb({
                model:this.model,
                el:this.$('.nav-breadcrumb'),
            })
        },
        add_galleria:function () {
            var galeria_full = new Galeria_full({
                model:this.model,
                el:$(this.$('#galeria_full')),
            });
            var galeria_mobil = new Galeria_mobil({
                model:this.model,
                el:$(this.$("#galeria_movil")),
            })
        },
        add_estrellas:function () {
            var estrellas = new Estrellas({
                el:this.$('.estrellas'),
                model:this.model
            });
            estrellas.render(this.model.toJSON().valoracion)
        },
        add_to_cart:function () {
            this.boton_add_cart = new AddToCart({
                el:this.$('#addtocart')
            });
        },
        cambiar_talla:function (e) {
            this.$('.tallas_elegibles .talla_seleccion').removeClass('seleccionado');
            var talla = e.target.dataset.valor;
            this.$('.precios .precio_variacion.mostrar').removeClass('mostrar');
            this.$('.precios .precio_variacion.'+talla).addClass('mostrar');
            $(e.target).addClass('seleccionado');
            this.boton_add_cart.model.set({
                variacion:talla,
                producto:this.model.id,
            });
        },
        compra_producto:function () {
            this.boton_add_cart.verificar_compra(this);            
        },
        add_comentario:function () {
            var comentarios_collection = new ComentariosCollection();
            var new_comentario = new NuevoComentario({
                el:this.$('#nuevo_comentario'),
                collection:comentarios_collection,
            })
            var comentarios = new Comentarios({
                el:this.$('#recomendation-producto'),
                model:this.model,
                collection:comentarios_collection
            })
        },
        add_Recomendados:function () {
            var recomendados = new Recomendados({
                el:this.$('#producto-asociado'),
                model:this.model,
            });
        },
        sendTrack:function () {
            var categoria = ''
            this.model.toJSON().categorias.forEach(function(e){
                if (e.seccion=='estilo') {
                    categoria = e.slug;
                };
            })
            var parametros = {
                ecomm_prodid:this.model.id,
                ecomm_pagetype:categoria,
                ecomm_totalvalue: this.model.toJSON().precio
            }
            window.google_trackConversion({
              google_conversion_id: 1017839300, 
              google_custom_params: parametros,
              google_remarketing_only: true
            });
        }
    });
    
    var productopage = new ProductoView();

    return productopage;
});