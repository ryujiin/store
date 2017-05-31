/*global define*/

define([
    'underscore',
    'backbone',
    '../models/pagina'
], function (_, Backbone, PageModel) {
    'use strict';

    var PagesCollection = Backbone.Collection.extend({
        url: '/api/cms/paginas/',
        
        model: PageModel,
    });

    return PagesCollection;
});
