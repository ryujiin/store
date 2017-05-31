/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
], function ($, _, Backbone, swig) {
    'use strict';

    var PageUserView = Backbone.View.extend({
        el:$('#contenido'),

        tagName: 'div',

        template : swig.compile($('#reset_password_tlp').html()),

        id: '',

        events: {
            'submit form':'verificar',
        },

        initialize: function (ui,token) {
            this.ui = ui;
            this.token = token;
            this.render()
        },

        render: function () {
            this.$el.html(this.template());
        },
        verificar:function (e) {
            e.preventDefault();
            var pass,pass2
            pass = this.$('.pass').val();
            pass2 = this.$('.pass2').val();
            if (pass.length >7) {
                if (pass2.length > 7) {
                    if (pass2 == pass) {
                        this.enviar_form(pass,pass2);
                    }else{
                        this.error_mesage('Las contraseñas no coinciden',true);
                        this.$('.cont-pass').addClass('has-error')
                        this.$('.cont-pass2').addClass('has-error')
                    }
                }else{
                    this.$('.cont-pass2').addClass('has-error')
                    this.error_mesage('Minimo de 8 caracteres',true)
                }
            }else{
                this.$('.cont-pass').addClass('has-error')
                this.error_mesage('Minimo 8 caracteres',true)
            }
        },
        error_mesage:function (text,error) {
            if (error) {
                this.$('.texto-ayuda').html(text).addClass('bg-warnig text-danger');
            }else{
                this.$('.texto-ayuda').html(text).addClass('bg-success text-success');
            }
        },
        enviar_form:function (pass,pass2) {
            var self = this;
            if (pass2 && pass && this.ui && this.token) {
                $.post("/rest-auth/password/reset/confirm/",{
                    uid: this.ui,
                    token: this.token,
                    new_password1: pass,
                    new_password2: pass2
                }).done(function (a) {
                    self.error_mesage('Se Cambio la contraseña correctamente <a href="/usuario/perfil/" class="link"> Ingresar</a>',false);
                    self.$('input').val('');
                }).fail(function (a) {
                    self.error_mesage('Ocurrio un error al cambiar la contraseña, Vuelva a intentarlo',true);
                })
            };
            
        }
    });

    return PageUserView;
});
