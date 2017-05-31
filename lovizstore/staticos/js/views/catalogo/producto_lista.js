/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../views/productoSingle/estrellas',
], function ($, _, Backbone, swig,EstrellasViews) {
    'use strict';

    var ProductosListaView = Backbone.View.extend({

        template: swig.compile($('#productosLista_tlp').html()),                

        tagName: 'article',

        id: '',

        className: 'productos',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            var estrellas = new EstrellasViews({
                el:this.$('.estrellas')
            })
            estrellas.render(this.model.toJSON().valoracion);
        },
    });

    return ProductosListaView;
});
