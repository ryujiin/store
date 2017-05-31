/*global define*/

define([
    'underscore',
    'backbone',
    'storage',
    '../views/app/loader_full'
], function (_, Backbone,storage,LoaderFull) {
    'use strict';

    var UserModel = Backbone.Model.extend({
        url: '/api/user/perfil/',

        initialize: function() {
            this.buscar_user();
            //this.listenTo(this, 'change', this.buscar_user);
        },
        defaults: {
            fristname:'Anonimo',
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },
        buscar_user:function(){
            this.fetch().done(function (data) {
            })
        },
        logout_user:function(){
            localStorage.removeItem('token_user');
            window.location="/";
        },
        ingresar_user:function (email,pass,vista) {
            var self = this;
            var loader = new LoaderFull();
            $.post("/rest-auth/login/",
                {username: email,password:pass})
            .done(function(data){
                if (data.id!==0) {
                    self.buscar_user();
                    if (vista.model.name==='pedido') {                                                
                        vista.model.set({'paso_actual':2,'ajax':true});
                    }else{
                        Backbone.history.navigate('/usuario/perfil/', {trigger:true})
                    }
                }else{
                    vista.error_login();                       
                }                
            }).fail(function(data){
                vista.error_login();
            }).always(function(){
                loader.remove();
            });
        },
        crear_user:function (email,pass,nombre,apellido,vista) {
            var self = this;
            self.email = email;
            self.pass = pass;
            var loader = new LoaderFull();
            $.post('http://localhost:8000/ajax/crear/',{username:email,password:pass,nombre:nombre,apellido:apellido})
            .done(function (data) {
                if (data.creado===true) {
                    self.ingresar_user(self.email,self.pass);
                };
            }).fail(function (data) {
                vista.error_crear()
            }).always(function(){
                loader.remove();
            });
        }
    });

    var usermodel = new UserModel();
    return usermodel;
});
