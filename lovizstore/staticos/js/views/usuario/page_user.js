/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../models/user',
    '../../views/app/header',
    '../../views/usuario/manage_cuenta',
    '../../views/usuario/manage_direcciones',
    '../../views/usuario/manage_pedidos',    
    '../../views/usuario/manage_deseos',
    '../../views/usuario/user_formCrear',
    '../../views/usuario/user_formLogin',
], function ($, _, Backbone, swig,UserModel,Head,ManageCuenta,ManageDirecciones,ManagePedidos,ManageDeseos,FormCrear,FormLogin) {
    'use strict';

    var PageUserView = Backbone.View.extend({
        el:$('#contenido'),

        tagName: 'div',

        id: '',

        events: {
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.verificar_login);
        },

        render: function () {
            this.template =  swig.compile($('#page_user_tlp').html());
            this.$el.html(this.template(this.model.toJSON()));
            this.crear_modales();
            this.change_head();
            this.finalizo();
        },
        render_anonimo:function () {
            this.template = swig.compile($('#page_user_Anonimo').html())
            this.$el.html(this.template(this.model.toJSON()));
            this.agregarForms();
        },        
        verificar_login:function () {
            if (Backbone.history.fragment=="usuario/perfil/") {
                if (this.model.id) {
                    this.render();
                }else{
                    this.render_anonimo();
                }
            };
        },
        agregarForms:function () {
            var formlogin = new FormLogin({
                model:this.model,
            })
            var formcrear = new FormCrear({
                model:this.model,
            })
            this.$('.columna1').append(formlogin.$el);
            this.$('.columna2').append(formcrear.$el);
        },
        change_head:function () {
            var titulo = 'Mi cuenta | Loviz DelCarpio® :: LovizDC, lovizdc.com';
            var descripcion = "El area de usuario en Loviz DC";
            var header = Head;
            header.render(titulo,descripcion);
        },
        crear_modales:function () {
            this.manage_cuenta = new ManageCuenta({
                el:this.$('#usuario_edit'),
                model:this.model
            });
            this.manage_direccciones = new ManageDirecciones({
                el:this.$('#usuario_direcciones'),
                model:this.model
            });
            this.manage_pedidos = new ManagePedidos({
                el:this.$('#usuario_pedidos'),
            });
            this.manage_lista_deseos = new ManageDeseos({
                el:this.$('#usuario_lista_deseos'),
                model:this.model
            })
        },
        finalizo:function () {
            window.prerenderReady = true;
            
        },
    });
    var page = new PageUserView({model:UserModel})

    return page;
});
