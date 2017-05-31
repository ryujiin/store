/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../models/modeloclean',
    '../../views/cms/breadcrumbLink',
], function ($, _, Backbone, swig,ModelClean,BreadLink) {
    'use strict';

    var BreadcrumbView = Backbone.View.extend({
        
        template: swig.compile($('#breadcrumb_tlp').html()),        

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            this.crearmodelo_link(this.model);
        },

        addLink:function(modelo){
            var link = new BreadLink({model:modelo});
            this.$('ol').prepend(link.$el);
        },
        crearmodelo_link:function (modelo) {
            var nuevo;
            if (modelo.toJSON().precio) {
                nuevo = new ModelClean({nombre:modelo.toJSON().nombre});
                this.addLink(nuevo);
                this.bread_producto();
            }else{
                nuevo = new ModelClean({nombre:modelo.toJSON().nombre});
                this.addLink(nuevo);
                if (modelo.toJSON().padre) {
                    this.addmodelolink(modelo);
                }else{
                    var home = new ModelClean({
                        nombre:'inicio',link:'/'
                    });
                    this.addLink(home);
                }
            }            
        },
        addmodelolink:function (modelo) {
            var coincidencia = this.collection.findWhere({slug:modelo.toJSON().padre});
            var nuevo = new ModelClean({
                nombre:coincidencia.toJSON().nombre,
                link:coincidencia.toJSON().link,
            });
            this.addLink(nuevo);
            if (coincidencia.toJSON().padre) {
                this.addmodelolink(coincidencia)
            }else{
                var home = new ModelClean({
                    nombre:'inicio',link:'/'
                });
                this.addLink(home);
            }
        },
        bread_producto:function () {
            var categoria,estilo,genero;
            this.model.toJSON().categorias.forEach(function (e) {
                if (e.seccion==='categoria') {
                    categoria = new ModelClean({nombre:e.nombre,link:e.link});
                }
                if (e.seccion==='estilo') {
                    estilo = new ModelClean({nombre:e.nombre,link:e.link});
                }
                if (e.seccion==='genero') {
                    genero = new ModelClean({nombre:e.nombre,link:e.link});
                };
            });
            if (estilo) {
                this.addLink(estilo)
            }
            if (categoria) {
                this.addLink(categoria)                
            }
            if (genero) {
                this.addLink(genero)                                
            };
            var home = new ModelClean({nombre:'inicio',link:'/'});
            this.addLink(home);
        }
    });

    return BreadcrumbView;
});
