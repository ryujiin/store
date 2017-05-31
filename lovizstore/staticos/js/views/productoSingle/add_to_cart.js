/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    'carro_main',
    '../../models/linea',
    //'../../views/app/loader_full',
    '../../views/productoSingle/minicompra',
], function ($, _, Backbone, swig,CarroModel,LineaModel,MiniCompra) {
    'use strict';

    var AddToCartView = Backbone.View.extend({
    
        template: swig.compile($('#add_to_cart_tlp').html()),        

        tagName: 'form',

        id: '',

        className: 'addtocart',

        events: {
        },

        initialize: function () {
            this.model = new LineaModel();
            this.render();
            this.listenTo(this.model, 'change:variacion', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        verificar_compra:function (vista) {
            var self = this;
            if (CarroModel.id) {
                this.comprar(vista);
            }else{
                CarroModel.save().done(function(data){
                    $.localStorage.set({carro:data.id});
                    self.comprar();
                });
            }
        },
        comprar:function (vista) {
            var self = this;
            if (CarroModel.id) {
                this.model.set({carro:CarroModel.id});
                this.model.save().done(function (data) { 
                    CarroModel.fetch();
                    vista.render();
                    self.crearMinicompra();
                });
            }else{
            }
            //var self = this;
            //var loader = new LoaderFull();
            //var datos = this.model;
            //if (CarroModel.id) {
                //this.model.set({cantidad:1});
                //this.model.save().done(function (data) { 
                    //self.crearMinicompra();
                    //vista.render();
                    //loader.remove();                    
                    //CarroModel.fetch();
                //});
            //};
        },
        crearMinicompra:function () {
            var minicompra = new MiniCompra({
                model:this.model,
                el:$('#mini_compra')
            })
            minicompra.mostrar();
        }

    });

    return AddToCartView;
});
