/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',    
    '../../collections/lineas',
    '../../views/carro/linea'
], function ($, _, Backbone, swig,LineasCollection,LineaView) {
    'use strict';

    var LineasView = Backbone.View.extend({

        tagName: 'div',

        id: '',

        collection:new LineasCollection(),

        className: '',

        events: {
        },

        initialize: function () {
            var self = this;
            this.collection.fetch({
                data:$.param({carro:this.model.id})
            }).done(function () {
                self.render();
            })
        },

        render: function () {
            this.collection.forEach(this.addLinea,this);
        },
        addLinea:function (modelo) {
            var linea = new LineaView({model:modelo});
            this.$el.append(linea.$el);
        }
    });

    return LineasView;
});
