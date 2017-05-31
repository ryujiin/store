/*global define*/

define([
    'underscore',
    'backbone',
    '../models/talla'
], function (_, Backbone, TallaModel) {
    'use strict';

    var TallaCollection = Backbone.Collection.extend({
        url: '/api/tallas/',
        
        model: TallaModel,
    });
    return TallaCollection;
});
