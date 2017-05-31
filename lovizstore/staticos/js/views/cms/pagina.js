/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    'paginaTotal',
    '../../collections/paginas',
    '../../models/modeloclean',
    '../../views/cms/bloque',
    '../../views/cms/carrusel',
    'headModel'
], function ($, _, Backbone, swig,PaginasCollection,CollectionPage,ModeloClean,BloqueView,CarruselView,HeadModel) {
    'use strict';

    var PageView = Backbone.View.extend({
        el:$('#contenido'),
        id: '',

        collection: PaginasCollection,

        events: {},

        initialize: function () {
        },

        render: function (modelo) {
            this.template = swig.compile($('#page_tema1_template').html());
            this.$el.html(this.template(modelo.toJSON()));
            HeadModel.set({
                titulo:modelo.toJSON().titulo,
                descripcion:modelo.toJSON().descripcion
            })
            this.rellenar(modelo);
            if (modelo.toJSON().estilo) {
                this.$el.addClass('pagina '+ modelo.toJSON().estilo)
            };
        },
        buscar_page:function(slug){
            var self = this;
            var coincidencia = this.collection.findWhere({'slug':slug})
            if (coincidencia === undefined) {
                var pagina = new CollectionPage();
                pagina.fetch({
                    data:$.param({slug:slug})
                }).done(function (e) {
                    if (e.length===0) {
                        Backbone.history.navigate('error_404/', {trigger:true});
                    }else{
                        self.collection.add(e);
                        self.buscar_page(slug);    
                    }                    
                }).fail(function () {
                    Backbone.history.navigate('error_404/', {trigger:true});
                })
            }else{
                this.render(coincidencia);
            }
        },
        rellenar:function (modelo) {
            if (modelo.toJSON().bloques) {
                modelo.toJSON().bloques.forEach(this.crear_bloque,this);
            }
            if (modelo.toJSON().carruseles) {
                modelo.toJSON().carruseles.forEach(this.crear_carrusel,this);
            };
        },
        crear_bloque:function (modelo) {
            var modeloclean = new ModeloClean(modelo);
            var bloque = new BloqueView({
                model:modeloclean
            });
            this.$(modeloclean.toJSON().seccion).append(bloque.$el);
        },
        crear_carrusel:function (modelo) {
            var modeloclean = new ModeloClean(modelo);
            var carrusel = new CarruselView({
                model:modeloclean
            });
            this.$(modeloclean.toJSON().seccion).append(carrusel.$el);
        },
        render_404:function () {
            this.template = swig.compile($('#page_error_template').html());
            this.$el.html(this.template());

            var titulo = 'Upps Parece que hubo un error 404';
            var descripcion = 'No se encontro lo que buscabas lo sentimos mucho';
            HeadModel.set({
                titulo:titulo,
                descripcion:descripcion,
            })

        }
    });

    var vista = new PageView();

    return vista;
});