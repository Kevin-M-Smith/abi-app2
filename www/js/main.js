require.config({
    paths: {
        'jquery': 'jquery-2.1.3.min',
        'jquerymobile': 'jquery.mobile-1.4.5.min'
    }
});

require(['app'], function(app) {
    app.initialize();
});


require(['manifiesto', 'jquery', 'jquerymobile'], function(manifiesto, $, jqm) {
    /***************************************
     *	crear listas de órdenes y familias
     ***************************************/
    var ordenes = manifiesto['ordenes'];
    var familias = []
    $( document ).ready(function() {
        $.each(ordenes, function(i, orden) {
            $.each(orden['familias'], function(i,
                                               familia) {
                familias[familias.length] =
                    familia
            });
        });
    });

    /***************************************
     *	función auxiliar para recuperar todas
     *  las familias asociadas a una orden
     ***************************************/
    function _get_familias(_orden) {
        var _familias = '('
        $.each(_orden.familias, function(i, _familia) {
            _familias = _familias + _familia.nombre;
            if (i != (_orden.familias.length - 1)) {
                _familias = _familias + ', ';
            }
        });
        _familias = _familias + ')';
        return (_familias)
    }

    /***************************************
     *	preparar página 'lista-de-ordenes'
     ***************************************/
    $( document ).on("pagecreate", "#pagina-lista-de-ordenes", function() {
        var li = "";
        $.each(ordenes, function(i, _orden) {
            li += '<li><a href="#" id="' + i +
            '" class="info-go"><h2>' + _orden.nombre +
                //   '" class="info-go"><img src="img/icones/' +
                //   _orden.nombre + '.png"><h2>' + _orden.nombre +
            '</h2><p style="white-space:normal;">' +
            _get_familias(_orden) + '</p></a></li>';
        });
        $("#lista-de-ordenes").append(li).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();

                    if(ordenes[this.id]['familias'].length == 1){
                        $("#pagina-de-familia").data("familia", ordenes[this.id]['familias'][0]);
                        $.mobile.changePage("#pagina-de-familia");

                    } else {
                        $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                        $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);
                        $.mobile.changePage("#pagina-lista-de-familias");
                    }
                });

                $(this).listview('refresh');
            });
    });

    /***************************************
     *	preparar página 'rejilla-de-ordenes'
     ***************************************/
    $( document ).on("pagecreate", "#pagina-rejilla-de-ordenes", function() {
        var _grid = '';
        $.each(ordenes, function(i, _orden) {
            if(i % 2 == 0 ){
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><img src="img/icones/' + _orden.nombre + '.png"></a></div>'

                // _grid = _grid + '<div class="ui-block-a">' + _orden.nombre + '</div>'
            } else {
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><img src="img/icones/' + _orden.nombre + '.png"></a></div>'

                // _grid = _grid + '<div class="ui-block-b">' + _orden.nombre + '</div>'
            }
        });

        $("#rejilla-de-ordenes").append(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    if (ordenes[this.id]['familias'].length == 1) {
                        $("#pagina-de-familia").data("familia", ordenes[this.id]['familias'][0]);
                        $.mobile.changePage("#pagina-de-familia");
                    } else {
                        e.preventDefault();
                        $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                        $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);
                        $.mobile.changePage("#pagina-rejilla-de-familias");
                    }
                });

            });

    });

    /***************************************
     *	preparar página 'lista-de-familias'
     ***************************************/
    $(document).on("pagecreate", "#pagina-lista-de-familias", function() {
        $("#lista-de-familias").listview()
    });

    $(document).on("pagebeforeshow", "#pagina-lista-de-familias", function () {
        //get from data - you put this here when the "a" wa clicked in the previous page
        var orden = $(this).data("orden");
        var familias = orden['familias'];

        var li = "";

        $("#encabezado-pagina-lista-de-familias").text(orden.nombre)

        $.each(orden['familias'], function(i, _familia){
            li += '<li><a href="#" class="info-go" id="' + i + '">' + _familia.nombre + '</a></li>'
        });

        $("#lista-de-familias").html(li).promise().done(
            function() {

                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-de-familia").data("familia", familias[this.id]);
                    $.mobile.changePage("#pagina-de-familia");
                });

                $(this).listview('refresh');
            });

    });

    /***************************************
     *	preparar página 'rejilla-de-familias'
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-rejilla-de-familias", function () {
        //get from data - you put this here when the "a" wa clicked in the previous page
        var orden = $(this).data("orden");
        var familias = orden['familias'];
        var _grid = "";

        $("#encabezado-pagina-rejilla-de-familias").text(orden.nombre)

        $.each(orden['familias'], function(i, _familia){
            if(i % 2 == 0 ){
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><h3>' + _familia.nombre + '</h3><img src="' + _familia.fotos[0] + '"></a><hr></div>'

                // _grid = _grid + '<div class="ui-block-a">' + _orden.nombre + '</div>'
            } else {
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><h3>' + _familia.nombre + '</h3><img src="' + _familia.fotos[0] + '"></a><hr></div>'
                // _grid = _grid + '<div class="ui-block-b">' + _orden.nombre + '</div>'
            }
        });

        $("#rejilla-de-familias").html(_grid).promise().done(
            function() {

                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    console.log(this);
                    $("#pagina-de-familia").data("familia", familias[this.id]);
                    $.mobile.changePage("#pagina-de-familia");

                });

            });

    });

    /***************************************
     *	preparar página 'rejilla-de-familia'
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-de-familia", function() {
       var familia = $(this).data("familia")
        var fotos = familia['fotos']
        console.log(fotos)
        var _grid = "";


        $("#encabezado-pagina-de-familia").text(familia.nombre + ' (' + familia.puntos + ')');

        $.each(familia['fotos'], function(i, foto){
            if(i % 2 == 0 ){
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><img src="' + foto + '"></a><hr></div>'
            } else {
                _grid = _grid + '<div class="ui-block-a"><a href="#" class="info-go" id="' + i + '"><img src="' + foto + '"></a><hr></div>'
            }
        });

        $("#rejilla-de-familia").html(_grid).promise().done(
            function() {

                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-foto").data("foto", fotos[this.id]);
                    $("#pagina-foto").data("nombre", familia['nombre']);
                    $.mobile.changePage("#pagina-foto");

                });

            });

    });


    $(document).on("pagebeforeshow", "#pagina-foto", function() {
    var foto = $(this).data("foto")
    var nombre = $(this).data("nombre")
        console.log(foto)

        $("#encabezado-pagina-foto").text(nombre)
        $("#foto-grande").attr('src', foto)

    });




});



