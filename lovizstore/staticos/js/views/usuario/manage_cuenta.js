/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone, swig) {
    'use strict';

    var UserFormLoginView = Backbone.View.extend({

        template: swig.compile($('#usuario_edit_tpl').html()),        

        id: '',
        className: '',
        events: {
            'click .salvar-cambios':'verificar',
            'click .foto':'click_upload_imagen',
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        verificar:function (e) {
            var nombre,apellido,genero,dni;
        },
        click_upload_imagen:function () {
            this.$('#foto_perfil').click();
        }
    });

    return UserFormLoginView;
});
