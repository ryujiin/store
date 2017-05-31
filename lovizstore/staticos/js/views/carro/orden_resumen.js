/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',    
], function ($, _, Backbone, swig) {
    'use strict';

    var ResumenOrden = Backbone.View.extend({
        
        template : swig.compile($('#orden_resumen_template').html()),

        tagName: 'div',

        id: '',

        className: '',

        events: {
        },

        initialize: function () {
            this.render();
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
    });

    return ResumenOrden;
});