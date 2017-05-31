/*global define*/

define([
    'underscore',
    'backbone',
    '../models/producto_lista'
], function (_, Backbone, ProductosModel) {
    'use strict';

    var ProductosCollection = Backbone.Collection.extend({
    	url: '/api/lista_productos/',

        model: ProductosModel,
    });

    return ProductosCollection;
});
