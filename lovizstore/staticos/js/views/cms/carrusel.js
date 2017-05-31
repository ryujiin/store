/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    'owl',    
], function ($, _, Backbone, swig) {
    'use strict';

    var BloqueView = Backbone.View.extend({

        id: '',

        className: 'block carrusel',

        events: {},

        initialize: function () {
            this.template = swig.compile($(this.model.toJSON().template).html());
            this.render();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));            
            this.$el.addClass(this.model.toJSON().estilos);
            this.add_Carrusel();
        },
        add_Carrusel:function () {
            this.$el.owlCarousel({
                navigation : true, // Show next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                singleItem:true
            });
        }
    });

    return BloqueView;
});