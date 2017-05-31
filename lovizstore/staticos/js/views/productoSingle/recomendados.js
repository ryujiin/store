/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../collections/lista_producto',
    '../../views/catalogo/producto_lista',

], function ($, _, Backbone, swig,ProductoCollection,ProducoView) {
    'use strict';

    var RecomendacionesViews = Backbone.View.extend({

        tagName: 'div',

        id: '',

        collection: new ProductoCollection(),

        className: '',

        events: {
        },

        initialize: function () {
            this.buscar_productos();
        },

        render: function () {
            this.collection.forEach(this.addOne,this);
        },
        addOne:function (modelo) {            
            var producto = new ProducoView({
                model:modelo
            })
            this.$('.lista-productos').append(producto.$el)
        },
        buscar_productos:function () {
            var self = this;
            var busqueda = this.determinar_busqueda();
            this.collection.fetch({
                data:$.param({categoria:busqueda,limite:4})
            }).done(function (e) {
                self.render();
            })
        },
        determinar_busqueda:function () {
            var myjson = this.model.toJSON();
            if (myjson.categorias.length>0) {
                return 'mujer'
            }else{
                return 'mujer'
            }
        }
    });

    return RecomendacionesViews;
});
