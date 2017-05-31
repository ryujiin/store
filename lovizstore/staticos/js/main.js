'use strict';

require.config({
	shim: {
        'owl':{
            deps:['jquery'],
            exports: 'owlCarousel'
        },
        swig: {
            exports: 'Swig'
        },
        'zoom':{
            deps:['jquery'],
            exports: 'zoom',
        },
        'storage':{
            deps:['jquery'],
            exports: 'storage',
        },
        'coockie':{
            deps:['jquery'],
            exports: 'coockie',
        },
        'bootstrap':{
            deps:['jquery'],
        },
        'facetr':{
            deps:['backbone'],
        },
        handlebars: 'handlebars'
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        swig: '../node_modules/swig/dist/swig',
        handlebars: '../bower_components/handlebars/handlebars.min',
        owl: '../vendor/owl/owl.carousel',
        zoom: '../bower_components/jquery-zoom/jquery.zoom',
        storage: '../bower_components/jquery-storage-api/jquery.storageapi',
        coockie: '../vendor/coockie/jquery.cookie',
        facetr:'../vendor/facetas/backbone.facetr'
    }
});

require([
    'backbone',
    '../js/views/app',
    '../js/routers/rutas',
    '../js/views/cms/head'
], function (Backbone,App,Rutas,Header) {
    
    var app = new App();
    
    Backbone.history.start({
        pushState:true,
    });

    function fixDiv() {
        if ($(window).scrollTop()> 34) {
            $('#header').addClass('fijo');
        }else{
            $('#header').removeClass('fijo');
        };
    }
    $(window).scroll(fixDiv);
    fixDiv();

    //node r.js -o build.js

    $(function(){
        $.ajaxSetup({
            crossDomain: true,
            beforeSend: function(xhr, settings) {
                var csrfSafeMethod = function(method) {
                    // these HTTP methods do not require CSRF protection
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                };
                if (!csrfSafeMethod(settings.type)) {
                    var csrftoken = $.cookie('csrftoken');
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    });
});

