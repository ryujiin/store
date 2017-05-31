/*global define*/

/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'swig',
    '../../collections/categorias',
    '../../views/catalogo/catalogo',
    '../../views/cms/breadcrumb',
    '../../views/catalogo/refinamientos',
    '../../views/catalogo/num_catalogo',
    'headModel'
], function ($, _, Backbone, swig,CategoriaCollection,CatalogoView,BreadcumbView,Refinamiento,Num_Catalogo,HeadModel) {
    'use strict';

    var PageCatalogoView = Backbone.View.extend({
        el:$('#contenido'),
        template: swig.compile($('#page_catalogo_template').html()),        

        tagName: 'div',

        id: '',

        className: '',

        collection: new CategoriaCollection(),

        events: {
            'click .sort_by li':'catalogo_sort_by',
            'click .refinar':'mostrar_refino',
            'click .modo_lista .no-activo':'modificar_vista',
        },

        initialize: function () {
        },
        render:function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.filtros = new Backbone.Collection();            
            this.crear_catalogo();
            this.crear_refinamientos();
            this.crear_breadcrum();
            this.header();
        },
        get_categoria:function (categoria) {
            var self = this;
            var coincidencia = this.collection.findWhere({slug:categoria});
            if (coincidencia === undefined) {
                this.collection.fetch().done(function (e) {
                    var encontrado = false;
                    e.forEach(function(e,i){
                        if (e.slug === categoria) {
                            encontrado = true;
                            self.get_categoria(categoria);
                        };
                    });
                    if (encontrado === false){
                        Backbone.history.navigate('error404',{trigger:true})
                    }
                })
            }else{
                this.model = coincidencia;
                this.render();
            }
        },
        catalogo_oferta:function () {
            this.model = new Backbone.Model({
                "nombre": "Ofertas Loviz DC",
                "titulo_seo": "Ofertas De Loviz DelCarpio",
                'slug':'ofertas',
            });
            this.render();
        },
        crear_catalogo:function () {
            this.num_catalogo_model = new Backbone.Model();
            this.catalogo = new CatalogoView({
                el:this.$('.catalogo_productos'),
                collection:this.filtros,
                model:this.num_catalogo_model,
            });
            var vista_num_catalogo = new Num_Catalogo({
                el:this.$('.catalogo_num_refino'),
                model:this.num_catalogo_model,
            });
            this.catalogo.buscar(this.model.toJSON().slug);
        },
        crear_breadcrum:function () {
            this.breadcrumb = new BreadcumbView({
                el:this.$('.nav-breadcrumb'),
                collection:this.collection,
                model:this.model,
            });
        },
        header:function () {
            var titulo,descripcion;
            if (this.model.toJSON().titulo_seo) {
                titulo = this.model.toJSON().titulo_seo;
            }else{
                titulo = this.model.toJSON().nombre;
            }
            HeadModel.set({
                titulo:titulo,
                descripcion:this.model.toJSON().descripcion,
            })
        },
        crear_refinamientos:function () {
            this.refinamiento = new Refinamiento({
                el:this.$('.section-refinamiento'),
                collection:this.filtros,
                model:this.model,
            })
            this.refinamiento.render(this.collection)
        },
        catalogo_sort_by:function (e) {
            var ordenar = e.target.dataset.sortby;
            var modo = e.target.dataset.modo;
            this.catalogo.sort_by(ordenar,modo);
            this.num_catalogo_model.set({'sortby':e.target.innerText});
        },
        mostrar_refino:function () {
            this.refinamiento.mostrar_cuadro()
        },
        modificar_vista:function (e) {
            this.$('.modo_lista button').removeClass('no-activo activo').addClass('no-activo');
            this.$(e.currentTarget).removeClass('.no-activo').addClass('activo');
            if (e.currentTarget.dataset.lista=='si') {
                this.$('.lista-productos').addClass('lista-uno');
            }else{
                this.$('.lista-productos').removeClass('lista-uno');                
            }
        }
    });

    var catalogopage = new PageCatalogoView();

    return catalogopage;
});
