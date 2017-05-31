define([
    'jquery',
    'backbone',
    '../views/cms/pagina',    
    '../views/catalogo/page_catalogo',
    '../views/productoSingle/page_producto',
    '../views/carro/page_carro',
    '../views/procesar/page_procesar',
    '../views/usuario/page_user',
    '../views/usuario/page_reset_pass',
], function ($, Backbone,PaginaView,CatalogoView,PageProductoSingle,PageCarro,PageProcesar,PageUser,PageReset) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            "":"root",
            "p/:slug/":"pagina",
            'catalogo/:categoria/':'catalogo',
            "producto/:slug/":'productoSingle',            
            'usuario/perfil/':'perfil',
            'usuario/reset/password/:ui/:token/':'form_reset_pass',
            'carro/':'carro_page',            
            'procesar-compra/':'procesar_compra',    
            'felicidades/':'',          
            '*notFound': 'notFound',
        },
        initialize:function(){
            this.bind('route', this._pageView);
        },
        root:function(){
            PaginaView.buscar_page('home');
            var parametros = {
                ecomm_pagetype: 'home',
            }
            this.send_tracker(parametros);
        },
        pagina:function (slug) {
            PaginaView.buscar_page(slug);
        },
        catalogo:function (categoria) {
            if (categoria==='ofertas') {
                CatalogoView.catalogo_oferta('ofertas');
            }else{
                CatalogoView.get_categoria(categoria);
            }
        },
        perfil:function(){
            if ($.localStorage.get('pagina_procesar')===true) {
                $.localStorage.remove('pagina_procesar');
                this.navigate('procesar-compra/',{trigger: true});
            };
            PageUser.verificar_login();
        },
        productoSingle:function (slug) {
            PageProductoSingle.get_modelo(slug);
        },
        carro_page:function () {
            PageCarro.render();
            var parametros = {
                ecomm_pagetype: 'cart',
            }
            this.send_tracker(parametros);
        },
        procesar_compra:function () {
            PageProcesar.verificar_render();
        },
        form_reset_pass:function (ui,token) {
            new PageReset(ui,token);
        },
        felicidades:function () {
            debugger;
        },
        _pageView:function () {
            var path = Backbone.history.getFragment();
            ga('send', 'pageview', {page: "/" + path});
        },
        send_tracker:function (parametros) {
            window.google_trackConversion({
              google_conversion_id: 1017839300, 
              google_custom_params: parametros,
              google_remarketing_only: true
            });
        },
        notFound:function () {
            $('body').removeClass();
            PaginaView.render_404();
        },
    });

    var rutas = new AppRouter();

    return rutas;
});
