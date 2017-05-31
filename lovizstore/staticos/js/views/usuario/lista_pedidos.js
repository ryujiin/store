
define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone, swig) {
    'use strict';

    var ListaPedidosViews = Backbone.View.extend({

        template: swig.compile($('#lista_pedidos_tlp').html()),        

        tagName : 'tr',

        className: '',

        events: {
        },

        initialize: function () {
            this.render();            
        },
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
    });

    return ListaPedidosViews;
});
