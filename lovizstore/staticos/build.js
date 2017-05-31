({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        swig: '../node_modules/swig/dist/swig',
        owl: '../vendor/owl/owl.carousel',
        zoom: '../bower_components/jquery-zoom/jquery.zoom',
        storage: '../bower_components/jquery-storage-api/jquery.storageapi',
        coockie: '../vendor/coockie/jquery.cookie',
        facetr:'../vendor/facetas/backbone.facetr',
    },
})