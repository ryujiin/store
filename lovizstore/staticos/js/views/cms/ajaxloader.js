/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone,swig) {
    'use strict';

    var AjaxLoaderView = Backbone.View.extend({
        template: swig.compile($('#ajax_loader_tlp').html()),        
        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.render();            
        },

        render: function () {
            this.$el.html(this.template());                     
        },
    });

    return AjaxLoaderView;
});