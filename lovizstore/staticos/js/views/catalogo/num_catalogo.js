/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone, swig) {
    'use strict';

    var CategoriaBloqueView = Backbone.View.extend({

        template: swig.compile($('#catalogo_num_refino_tlp').html()),                

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model,'change',this.render)
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
    });

    return CategoriaBloqueView;
});