/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    '../../collections/lista_producto',
    //'../../collections/productos',
    '../../views/catalogo/producto_lista',
    '../../views/app/loader_full',
    'facetr'
], function ($, _, Backbone,ProductoCollection,ProductoLista,AjaxLoaderView,Facetas) {
    'use strict';

    var CatalogoView = Backbone.View.extend({

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.sort = '';
            this.productos = new ProductoCollection();
            this.listenTo(this.collection, 'update', this.productos_filtrar);
        },

        render: function () {
            this.$el.empty();
            this.productos.forEach(this.addOne,this);
            this.model.set({numero:this.productos.length});
        },

        addOne:function (modelo) {
            modelo.set({visible:true});
            var producto = new ProductoLista({model:modelo});
            this.$el.append(producto.$el);
        },
        buscar:function (slug) {
            var loader = new AjaxLoaderView();
            var self = this;
            this.categoria = slug;
            this.productos.fetch({
                data:$.param({categoria:this.categoria})
            }).done(function () {
                self.render();
                loader.remove();
            })
        },
        productos_filtrar:function () {
            if (this.collection.length===0) {
                Facetas(this.productos).clearValues();
            }else{
                this.collection.forEach(this.filtrar,this);    
            }
            if (this.sort.modo === 'asc') {
                Facetas(this.productos).sortBy(this.sort.ordenar).asc();
            }else if(this.sort.modo === 'desc'){
                Facetas(this.productos).sortBy(this.sort.ordenar).desc();                
            }
            this.render();
        },
        filtrar:function (modelo) {
            Facetas(this.productos).facet(modelo.toJSON().filtro).value(modelo.toJSON().valor);            
        },
        sort_by:function (ordenar,modo) {
            this.sort = {ordenar:ordenar,modo:modo}
            if (this.sort.modo === 'asc') {
                Facetas(this.productos).sortBy(this.sort.ordenar).asc();
            }else if(this.sort.modo === 'desc'){
                Facetas(this.productos).sortBy(this.sort.ordenar).desc();                
            }
            this.render();
        }
    });

    return CatalogoView;
});