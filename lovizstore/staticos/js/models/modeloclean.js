/*global define*/

define([
    'underscore',
    'backbone',
    'storage',
], function (_, Backbone,storage,Bloque_ajax) {
    'use strict';

    var ModeloClean = Backbone.Model.extend({

        initialize: function() {
        },
        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },
    });

    return ModeloClean;
});
