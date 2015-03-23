require.config({
    paths: {
        'jquery': 'jquery-2.1.3.min',
        'jquery.mobile': 'jquery.mobile-1.4.5.min',
        'leaflet': 'leaflet-0.7.3',
        'wq/locate': 'wq/locate'
    }
});

require(['app'], function(app) {
    app.initialize();
});


require(['manifiesto', 'jquery', 'jquery.mobile', 'leaflet', 'wq/locate'], function(manifiesto, $, jqm, L, locate) {
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
                    $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                    $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);

                    if(ordenes[this.id]['familias'].length == 1){
                        $("#pagina-de-familia").data("familia", ordenes[this.id]['familias'][0]);
                        $("#pagina-de-familia").data("pagina-anterior", '#pagina-lista-de-ordenes')
                        $.mobile.changePage("#pagina-de-familia");
                    } else {
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
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><img src="img/icones/'
                + _orden.nombre + '.png"></a></div>';
        });

        $("#rejilla-de-ordenes").append(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                    $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);
                    if (ordenes[this.id]['familias'].length == 1) {
                        $("#pagina-de-familia").data("familia", ordenes[this.id]['familias'][0]);
                        $("#pagina-de-familia").data("pagina-anterior", '#pagina-rejilla-de-ordenes')
                        $.mobile.changePage("#pagina-de-familia");
                    } else {
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

        $("#lista-de-familias").off()
        $("#lista-de-familias").html(li).promise().done(
            function() {

                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-de-familia").data("familia", familias[this.id])
                    $("#pagina-de-familia").data("pagina-anterior", '#pagina-lista-de-familias')
                    $.mobile.changePage("#pagina-de-familia");
                });

                $(this).listview('refresh');
            });

    });

    /***************************************
     *	preparar página 'rejilla-de-familias'
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-rejilla-de-familias", function () {
        var orden = $(this).data("orden");
        var familias = orden['familias'];
        var _grid = "";

        $("#encabezado-pagina-rejilla-de-familias").text(orden.nombre)

        $.each(familias, function(i, _familia){
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><h3>'
                + _familia.nombre
                + '</h3><img src="'
                + _familia.fotos[0]
                + '"></a><hr></div>';
        });

        $("#rejilla-de-familias").off()
        $("#rejilla-de-familias").html(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    console.log(this);
                    $("#pagina-de-familia").data("familia", familias[this.id]);
                    $("#pagina-de-familia").data("pagina-anterior", '#pagina-rejilla-de-familias')
                    $.mobile.changePage("#pagina-de-familia");

                });

            });

    });

    /***************************************
     *	preparar página de familia
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-de-familia", function() {
        var familia = $(this).data("familia");
        var fotos = familia['fotos'];
        var pagina_anterior = $(this).data("pagina-anterior")
        var _grid = "";

        $("#encabezado-pagina-de-familia").text(familia.nombre + ' (' + familia.puntos + ')');
        $("#boton-atras-pagina-de-familia").attr('href', pagina_anterior);

        $.each(familia['fotos'], function(i, foto){
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><img src="'
                + foto + '"></a><hr></div>';
        });

        $("#boton-pagina-de-familia-entregar").off()
        $("#boton-pagina-de-familia-entregar").one("click", function (e) {
            e.preventDefault();
            $("#pagina-de-encuesta-lista-de-familias").append('<li><a href="#demo-mail"><p class="nombre-de-familia">'
            + familia.nombre + ' (' + familia.puntos + ')</p></a><a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');
            $.mobile.changePage("#pagina-de-encuesta-nueva-familias");

            console.log(familia.nombre)
        });

        $("#boton-pagina-de-familia-entregar-inferior").off()
        $("#boton-pagina-de-familia-entregar-inferior").one("click", function (e) {
            e.preventDefault();
            $("#pagina-de-encuesta-lista-de-familias").append('<li><a href="#demo-mail"><p class="nombre-de-familia">'
            + familia.nombre + ' (' + familia.puntos + ')</p></a><a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');
            $.mobile.changePage("#pagina-de-encuesta-nueva-familias");

            console.log(familia.nombre)
        });


        $("#rejilla-de-familia").off()
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
        var foto = $(this).data("foto");
        var nombre = $(this).data("nombre");
        $("#encabezado-pagina-foto").text(nombre);
        $("#foto-grande").attr('src', foto);
        
        $("#boton-atras-pagina-foto").off()
        $("#boton-atras-pagina-foto").on("click", function(e) {
            $.mobile.changePage("#pagina-de-familia")
        });

    });


    $(document).on("pagecreate", "#pagina-mapa", function(e){

        L.Icon.Default.imagePath = 'css/images';

        var map = L.map('mapa');

        //L.tileLayer('img/mapas/medford/{z}/{x}/{y}.jpg', {
        //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //}).addTo(map);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


        var fields = {
            'toggle': $('input[name=mode]'),
            'latitude': $('input[name=latitude]'),
            'longitude': $('input[name=longitude]'),
            'accuracy': $('input[name=accuracy]')
        };

        var config = {
            // Custom handler for location updates
            'onUpdate': function(loc, accuracy) {
                if (accuracy > 1000) {
                    $('#message').html(
                        "Note: your location accuracy appears to be off by more than 1km."
                    );
                } else {
                    $('#message').html("");
                }
            }
        }

        var locator = locate.locator(map, fields, config);


        //map.on('locationfound', function(e){
        //    var marker = new L.Marker(e.latlng, {
        //        icon:	new L.NumberedDivIcon({number: '1'})
        //    });
        //    marker.addTo(map)
        //});
        //
        //map.on('locationerror', function(e){
        //    alert(e.message);
        //});
        //
        //map.locate({setView: true, maxZoom: 18});

    });


    /***************************************
     *    pagina-de-encuesta-nueva-foto
     ***************************************/

    $(document).on("pagecreate", "#pagina-de-encuesta-nueva-foto", function (e) {
        $("#boton-pagina-de-encuesta-nueva-foto-entregar").one("click", function (e) {
            $("#boton-pagina-de-encuesta-nueva-foto").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-foto-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        });
    });


    /***************************************
     *    pagina-de-encuesta-nueva-fecha-y-hora
     ***************************************/

    $(document).on("pagecreate", "#pagina-de-encuesta-nueva-fecha-y-hora", function (e) {
        $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-entregar").on("click", function (e) {
            $("#boton-pagina-de-encuesta-nueva-fecha-y-hora").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        });
    });


    /***************************************
     *    pagina-de-encuesta-familias
     ***************************************/

    $(document).on("pagecreate", "#pagina-de-encuesta-nueva-familias", function (e) {

        function confirmAndDelete(listitem) {
            listitem.addClass("ui-btn-down-d");
            $("#confirm .nombre-de-familia").remove();
            listitem.find(".nombre-de-familia").clone().insertAfter("#question");
            $("#confirm").popup("open");
            $("#confirm #yes").on("click", function () {
                listitem.remove();
                $("#pagina-de-encuesta-lista-de-familias").listview("refresh");
            });

            $("#confirm #cancel").on("click", function () {
                listitem.removeClass("ui-btn-down-d");
                $("#confirm #yes").off();
            });
        }

        $(document).on("click", "#pagina-de-encuesta-lista-de-familias li", function (e) {
            confirmAndDelete($(this));
        });


        $("#boton-pagina-de-encuesta-nueva-familias-entregar").one("click", function (e) {
            $("#boton-pagina-de-encuesta-nueva-familias").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-familias-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        });
    });



});



