/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone, swig) {
    'use strict';

    var BloqueView = Backbone.View.extend({

        id: '',

        className: 'block',

        events: {},

        initialize: function () {
            this.template = swig.compile($(this.model.toJSON().template).html());
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));            
            this.$el.addClass(this.model.toJSON().estilos);
        },
    });

    return BloqueView;
});