define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../views/catalogo/categorias_link',    
    '../../collections/tallas',    
], function ($, _, Backbone, swig,CateLink,TallasCollection) {
    'use strict';

    var BloqueTallaView = Backbone.View.extend({

        template: swig.compile($('#categoria_bloque_tlp').html()),                        

        id: '',

        className: 'refinement Talla',

        events: {
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var dato = {nombre:'Tallas'}
            this.$el.html(this.template(dato));
            this.addTallas();
        },
        addTallas:function () {
            var self = this;
            this.tallas = new TallasCollection();
            this.tallas.fetch().done(function () {
                self.tallas.forEach(self.addTalla,self);
            });
        },
        addTalla:function (modelo) {
            modelo.set({filtro:'variaciones.talla'});
            var vista = new CateLink({model:modelo});
            this.$('ul').append(vista.render().el);
        },
    });

    return BloqueTallaView;
});
