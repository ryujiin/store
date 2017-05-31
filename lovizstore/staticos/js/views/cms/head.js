define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    'headModel',
], function ($, _, Backbone, swig,HeadModel) {
    'use strict';

    var HeaderView = Backbone.View.extend({

        el:$('head'),

        tagName: 'div',

        id: '',

        className: '',

        model:HeadModel,

        events: {},

        initialize: function () {
            this.listenTo(this.model, "change", this.render, this);
            this.render();
        },

        render: function () {
            if (this.model.toJSON().titulo) {
                this.$('title').empty().append(this.model.toJSON().titulo+' | LovizDC.com :: Loviz DelCarpio');
            }else{
                this.$('title').empty().append('LovizDC | LovizDC.com :: Loviz DelCarpio');                
            }
            if (this.model.toJSON().descripcion) {
                this.$('meta[name=description]').remove();
                this.$el.append('<meta name="description" content="'+this.model.toJSON().descripcion+'">')    
            }else{
                var descripcion = 'Compra Pantuflas, Sandalias , Zapatillas de Mujer , hombre o niños. Compra Online';
                this.$('meta[name=description]').remove();
                this.$el.append('<meta name="description" content="'+descripcion+'">')
            }                        
        },
    });

    var header = new HeaderView();

    return header;
});