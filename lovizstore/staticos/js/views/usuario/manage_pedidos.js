
define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../collections/pedidos',
    '../../models/modeloclean',
    '../../views/usuario/lista_pedidos',
], function ($, _, Backbone, swig,PedidosCollection,Modelo,Pedidos) {
    'use strict';

    var UserFormLoginView = Backbone.View.extend({

        template: swig.compile($('#usuario_pedidos_tpl').html()),        

        id: '',
        className: '',
        collection : new PedidosCollection(),
        model : new Modelo(),
        events: {
        },
        initialize: function () {
            this.buscar_pedidos();
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.collection.forEach(this.addPedido,this);
        },
        buscar_pedidos:function () {
            var self = this;
            this.collection.fetch().done(function (e) {
                self.model.set('pedidos',e.length)
                self.render();
            })
        },
        addPedido:function (modelo) {
            var listaPEdido = new Pedidos({
                model:modelo
            })
            this.$('tbody').append(listaPEdido.$el) 
        },
    });

    return UserFormLoginView;
});
